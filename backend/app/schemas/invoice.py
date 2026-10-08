from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from datetime import datetime

class InvoiceItemSchema(BaseModel):
    id: Optional[int] = None
    description: str
    quantity: float
    unit_price: float
    tax_percentage: float = 0.0
    total_price: float

    class Config:
        from_attributes = True

class ExceptionItemSchema(BaseModel):
    id: int
    invoice_id: int
    type: str
    severity: str
    description: str
    risk_score_impact: int
    detected_by_agent: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class AgentExecutionSchema(BaseModel):
    id: int
    invoice_id: int
    agent_name: str
    status: str
    execution_time_ms: int
    input_summary: Optional[str] = None
    output_json: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    executed_at: datetime

    class Config:
        from_attributes = True

class RiskBreakdownItem(BaseModel):
    factor: str
    score: int
    description: str

class RiskAssessmentSchema(BaseModel):
    id: int
    invoice_id: int
    total_risk_score: int
    risk_level: str
    breakdown_json: Optional[List[Dict[str, Any]]] = None
    reasoning: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ApprovalSchema(BaseModel):
    id: int
    invoice_id: int
    reviewer_id: Optional[int] = None
    reviewer_name: str
    decision: str
    comments: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class InvoiceSchema(BaseModel):
    id: int
    invoice_number: Optional[str] = None
    vendor_name: Optional[str] = None
    vendor_address: Optional[str] = None
    vendor_id: Optional[int] = None
    po_number: Optional[str] = None
    po_id: Optional[int] = None
    document_url: Optional[str] = None
    file_type: Optional[str] = "PDF"
    raw_text: Optional[str] = None
    invoice_date: Optional[str] = None
    due_date: Optional[str] = None
    currency: Optional[str] = "INR"
    subtotal: float = 0.0
    tax: float = 0.0
    total_amount: float = 0.0
    payment_terms: Optional[str] = "Net 30"
    status: str
    risk_score: int
    risk_level: str
    decision: str
    decision_reason: Optional[str] = None
    requires_human_review: bool
    processing_time_ms: int
    created_at: datetime
    updated_at: datetime
    
    items: List[InvoiceItemSchema] = []
    exceptions: List[ExceptionItemSchema] = []
    agent_executions: List[AgentExecutionSchema] = []
    risk_assessment: Optional[RiskAssessmentSchema] = None
    approvals: List[ApprovalSchema] = []

    class Config:
        from_attributes = True
