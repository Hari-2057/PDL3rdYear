import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.database.session import Base

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False) # Admin, Finance Manager, Reviewer, Employee
    description = Column(String(255))
    
    users = relationship("User", back_populates="role")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    role = relationship("Role", back_populates="users")
    approvals = relationship("Approval", back_populates="reviewer")

class Vendor(Base):
    __tablename__ = "vendors"
    
    id = Column(Integer, primary_key=True, index=True)
    vendor_id_str = Column(String(50), unique=True, index=True, nullable=False) # e.g. VEND-1001
    name = Column(String(255), nullable=False, index=True)
    address = Column(Text)
    email = Column(String(255))
    phone = Column(String(50))
    tax_id = Column(String(100))
    total_invoices = Column(Integer, default=0)
    total_value = Column(Float, default=0.0)
    avg_invoice_amount = Column(Float, default=0.0)
    exception_count = Column(Integer, default=0)
    risk_level = Column(String(50), default="Low") # Low, Medium, High, Critical
    status = Column(String(50), default="Active")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    invoices = relationship("Invoice", back_populates="vendor_rel")
    purchase_orders = relationship("PurchaseOrder", back_populates="vendor_rel")

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    
    id = Column(Integer, primary_key=True, index=True)
    po_number = Column(String(100), unique=True, index=True, nullable=False) # e.g. PO-10023
    vendor_name = Column(String(255), nullable=False)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=True)
    total_amount = Column(Float, nullable=False)
    used_amount = Column(Float, default=0.0)
    remaining_amount = Column(Float, nullable=False)
    status = Column(String(50), default="Active") # Active, Closed, Fully Invoiced
    created_date = Column(String(50), default=lambda: datetime.date.today().isoformat())
    
    vendor_rel = relationship("Vendor", back_populates="purchase_orders")
    items = relationship("PurchaseOrderItem", back_populates="po", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="po_rel")

class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    po_id = Column(Integer, ForeignKey("purchase_orders.id"), nullable=False)
    description = Column(String(255), nullable=False)
    quantity = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    
    po = relationship("PurchaseOrder", back_populates="items")

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(100), index=True) # e.g. INV-10245
    vendor_name = Column(String(255))
    vendor_address = Column(Text)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=True)
    po_number = Column(String(100), index=True)
    po_id = Column(Integer, ForeignKey("purchase_orders.id"), nullable=True)
    
    document_url = Column(String(500))
    file_type = Column(String(50), default="PDF")
    raw_text = Column(Text)
    
    invoice_date = Column(String(50))
    due_date = Column(String(50))
    currency = Column(String(10), default="INR")
    
    subtotal = Column(Float, default=0.0)
    tax = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    payment_terms = Column(String(100), default="Net 30")
    
    status = Column(String(50), default="Processing", index=True) # Approved, Review, Rejected, Processing
    risk_score = Column(Integer, default=0) # 0-100
    risk_level = Column(String(50), default="Low") # Low, Medium, High, Critical
    decision = Column(String(50), default="PENDING") # APPROVE, REVIEW, REJECT
    decision_reason = Column(Text)
    requires_human_review = Column(Boolean, default=False)
    
    processing_time_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    vendor_rel = relationship("Vendor", back_populates="invoices")
    po_rel = relationship("PurchaseOrder", back_populates="invoices")
    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")
    exceptions = relationship("ExceptionItem", back_populates="invoice", cascade="all, delete-orphan")
    agent_executions = relationship("AgentExecution", back_populates="invoice", cascade="all, delete-orphan")
    risk_assessment = relationship("RiskAssessment", back_populates="invoice", uselist=False, cascade="all, delete-orphan")
    approvals = relationship("Approval", back_populates="invoice", cascade="all, delete-orphan")

class InvoiceItem(Base):
    __tablename__ = "invoice_items"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    description = Column(String(255), nullable=False)
    quantity = Column(Float, default=1.0)
    unit_price = Column(Float, default=0.0)
    tax_percentage = Column(Float, default=0.0)
    total_price = Column(Float, default=0.0)
    
    invoice = relationship("Invoice", back_populates="items")

class Policy(Base):
    __tablename__ = "policies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False) # Amount Limit, PO Variance, Approval Required
    condition = Column(String(100), nullable=False) # e.g. "Invoice amount >=", "PO Variance >="
    threshold = Column(Float, nullable=False) # e.g. 50000, 10
    action = Column(String(100), nullable=False) # Auto Approve, Human Review, Require Finance Approval
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class ExceptionItem(Base):
    __tablename__ = "exceptions"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    type = Column(String(100), nullable=False, index=True) # Amount mismatch, Missing PO, Duplicate invoice, Policy violation, Tax mismatch, Vendor mismatch
    severity = Column(String(50), nullable=False) # Low, Medium, High, Critical
    description = Column(Text, nullable=False)
    risk_score_impact = Column(Integer, default=0)
    detected_by_agent = Column(String(100), nullable=False)
    status = Column(String(50), default="Open") # Open, Resolved, Ignored
    assigned_to_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    invoice = relationship("Invoice", back_populates="exceptions")

class AgentExecution(Base):
    __tablename__ = "agent_executions"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    agent_name = Column(String(100), nullable=False, index=True)
    status = Column(String(50), default="SUCCESS") # SUCCESS, WARNING, FAILED
    execution_time_ms = Column(Integer, default=0)
    input_summary = Column(Text)
    output_json = Column(JSON)
    error_message = Column(Text)
    executed_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    invoice = relationship("Invoice", back_populates="agent_executions")

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False, unique=True)
    total_risk_score = Column(Integer, nullable=False) # 0 - 100
    risk_level = Column(String(50), nullable=False) # Low, Medium, High, Critical
    breakdown_json = Column(JSON) # Array of { factor, score, description }
    reasoning = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    invoice = relationship("Invoice", back_populates="risk_assessment")

class Approval(Base):
    __tablename__ = "approvals"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewer_name = Column(String(255), nullable=False)
    decision = Column(String(50), nullable=False) # Approved, Rejected, Request Correction
    comments = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    invoice = relationship("Invoice", back_populates="approvals")
    reviewer = relationship("User", back_populates="approvals")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    actor = Column(String(100), nullable=False) # e.g. "PO Matching Agent", "Reviewer (Jane Doe)"
    action = Column(String(255), nullable=False) # e.g. "Detected Mismatch", "Human Approved"
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=True)
    invoice_number = Column(String(100))
    previous_state = Column(String(50))
    new_state = Column(String(50))
    details = Column(Text)

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="info") # info, warning, danger, success
    is_read = Column(Boolean, default=False)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
