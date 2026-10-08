from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import PurchaseOrder, PurchaseOrderItem, Vendor
from app.schemas.po import PurchaseOrderSchema, PurchaseOrderCreate

router = APIRouter(prefix="/api/purchase-orders", tags=["Purchase Orders"])

@router.get("", response_model=List[PurchaseOrderSchema])
def list_purchase_orders(db: Session = Depends(get_db)):
    return db.query(PurchaseOrder).order_by(PurchaseOrder.id.desc()).all()

@router.post("", response_model=PurchaseOrderSchema)
def create_purchase_order(po_in: PurchaseOrderCreate, db: Session = Depends(get_db)):
    existing = db.query(PurchaseOrder).filter(PurchaseOrder.po_number == po_in.po_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="PO number already exists")

    vendor_rec = db.query(Vendor).filter(Vendor.name.ilike(f"%{po_in.vendor_name}%")).first()

    new_po = PurchaseOrder(
        po_number=po_in.po_number,
        vendor_name=po_in.vendor_name,
        vendor_id=vendor_rec.id if vendor_rec else None,
        total_amount=po_in.total_amount,
        used_amount=0.0,
        remaining_amount=po_in.total_amount,
        status=po_in.status
    )
    db.add(new_po)
    db.commit()
    db.refresh(new_po)

    for item in po_in.items:
        po_item = PurchaseOrderItem(
            po_id=new_po.id,
            description=item.description,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.total_price
        )
        db.add(po_item)

    db.commit()
    db.refresh(new_po)
    return new_po
