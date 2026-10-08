from typing import Dict, Any, List
from app.agents.base import BaseAgent

class DecisionAgent(BaseAgent):
    name = "Decision Agent"

    def run(self, state: Dict[str, Any]) -> Dict[str, Any]:
        validation = state.get("validation_result", {})
        po_match = state.get("po_match_result", {})
        policy = state.get("policy_result", {})
        fraud = state.get("fraud_result", {})
        
        risk_score = state.get("risk_score", fraud.get("total_risk_score", 0))
        risk_level = state.get("risk_level", fraud.get("risk_level", "Low"))

        reasons: List[str] = []
        requires_human_review = False
        decision = "APPROVE"

        # 1. Critical Failures & Hard Rejections
        is_duplicate = any("Duplicate invoice" in err for err in validation.get("errors", []))
        if is_duplicate:
            decision = "REJECT"
            requires_human_review = True
            reasons.append("Duplicate invoice submission detected in corporate registry.")

        # 2. High/Critical Risk Evaluation
        elif risk_score >= 80:
            decision = "REVIEW" # Or REJECT depending on exact rule
            requires_human_review = True
            reasons.append(f"Critical Risk Score ({risk_score}/100) triggered automatic human review gate.")

        # 3. Policy & PO Mismatch Evaluation
        elif not po_match.get("po_match") or not policy.get("policy_compliant") or risk_score > 30:
            decision = "REVIEW"
            requires_human_review = True

            if not po_match.get("po_match"):
                misms = po_match.get("mismatches", [])
                if misms:
                    reasons.append(misms[0])
                else:
                    reasons.append(f"Invoice PO variance ({po_match.get('variance_percentage', 0)}%) exceeds allowed tolerance.")

            if not policy.get("policy_compliant"):
                viols = policy.get("violations", [])
                if viols:
                    reasons.append(viols[0])

            if risk_score > 30:
                reasons.append(f"Elevated risk score ({risk_score}/100, {risk_level} Risk).")

        # 4. Low Risk Auto-Approval
        else:
            decision = "APPROVE"
            requires_human_review = False
            reasons.append("Invoice passed all automated OCR, validation, PO matching, and policy checks with Low Risk profile.")

        reason_summary = " ".join(reasons) if reasons else "Routine automated clearance."

        state["decision"] = decision
        state["decision_reason"] = reason_summary
        state["requires_human_review"] = requires_human_review
        state["decision_agent_status"] = "SUCCESS"
        state["decision_agent_summary"] = (
            f"Final Decision: {decision} (Risk: {risk_score}/100, Human Review Required: {requires_human_review})."
        )

        return state
