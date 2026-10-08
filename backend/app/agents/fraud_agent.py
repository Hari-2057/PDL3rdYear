from typing import Dict, Any, List
from app.agents.base import BaseAgent

class FraudDetectionAgent(BaseAgent):
    name = "Fraud & Anomaly Agent"

    def run(self, state: Dict[str, Any]) -> Dict[str, Any]:
        extracted = state.get("extracted_invoice", {})
        validation = state.get("validation_result", {})
        po_match = state.get("po_match_result", {})
        policy = state.get("policy_result", {})
        vendor_db = state.get("vendor_database", [])

        inv_number = extracted.get("invoice_number", "")
        inv_vendor = extracted.get("vendor_name", "")
        inv_total = float(extracted.get("total", 0.0))
        subtotal = float(extracted.get("subtotal", 0.0))
        tax = float(extracted.get("tax", 0.0))

        risk_score = 0
        breakdown: List[Dict[str, Any]] = []
        anomalies: List[str] = []

        # 1. Duplicate Invoice Number Check
        for val_err in validation.get("errors", []):
            if "Duplicate invoice" in val_err:
                risk_score += 70
                breakdown.append({
                    "factor": "Duplicate Invoice Detected",
                    "score": 70,
                    "description": val_err
                })
                anomalies.append("Duplicate invoice submission attempt.")

        # 2. Amount Mismatch & PO Variance Risk
        if po_match.get("po_found") and not po_match.get("po_match"):
            var_pct = abs(float(po_match.get("variance_percentage", 0.0)))
            po_risk = min(int(var_pct * 1.8), 35)
            risk_score += po_risk
            breakdown.append({
                "factor": "PO Amount Variance",
                "score": po_risk,
                "description": f"Invoice deviates by {var_pct}% from Purchase Order baseline."
            })
            anomalies.append(f"PO variance of {var_pct}%.")

        # 3. Missing Purchase Order Risk
        if not po_match.get("po_found") and inv_total >= 10000.0:
            risk_score += 35
            breakdown.append({
                "factor": "Missing Purchase Order",
                "score": 35,
                "description": f"No valid PO linked to transaction worth ₹{inv_total:,.2f}."
            })
            anomalies.append("Unlinked high-value transaction.")

        # 4. Vendor Anomaly Check
        vendor_found = False
        vendor_risk_tier = "Low"
        for v in vendor_db:
            v_name = v.get("name") if isinstance(v, dict) else getattr(v, "name", "")
            if v_name and v_name.strip().lower() == inv_vendor.strip().lower():
                vendor_found = True
                vendor_risk_tier = v.get("risk_level") if isinstance(v, dict) else getattr(v, "risk_level", "Low")
                break

        if not vendor_found:
            risk_score += 25
            breakdown.append({
                "factor": "Unregistered / Unknown Vendor",
                "score": 25,
                "description": f"Vendor '{inv_vendor}' is not in approved corporate supplier directory."
            })
            anomalies.append("Unregistered vendor entity.")
        elif vendor_risk_tier in ["High", "Critical"]:
            risk_score += 20
            breakdown.append({
                "factor": "High-Risk Vendor Tier",
                "score": 20,
                "description": f"Vendor '{inv_vendor}' has historical high risk profile ({vendor_risk_tier})."
            })

        # 5. Tax & Math Anomaly
        for val_warn in validation.get("warnings", []):
            if "Tax" in val_warn:
                risk_score += 15
                breakdown.append({
                    "factor": "Tax Calculation Discrepancy",
                    "score": 15,
                    "description": val_warn
                })
                anomalies.append("Irregular tax percentage calculation.")

        # 6. Policy Violation Penalty
        for viol in policy.get("violations", []):
            risk_score += 15
            breakdown.append({
                "factor": "Corporate Policy Violation",
                "score": 15,
                "description": viol
            })

        # Cap total risk score at 100
        total_risk_score = min(max(risk_score, 0), 100)

        if total_risk_score <= 30:
            risk_level = "Low"
        elif total_risk_score <= 60:
            risk_level = "Medium"
        elif total_risk_score <= 80:
            risk_level = "High"
        else:
            risk_level = "Critical"

        fraud_result = {
            "total_risk_score": total_risk_score,
            "risk_level": risk_level,
            "breakdown": breakdown,
            "anomalies": anomalies
        }

        state["fraud_result"] = fraud_result
        state["risk_score"] = total_risk_score
        state["risk_level"] = risk_level
        state["fraud_agent_status"] = "SUCCESS" if total_risk_score <= 30 else ("WARNING" if total_risk_score <= 60 else "FAILED")
        state["fraud_agent_summary"] = f"Fraud & Anomaly Scan: Assessed Risk Score {total_risk_score}/100 ({risk_level.upper()} RISK)."

        return state
