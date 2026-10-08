from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VendorCreate(BaseModel):
    vendor_id_str: str
    name: str
    address: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    tax_id: Optional[str] = None

class VendorSchema(BaseModel):
    id: int
    vendor_id_str: str
    name: str
    address: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    tax_id: Optional[str] = None
    total_invoices: int
    total_value: float
    avg_invoice_amount: float
    exception_count: int
    risk_level: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
