from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Vendor
from app.schemas.vendor import VendorSchema

router = APIRouter(prefix="/api/vendors", tags=["Vendors"])

@router.get("", response_model=List[VendorSchema])
def list_vendors(db: Session = Depends(get_db)):
    return db.query(Vendor).order_by(Vendor.total_value.desc()).all()
