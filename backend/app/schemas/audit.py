from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AuditLogSchema(BaseModel):
    id: int
    timestamp: datetime
    actor: str
    action: str
    invoice_id: Optional[int] = None
    invoice_number: Optional[str] = None
    previous_state: Optional[str] = None
    new_state: Optional[str] = None
    details: Optional[str] = None

    class Config:
        from_attributes = True

class NotificationSchema(BaseModel):
    id: int
    user_id: Optional[int] = None
    title: str
    message: str
    type: str
    is_read: bool
    invoice_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
