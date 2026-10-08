import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Policy, AuditLog
from app.schemas.policy import PolicySchema, PolicyCreate

router = APIRouter(prefix="/api/policies", tags=["Policy Management Engine"])

@router.get("", response_model=List[PolicySchema])
def list_policies(db: Session = Depends(get_db)):
    return db.query(Policy).order_by(Policy.id.asc()).all()

@router.post("", response_model=PolicySchema)
def create_policy(pol_in: PolicyCreate, db: Session = Depends(get_db)):
    pol = Policy(
        name=pol_in.name,
        category=pol_in.category,
        condition=pol_in.condition,
        threshold=pol_in.threshold,
        action=pol_in.action,
        is_active=pol_in.is_active
    )
    db.add(pol)
    db.commit()
    db.refresh(pol)

    audit = AuditLog(
        timestamp=datetime.datetime.utcnow(),
        actor="Admin",
        action="Created New Expenditure Policy",
        details=f"Policy '{pol.name}' (Threshold: {pol.threshold}, Action: {pol.action})"
    )
    db.add(audit)
    db.commit()
    return pol

@router.put("/{policy_id}", response_model=PolicySchema)
def update_policy(policy_id: int, pol_in: PolicyCreate, db: Session = Depends(get_db)):
    pol = db.query(Policy).filter(Policy.id == policy_id).first()
    if not pol:
        raise HTTPException(status_code=404, detail="Policy not found")

    old_threshold = pol.threshold
    pol.name = pol_in.name
    pol.category = pol_in.category
    pol.condition = pol_in.condition
    pol.threshold = pol_in.threshold
    pol.action = pol_in.action
    pol.is_active = pol_in.is_active

    audit = AuditLog(
        timestamp=datetime.datetime.utcnow(),
        actor="Admin",
        action=f"Updated Policy '{pol.name}'",
        details=f"Changed threshold from {old_threshold} to {pol.threshold}."
    )
    db.add(audit)
    db.commit()
    db.refresh(pol)
    return pol
