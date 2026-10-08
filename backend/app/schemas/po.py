from pydantic import BaseModel
from typing import Optional, List

class PurchaseOrderItemSchema(BaseModel):
    id: Optional[int] = None
    description: str
    quantity: float
    unit_price: float
    total_price: float

    class Config:
        from_attributes = True

class PurchaseOrderCreate(BaseModel):
    po_number: str
    vendor_name: str
    total_amount: float
    status: str = "Active"
    created_date: Optional[str] = None
    items: List[PurchaseOrderItemSchema] = []

class PurchaseOrderSchema(BaseModel):
    id: int
    po_number: str
    vendor_name: str
    vendor_id: Optional[int] = None
    total_amount: float
    used_amount: float
    remaining_amount: float
    status: str
    created_date: str
    items: List[PurchaseOrderItemSchema] = []

    class Config:
        from_attributes = True
