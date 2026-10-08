from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PolicyCreate(BaseModel):
    name: str
    category: str
    condition: str
    threshold: float
    action: str
    is_active: bool = True

class PolicySchema(BaseModel):
    id: int
    name: str
    category: str
    condition: str
    threshold: float
    action: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
