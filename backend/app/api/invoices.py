import os
import shutil
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import (
    Invoice, InvoiceItem, ExceptionItem, AgentExecution, RiskAssessment,
    PurchaseOrder, Vendor, Policy, AuditLog, Notification
)
from app.schemas.invoice import InvoiceSchema, AgentExecutionSchema, ExceptionItemSchema
from app.auth.jwt import get_current_user
from app.agents.workflow import agent_workflow

router = APIRouter(prefix="/api/invoices", tags=["Invoices"])

UPLOAD_DIR = "./uploads/invoices"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("", response_model=List[InvoiceSchema])
def list_invoices(
    status: Optional[str] = None,
    risk_level: Optional[str] = None,
    vendor_name: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Invoice)
    if status and status != "All":
        query = query.filter(Invoice.status == status)
    if risk_level and risk_level != "All":
        query = query.filter(Invoice.risk_level == risk_level)
    if vendor_name and vendor_name != "All":
        query = query.filter(Invoice.vendor_name.ilike(f"%{vendor_name}%"))
    if search:
        query = query.filter(
            (Invoice.invoice_number.ilike(f"%{search}%")) |
            (Invoice.vendor_name.ilike(f"%{search}%")) |
            (Invoice.po_number.ilike(f"%{search}%"))
        )
    return query.order_by(Invoice.created_at.desc()).all()

@router.get("/{invoice_id}", response_model=InvoiceSchema)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    inv = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return inv

@router.get("/{invoice_id}/agents", response_model=List[AgentExecutionSchema])
def get_invoice_agents(invoice_id: int, db: Session = Depends(get_db)):
    return db.query(AgentExecution).filter(AgentExecution.invoice_id == invoice_id).order_by(AgentExecution.executed_at.asc()).all()

@router.get("/{invoice_id}/exceptions", response_model=List[ExceptionItemSchema])
def get_invoice_exceptions(invoice_id: int, db: Session = Depends(get_db)):
    return db.query(ExceptionItem).filter(ExceptionItem.invoice_id == invoice_id).all()

