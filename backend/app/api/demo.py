import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Invoice, PurchaseOrder, Vendor, Policy
from app.schemas.invoice import InvoiceSchema
from app.api.invoices import process_invoice_agents

router = APIRouter(prefix="/api/demo", tags=["Interactive Demo Engine"])

class DemoTriggerRequest(BaseModel):
    scenario: Optional[str] = "amount_mismatch" # options: amount_mismatch, perfect_invoice, missing_po, tax_mismatch, duplicate_invoice

@router.post("/process", response_model=InvoiceSchema)
def trigger_demo_process(req: DemoTriggerRequest, db: Session = Depends(get_db)):
    scenario = req.scenario or "amount_mismatch"
    timestamp_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

    if scenario == "amount_mismatch":
        inv = Invoice(
            invoice_number=f"INV-10245-DEMO",
            vendor_name="ABC Technologies",
            vendor_id=1,
            po_number="PO-10023",
            po_id=1,
            document_url="/uploads/invoices/INV-10245.pdf",
            file_type="PDF",
            raw_text="""INVOICE
Vendor: ABC Technologies
Address: 101 Tech Park, Electronic City, Bengaluru - 560100
GSTIN: GSTIN29ABCDE1234F1Z5
Invoice Number: INV-10245-DEMO
Invoice Date: 2026-08-10
Due Date: 2026-09-10
Purchase Order Number: PO-10023
Payment Terms: Net 30

Bill To: Enterprise Corp India Ltd.
Currency: INR

Line Items:
1. Enterprise Cloud Server Licenses - Qty: 5.0, Unit Price: 50,000.00, Tax (18%): 45,000.00, Total: 250,000.00

Subtotal: 250,000.00
Tax Total (GST 18%): 45,000.00
Total Amount Payable: 295,000.00
""",
            subtotal=250000.0,
            tax=45000.0,
            total_amount=295000.0,
            status="Processing",
            risk_score=0,
            risk_level="Low",
            decision="PENDING",
            requires_human_review=False
        )

    elif scenario == "perfect_invoice":
        inv = Invoice(
            invoice_number=f"INV-88901-DEMO",
            vendor_name="Global Office Supplies",
            vendor_id=2,
            po_number="PO-10024",
            po_id=2,
            document_url="/uploads/invoices/INV-88901.pdf",
            file_type="PDF",
            raw_text="""INVOICE
Vendor: Global Office Supplies
Invoice Number: INV-88901-DEMO
Invoice Date: 2026-08-08
Due Date: 2026-09-08
PO Number: PO-10024
Currency: INR
Subtotal: 15,000.00
Tax Total (GST 18%): 2,700.00
Total Amount Payable: 17,700.00
""",
            subtotal=15000.0,
            tax=2700.0,
            total_amount=17700.0,
            status="Processing",
            risk_score=0,
            risk_level="Low",
            decision="PENDING",
            requires_human_review=False
        )

    elif scenario == "missing_po":
        inv = Invoice(
            invoice_number=f"INV-77342-DEMO",
            vendor_name="Precision Consulting",
            vendor_id=5,
            po_number=None,
            document_url="/uploads/invoices/INV-77342.pdf",
            file_type="PDF",
            raw_text="""INVOICE
Vendor: Precision Consulting
Invoice Number: INV-77342-DEMO
Invoice Date: 2026-08-05
Due Date: 2026-09-05
Currency: INR
Subtotal: 150,000.00
Tax Total (GST 18%): 27,000.00
Total Amount Payable: 177,000.00
""",
            subtotal=150000.0,
            tax=27000.0,
            total_amount=177000.0,
            status="Processing",
            risk_score=0,
            risk_level="Low",
            decision="PENDING",
            requires_human_review=False
        )

    else: # Default amount mismatch
        inv = Invoice(
            invoice_number=f"INV-55102-DEMO",
            vendor_name="Starlight Hardware Corp",
            vendor_id=6,
            po_number="PO-10028",
            po_id=6,
            document_url="/uploads/invoices/INV-55102.pdf",
            file_type="PDF",
            raw_text="""INVOICE
Vendor: Starlight Hardware Corp
Invoice Number: INV-55102-DEMO
PO Number: PO-10028
Subtotal: 100,000.00
Tax: 32,000.00
Total: 132,000.00
""",
            subtotal=100000.0,
            tax=32000.0,
            total_amount=132000.0,
            status="Processing",
            risk_score=0,
            risk_level="Low",
            decision="PENDING",
            requires_human_review=False
        )

    db.add(inv)
    db.commit()
    db.refresh(inv)

    # Process through multi-agent workflow graph
    processed_inv = process_invoice_agents(inv.id, db)
    return processed_inv
