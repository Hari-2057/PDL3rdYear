import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database.models import Invoice, Approval, AuditLog, Notification, ExceptionItem, User
from app.schemas.invoice import InvoiceSchema
from app.schemas.review import ReviewActionRequest
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/api/reviews", tags=["Human In The Loop Reviews"])

@router.get("", response_model=List[InvoiceSchema])
def list_pending_reviews(db: Session = Depends(get_db)):
    return db.query(Invoice).filter(Invoice.status == "Review").order_by(Invoice.risk_score.desc()).all()

@router.post("/{invoice_id}/approve", response_model=InvoiceSchema)
def approve_invoice(invoice_id: int, req: ReviewActionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    inv = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    old_status = inv.status
    inv.status = "Approved"
    inv.requires_human_review = False
    inv.decision = "APPROVE"
    inv.decision_reason = f"Human Approved by {current_user.full_name}: {req.comments}"

    # Resolve exceptions
    db.query(ExceptionItem).filter(ExceptionItem.invoice_id == inv.id).update({"status": "Resolved"})

    # Record Approval
    approval = Approval(
        invoice_id=inv.id,
        reviewer_id=current_user.id,
        reviewer_name=current_user.full_name,
        decision="Approved",
        comments=req.comments,
        created_at=datetime.datetime.utcnow()
    )
    db.add(approval)

    # Record Audit Log
    audit = AuditLog(
        timestamp=datetime.datetime.utcnow(),
        actor=f"Reviewer ({current_user.full_name})",
        action="Human Override: Approved Invoice",
        invoice_id=inv.id,
        invoice_number=inv.invoice_number,
        previous_state=old_status,
        new_state="Approved",
        details=f"Human sign-off provided. Comments: {req.comments}"
    )
    db.add(audit)

    db.commit()
    db.refresh(inv)
    return inv

@router.post("/{invoice_id}/reject", response_model=InvoiceSchema)
def reject_invoice(invoice_id: int, req: ReviewActionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    inv = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    old_status = inv.status
    inv.status = "Rejected"
    inv.requires_human_review = False
    inv.decision = "REJECT"
    inv.decision_reason = f"Human Rejected by {current_user.full_name}: {req.comments}"

    # Record Approval / Rejection Action
    approval = Approval(
        invoice_id=inv.id,
        reviewer_id=current_user.id,
        reviewer_name=current_user.full_name,
        decision="Rejected",
        comments=req.comments,
        created_at=datetime.datetime.utcnow()
    )
    db.add(approval)

    # Record Audit Log
    audit = AuditLog(
        timestamp=datetime.datetime.utcnow(),
        actor=f"Reviewer ({current_user.full_name})",
        action="Human Decision: Rejected Invoice",
        invoice_id=inv.id,
        invoice_number=inv.invoice_number,
        previous_state=old_status,
        new_state="Rejected",
        details=f"Invoice rejected in HITL queue. Reason: {req.comments}"
    )
    db.add(audit)

    db.commit()
    db.refresh(inv)
    return inv

@router.post("/{invoice_id}/correction", response_model=InvoiceSchema)
def request_correction(invoice_id: int, req: ReviewActionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    inv = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    old_status = inv.status
    inv.status = "Review"
    inv.decision = "CORRECTION_REQUESTED"
    inv.decision_reason = f"Correction requested by {current_user.full_name}: {req.comments}"

    approval = Approval(
        invoice_id=inv.id,
        reviewer_id=current_user.id,
        reviewer_name=current_user.full_name,
        decision="Request Correction",
        comments=req.comments,
        created_at=datetime.datetime.utcnow()
    )
    db.add(approval)

    audit = AuditLog(
        timestamp=datetime.datetime.utcnow(),
        actor=f"Reviewer ({current_user.full_name})",
        action="Requested Vendor Correction",
        invoice_id=inv.id,
        invoice_number=inv.invoice_number,
        previous_state=old_status,
        new_state="Review",
        details=f"Sent back for correction: {req.comments}"
    )
    db.add(audit)

    db.commit()
    db.refresh(inv)
    return inv
