from pydantic import BaseModel
from typing import List, Dict, Any

class KeyMetrics(BaseModel):
    total_invoices: int
    processed_today: int
    auto_approved: int
    human_review: int
    rejected: int
    exception_rate: float
    avg_processing_time_sec: float
    total_invoice_value: float

class ChartDataPoint(BaseModel):
    name: str
    value: float
    extra: str = ""

class AnalyticsResponse(BaseModel):
    kpis: KeyMetrics
    processing_trend: List[Dict[str, Any]]
    approval_distribution: List[Dict[str, Any]]
    exception_categories: List[Dict[str, Any]]
    risk_distribution: List[Dict[str, Any]]
    processing_time_trend: List[Dict[str, Any]]
    vendor_values: List[Dict[str, Any]]
