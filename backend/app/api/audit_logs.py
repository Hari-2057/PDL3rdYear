from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import AuditLog
from app.schemas.audit import AuditLogSchema

router = APIRouter(prefix="/api/audit-logs", tags=["Audit Log Trail"])

@router.get("", response_model=List[AuditLogSchema])
def list_audit_logs(
    actor: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(AuditLog)
    if actor and actor != "All":
        query = query.filter(AuditLog.actor.ilike(f"%{actor}%"))
    if search:
        query = query.filter(
            (AuditLog.action.ilike(f"%{search}%")) |
            (AuditLog.details.ilike(f"%{search}%")) |
            (AuditLog.invoice_number.ilike(f"%{search}%"))
        )
    return query.order_by(AuditLog.timestamp.desc()).all()
