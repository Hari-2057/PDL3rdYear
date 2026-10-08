from typing import Dict, Any, List
from app.agents.base import BaseAgent

class POMatchingAgent(BaseAgent):
    name = "PO Matching Agent"

    def run(self, state: Dict[str, Any]) -> Dict[str, Any]:
        extracted = state.get("extracted_invoice", {})
        po_database = state.get("po_database", []) # List of PO dicts or ORM models
        
        inv_po_num = extracted.get("po_number")
        inv_vendor = extracted.get("vendor_name", "")
        inv_total = float(extracted.get("total", 0.0))
        inv_subtotal = float(extracted.get("subtotal", 0.0))

        mismatches: List[str] = []
        po_found = None

        # Search PO database for PO matching number
        if inv_po_num:
            for po in po_database:
                po_number = po.get("po_number") if isinstance(po, dict) else getattr(po, "po_number", None)
                if po_number == inv_po_num:
                    po_found = po
                    break

        if not inv_po_num or not po_found:
            mismatches.append(f"Purchase Order '{inv_po_num}' not found in PO registry.")
            po_match_result = {
                "po_match": False,
                "po_found": False,
                "po_number": inv_po_num,
                "po_amount": 0.0,
                "invoice_amount": inv_total,
                "amount_difference": inv_total,
                "variance_percentage": 100.0,
                "mismatches": mismatches
            }
            state["po_match_result"] = po_match_result
            state["po_matching_agent_status"] = "WARNING"
            state["po_matching_agent_summary"] = f"PO Check: PO '{inv_po_num}' not found. Marked as Missing PO."
            return state

        # If PO found, extract properties
        po_vendor = po_found.get("vendor_name") if isinstance(po_found, dict) else getattr(po_found, "vendor_name", "")
        po_amount = float(po_found.get("total_amount") if isinstance(po_found, dict) else getattr(po_found, "total_amount", 0.0))
        
        # 1. Vendor Match Check
        if inv_vendor and po_vendor and inv_vendor.strip().lower() != po_vendor.strip().lower():
            mismatches.append(f"Vendor mismatch: Invoice vendor '{inv_vendor}' does not match PO vendor '{po_vendor}'.")

        # 2. Amount & Variance Calculation
        # Check subtotal against PO total or invoice total against PO total
        target_inv_amt = inv_subtotal if inv_subtotal > 0 else inv_total
        amount_diff = round(target_inv_amt - po_amount, 2)
        variance_pct = round((amount_diff / po_amount) * 100.0, 2) if po_amount > 0 else 0.0

        if amount_diff > 0:
            mismatches.append(f"Amount mismatch: Invoice subtotal (₹{target_inv_amt:,.2f}) exceeds PO amount (₹{po_amount:,.2f}) by ₹{amount_diff:,.2f} ({variance_pct}% variance).")

        po_matched = (len(mismatches) == 0 and abs(variance_pct) <= 2.0)

        po_match_result = {
            "po_match": po_matched,
            "po_found": True,
            "po_number": inv_po_num,
            "po_amount": po_amount,
            "invoice_amount": target_inv_amt,
            "amount_difference": amount_diff,
            "variance_percentage": variance_pct,
            "mismatches": mismatches
        }

        state["po_match_result"] = po_match_result
        state["po_matching_agent_status"] = "SUCCESS" if po_matched else "WARNING"
        
        if po_matched:
            state["po_matching_agent_summary"] = f"PO Match Successful: 100% match with {inv_po_num} (₹{po_amount:,.2f})."
        else:
            state["po_matching_agent_summary"] = f"PO Match Discrepancy: {variance_pct}% variance against {inv_po_num} (₹{amount_diff:,.2f} difference)."

        return state
