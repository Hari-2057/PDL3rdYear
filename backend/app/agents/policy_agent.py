from typing import Dict, Any, List
from app.agents.base import BaseAgent

class PolicyAgent(BaseAgent):
    name = "Policy Agent"

    def run(self, state: Dict[str, Any]) -> Dict[str, Any]:
        extracted = state.get("extracted_invoice", {})
        po_match = state.get("po_match_result", {})
        policies = state.get("policies", [])

        inv_total = float(extracted.get("total", 0.0))
        inv_po_num = extracted.get("po_number")
        variance_pct = float(po_match.get("variance_percentage", 0.0))
        
        violations: List[str] = []

        # Default fallback policy thresholds if policies list is empty
        auto_approve_limit = 50000.0
        max_po_variance = 10.0
        po_required_threshold = 10000.0
        manager_approval_threshold = 50000.0
        finance_approval_threshold = 200000.0

        # Evaluate against configurable policies if passed
        for policy in policies:
            name = policy.get("name") if isinstance(policy, dict) else getattr(policy, "name", "")
            thresh = float(policy.get("threshold") if isinstance(policy, dict) else getattr(policy, "threshold", 0.0))
            is_act = policy.get("is_active") if isinstance(policy, dict) else getattr(policy, "is_active", True)
            
            if not is_act:
                continue

            if "Auto Approval Limit" in name:
                auto_approve_limit = thresh
            elif "Maximum PO Variance" in name:
                max_po_variance = thresh
            elif "PO Required" in name:
                po_required_threshold = thresh
            elif "Manager Approval" in name:
                manager_approval_threshold = thresh
            elif "Finance" in name:
                finance_approval_threshold = thresh

        # 1. PO Variance Policy Check
        if po_match.get("po_found") and variance_pct > max_po_variance:
            violations.append(
                f"Policy Violation: Invoice PO variance ({variance_pct:.1f}%) exceeds maximum allowable threshold ({max_po_variance:.1f}%)."
            )

        # 2. Required PO Check
        if inv_total >= po_required_threshold and not inv_po_num:
            violations.append(
                f"Policy Violation: Purchase Order is strictly required for invoices above ₹{po_required_threshold:,.2f}."
            )

        # 3. Financial Threshold Tier Flags
        requires_finance_manager = False
        requires_manager_review = False

        if inv_total >= finance_approval_threshold:
            requires_finance_manager = True
            violations.append(
                f"Tier Clearance: High-value transaction (₹{inv_total:,.2f}) requires Senior Finance Director authorization."
            )
        elif inv_total >= manager_approval_threshold:
            requires_manager_review = True

        policy_compliant = (len(violations) == 0)

        policy_result = {
            "policy_compliant": policy_compliant,
            "violations": violations,
            "requires_finance_manager": requires_finance_manager,
            "requires_manager_review": requires_manager_review
        }

        state["policy_result"] = policy_result
        state["policy_agent_status"] = "SUCCESS" if policy_compliant else "WARNING"
        state["policy_agent_summary"] = (
            "Policy Engine: Compliant with all corporate expenditure rules."
            if policy_compliant
            else f"Policy Engine: Flagged {len(violations)} rule violation(s)."
        )

        return state
