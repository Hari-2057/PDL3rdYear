export interface User {
  id: number;
  email: string;
  full_name: string;
  role: {
    id: number;
    name: 'Admin' | 'Finance Manager' | 'Reviewer' | 'Employee';
    description?: string;
  };
  is_active: boolean;
}

export interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  tax_percentage: number;
  total_price: number;
}

export interface ExceptionItem {
  id: number;
  invoice_id: number;
  type: 'Amount mismatch' | 'Missing PO' | 'Duplicate invoice' | 'Policy violation' | 'Tax mismatch' | 'Vendor mismatch' | string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  risk_score_impact: number;
  detected_by_agent: string;
  status: 'Open' | 'Resolved' | 'Ignored';
  created_at: string;
}

export interface AgentExecution {
  id: number;
  invoice_id: number;
  agent_name: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED' | 'RUNNING' | 'PENDING';
  execution_time_ms: number;
  input_summary?: string;
  output_json?: any;
  error_message?: string;
  executed_at: string;
}

export interface RiskBreakdown {
  factor: string;
  score: number;
  description: string;
}

export interface RiskAssessment {
  id: number;
  invoice_id: number;
  total_risk_score: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  breakdown_json?: RiskBreakdown[];
  reasoning?: string;
  created_at: string;
}

export interface Approval {
  id: number;
  invoice_id: number;
  reviewer_id?: number;
  reviewer_name: string;
  decision: 'Approved' | 'Rejected' | 'Request Correction';
  comments?: string;
  created_at: string;
}

export interface Invoice {
  id: number;
  invoice_number?: string;
  vendor_name?: string;
  vendor_address?: string;
  vendor_id?: number;
  po_number?: string;
  po_id?: number;
  document_url?: string;
  file_type?: string;
  raw_text?: string;
  invoice_date?: string;
  due_date?: string;
  currency?: string;
  subtotal: number;
  tax: number;
  total_amount: number;
  payment_terms?: string;
  status: 'Approved' | 'Review' | 'Rejected' | 'Processing';
  risk_score: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  decision: 'APPROVE' | 'REVIEW' | 'REJECT' | 'PENDING' | 'CORRECTION_REQUESTED';
  decision_reason?: string;
  requires_human_review: boolean;
  processing_time_ms: number;
  created_at: string;
  updated_at: string;
  items: InvoiceItem[];
  exceptions: ExceptionItem[];
  agent_executions: AgentExecution[];
  risk_assessment?: RiskAssessment;
  approvals: Approval[];
}

export interface PurchaseOrderItem {
  id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface PurchaseOrder {
  id: number;
  po_number: string;
  vendor_name: string;
  vendor_id?: number;
  total_amount: number;
  used_amount: number;
  remaining_amount: number;
  status: 'Active' | 'Closed' | 'Fully Invoiced';
  created_date: string;
  items: PurchaseOrderItem[];
}

export interface Vendor {
  id: number;
  vendor_id_str: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  tax_id?: string;
  total_invoices: number;
  total_value: number;
  avg_invoice_amount: number;
  exception_count: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  status: string;
  created_at: string;
}

export interface Policy {
  id: number;
  name: string;
  category: string;
  condition: string;
  threshold: number;
  action: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  actor: string;
  action: string;
  invoice_id?: number;
  invoice_number?: string;
  previous_state?: string;
  new_state?: string;
  details?: string;
}

export interface Notification {
  id: number;
  user_id?: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  is_read: boolean;
  invoice_id?: number;
  created_at: string;
}

export interface KeyMetrics {
  total_invoices: number;
  processed_today: number;
  auto_approved: number;
  human_review: number;
  rejected: number;
  exception_rate: number;
  avg_processing_time_sec: number;
  total_invoice_value: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  extra?: string;
}

export interface AnalyticsResponse {
  kpis: KeyMetrics;
  processing_trend: ChartDataPoint[];
  approval_distribution: ChartDataPoint[];
  exception_categories: ChartDataPoint[];
  risk_distribution: ChartDataPoint[];
  processing_time_trend: ChartDataPoint[];
  vendor_values: ChartDataPoint[];
}
