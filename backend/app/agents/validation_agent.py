import datetime
from typing import Dict, Any, List
from app.agents.base import BaseAgent

class ValidationAgent(BaseAgent):
    name = "Validation Agent"

    def run(self, state: Dict[str, Any]) -> Dict[str, Any]:
        extracted = state.get("extracted_invoice", {})
        existing_invoices = state.get("existing_invoices", [])
        
        errors: List[str] = []
        warnings: List[str] = []

        # 1. Required Fields Check
        if not extracted.get("vendor_name"):
            errors.append("Missing vendor name.")
        if not extracted.get("invoice_number"):
            errors.append("Missing invoice number.")
        if not extracted.get("invoice_date"):
            errors.append("Missing invoice date.")
        if extracted.get("total", 0.0) <= 0:
            errors.append("Total amount must be greater than zero.")

        # 2. Date Validation
        inv_date_str = extracted.get("invoice_date")
        due_date_str = extracted.get("due_date")
        if inv_date_str and due_date_str:
            try:
                inv_dt = datetime.datetime.strptime(inv_date_str, "%Y-%m-%d")
                due_dt = datetime.datetime.strptime(due_date_str, "%Y-%m-%d")
                if due_dt < inv_dt:
                    errors.append(f"Due date ({due_date_str}) cannot be before invoice date ({inv_date_str}).")
            except ValueError:
                # Format string warning
                pass

        # 3. Duplicate Invoice Number Check
        inv_num = extracted.get("invoice_number")
        current_inv_id = state.get("invoice_id")
        if inv_num:
            for prev_inv in existing_invoices:
                # If existing invoice has same number and different ID
                prev_id = prev_inv.get("id") if isinstance(prev_inv, dict) else getattr(prev_inv, "id", None)
                prev_num = prev_inv.get("invoice_number") if isinstance(prev_inv, dict) else getattr(prev_inv, "invoice_number", None)
                if prev_num == inv_num and prev_id != current_inv_id:
                    errors.append(f"Duplicate invoice number '{inv_num}' detected in system.")
                    break

        # 4. Total & Subtotal Math Calculation Check
        subtotal = float(extracted.get("subtotal", 0.0))
        tax = float(extracted.get("tax", 0.0))
        total = float(extracted.get("total", 0.0))

        if subtotal > 0 and tax >= 0 and total > 0:
            calculated_total = round(subtotal + tax, 2)
            if abs(calculated_total - total) > 1.0: # allow minor rounding margin
                errors.append(f"Subtotal ({subtotal}) + Tax ({tax}) = {calculated_total}, which does not match total amount ({total}).")

        # 5. Tax Calculation Verification
        items = extracted.get("line_items", [])
        if items and subtotal > 0:
            # Check tax calculation
            avg_tax_pct = sum(it.get("tax_percentage", 18.0) for it in items) / len(items)
            expected_tax = round(subtotal * (avg_tax_pct / 100.0), 2)
            if tax > 0 and abs(expected_tax - tax) > (subtotal * 0.03):
                warnings.append(f"Tax amount (₹{tax}) deviates from expected GST rate ({avg_tax_pct}% of ₹{subtotal} = ₹{expected_tax}).")

        # 6. Currency Verification
        currency = extracted.get("currency", "INR")
        valid_currencies = ["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD"]
        if currency not in valid_currencies:
            warnings.append(f"Unusual currency code '{currency}'. Expected standard currency.")

        valid = len(errors) == 0

        validation_result = {
            "valid": valid,
            "errors": errors,
            "warnings": warnings
        }

        state["validation_result"] = validation_result
        state["validation_agent_status"] = "SUCCESS" if valid else ("WARNING" if warnings else "FAILED")
        
        status_desc = "valid" if valid else f"invalid with {len(errors)} error(s)"
        warn_desc = f", {len(warnings)} warning(s)" if warnings else ""
        state["validation_agent_summary"] = f"Invoice rules check completed: Document is {status_desc}{warn_desc}."

        return state