@router.post("/upload", response_model=InvoiceSchema)
async def upload_invoice(
    file: UploadFile = File(...),
    po_number: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    # File validation
    allowed_exts = [".pdf", ".png", ".jpg", ".jpeg"]
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_exts:
        raise HTTPException(status_code=400, detail="Invalid file type. Supported: PDF, PNG, JPG, JPEG")

    timestamp_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    file_name = f"invoice_{timestamp_str}{ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Create initial pending invoice record
    new_inv = Invoice(
        invoice_number=f"INV-PENDING-{timestamp_str[-6:]}",
        document_url=f"/uploads/invoices/{file_name}",
        file_type="PDF" if ext == ".pdf" else "IMAGE",
        po_number=po_number,
        status="Processing",
        risk_score=0,
        risk_level="Low",
        decision="PENDING",
        requires_human_review=False
    )
    db.add(new_inv)
    db.commit()
    db.refresh(new_inv)

    # Immediately process through multi-agent workflow
    process_invoice_agents(new_inv.id, db)
    db.refresh(new_inv)
    return new_inv

@router.post("/{invoice_id}/process", response_model=InvoiceSchema)
def process_invoice_endpoint(invoice_id: int, db: Session = Depends(get_db)):
    inv = process_invoice_agents(invoice_id, db)
    return inv

def process_invoice_agents(invoice_id: int, db: Session) -> Invoice:
    inv = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    # Load contextual databases for agent cross-referencing
    all_invoices = db.query(Invoice).all()
    all_pos = db.query(PurchaseOrder).all()
    all_vendors = db.query(Vendor).all()
    all_policies = db.query(Policy).all()

    inv_dict = {
        "id": inv.id,
        "invoice_number": inv.invoice_number,
        "document_url": inv.document_url,
        "po_number": inv.po_number,
        "raw_text": inv.raw_text or ""
    }

    initial_state = {
        "invoice_id": inv.id,
        "document_url": inv.document_url,
        "raw_text": inv.raw_text or "",
        "po_number": inv.po_number,
        "existing_invoices": [i.__dict__ for i in all_invoices],
        "po_database": [p.__dict__ for p in all_pos],
        "vendor_database": [v.__dict__ for v in all_vendors],
        "policies": [pol.__dict__ for pol in all_policies]
    }

    # Execute LangGraph Multi-Agent Workflow
    final_state = agent_workflow.run(initial_state)

    # Extract Agent Outputs
    ext = final_state.get("extracted_invoice", {})
    val = final_state.get("validation_result", {})
    po_m = final_state.get("po_match_result", {})
    pol_res = final_state.get("policy_result", {})
    fraud = final_state.get("fraud_result", {})
    dec = final_state.get("decision", "REVIEW")
    dec_reason = final_state.get("decision_reason", "")
    requires_hitl = final_state.get("requires_human_review", True)
    risk_score = final_state.get("risk_score", 50)
    risk_level = final_state.get("risk_level", "Medium")

    # Clear old agent executions & exceptions for re-processing
    db.query(AgentExecution).filter(AgentExecution.invoice_id == inv.id).delete()
    db.query(ExceptionItem).filter(ExceptionItem.invoice_id == inv.id).delete()
    db.query(InvoiceItem).filter(InvoiceItem.invoice_id == inv.id).delete()
    db.query(RiskAssessment).filter(RiskAssessment.invoice_id == inv.id).delete()

    # Update Invoice Entity
    inv.invoice_number = ext.get("invoice_number", inv.invoice_number)
    inv.vendor_name = ext.get("vendor_name", inv.vendor_name)
    inv.vendor_address = ext.get("vendor_address", inv.vendor_address)
    inv.po_number = ext.get("po_number", inv.po_number)
    inv.raw_text = final_state.get("raw_text", inv.raw_text)
    inv.invoice_date = ext.get("invoice_date")
    inv.due_date = ext.get("due_date")
    inv.currency = ext.get("currency", "INR")
    inv.subtotal = float(ext.get("subtotal", 0.0))
    inv.tax = float(ext.get("tax", 0.0))
    inv.total_amount = float(ext.get("total", 0.0))
    inv.payment_terms = ext.get("payment_terms", "Net 30")
    
    inv.decision = dec
    inv.decision_reason = dec_reason
    inv.requires_human_review = requires_hitl
    inv.risk_score = risk_score
    inv.risk_level = risk_level
    inv.status = "Approved" if dec == "APPROVE" else ("Rejected" if dec == "REJECT" and not requires_hitl else "Review")
    inv.processing_time_ms = final_state.get("total_processing_time_ms", 1200)

    # Link Vendor & PO IDs if matches exist
    if inv.vendor_name:
        v_match = db.query(Vendor).filter(Vendor.name.ilike(f"%{inv.vendor_name}%")).first()
        if v_match:
            inv.vendor_id = v_match.id

    if inv.po_number:
        po_rec = db.query(PurchaseOrder).filter(PurchaseOrder.po_number == inv.po_number).first()
        if po_rec:
            inv.po_id = po_rec.id

    db.commit()

    # Save Line Items
    for item in ext.get("line_items", []):
        inv_item = InvoiceItem(
            invoice_id=inv.id,
            description=item.get("description", "Item"),
            quantity=float(item.get("quantity", 1.0)),
            unit_price=float(item.get("unit_price", 0.0)),
            tax_percentage=float(item.get("tax_percentage", 18.0)),
            total_price=float(item.get("total_price", 0.0))
        )
        db.add(inv_item)

    # Save Exceptions detected by Agents
    exceptions_list = []
    for err in val.get("errors", []):
        exceptions_list.append(("Validation Error", "High", err, 30, "Validation Agent"))
    for wrn in val.get("warnings", []):
        exceptions_list.append(("Tax Mismatch", "Medium", wrn, 15, "Validation Agent"))
    for mism in po_m.get("mismatches", []):
        sev = "High" if "variance" in mism.lower() or "not found" in mism.lower() else "Medium"
        exceptions_list.append(("Amount mismatch" if "Amount" in mism else "Missing PO", sev, mism, 25, "PO Matching Agent"))
    for viol in pol_res.get("violations", []):
        exceptions_list.append(("Policy violation", "Medium", viol, 20, "Policy Compliance Agent"))

    for exc_type, exc_sev, exc_desc, exc_impact, exc_agent in exceptions_list:
        exc_rec = ExceptionItem(
            invoice_id=inv.id,
            type=exc_type,
            severity=exc_sev,
            description=exc_desc,
            risk_score_impact=exc_impact,
            detected_by_agent=exc_agent,
            status="Open" if inv.status == "Review" else "Resolved",
            assigned_to_user_id=3 if inv.status == "Review" else None
        )
        db.add(exc_rec)

    # Save Agent Execution Logs
    for log_item in final_state.get("agent_logs", []):
        ag_exec = AgentExecution(
            invoice_id=inv.id,
            agent_name=log_item["agent_name"],
            status=log_item["status"],
            execution_time_ms=log_item["execution_time_ms"],
            input_summary=log_item["summary"],
            output_json=log_item,
            executed_at=datetime.datetime.utcnow()
        )
        db.add(ag_exec)

    # Save Risk Assessment
    risk_ass = RiskAssessment(
        invoice_id=inv.id,
        total_risk_score=risk_score,
        risk_level=risk_level,
        breakdown_json=fraud.get("breakdown", []),
        reasoning=dec_reason,
        created_at=datetime.datetime.utcnow()
    )
    db.add(risk_ass)

    # Add Audit Log
    audit = AuditLog(
        timestamp=datetime.datetime.utcnow(),
        actor="Decision Agent",
        action=f"Agent Execution Finished: {dec}",
        invoice_id=inv.id,
        invoice_number=inv.invoice_number,
        previous_state="Processing",
        new_state=inv.status,
        details=dec_reason
    )
    db.add(audit)

    # Add Notification if HITL required or critical
    if requires_hitl or risk_score >= 60:
        notif = Notification(
            user_id=2,
            title=f"Human Review Required: {inv.invoice_number}",
            message=f"Invoice #{inv.invoice_number} ({inv.vendor_name}) requires approval. Risk score: {risk_score}/100.",
            type="warning" if risk_score < 80 else "danger",
            is_read=False,
            invoice_id=inv.id
        )
        db.add(notif)

    db.commit()
    db.refresh(inv)
    return inv
