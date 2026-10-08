import React, { useState } from 'react';
import { Invoice, PurchaseOrder } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { CircularRiskScore } from '../components/CircularRiskScore';
import { ExplainableDecisionCard } from '../components/ExplainableDecisionCard';
import { AgentWorkflowVisualizer } from '../components/AgentWorkflowVisualizer';
import { PoComparisonView } from '../components/PoComparisonView';
import { AgentLogsTimeline } from '../components/AgentLogsTimeline';
import {
  FileText, ArrowLeft, RefreshCw, Layers, CheckCircle2
} from 'lucide-react';
import { apiService } from '../services/api';

interface InvoiceDetailsPageProps {
  invoice: Invoice;
  purchaseOrders: PurchaseOrder[];
  onBack: () => void;
  onUpdateInvoice: (updated: Invoice) => void;
}

export const InvoiceDetailsPage: React.FC<InvoiceDetailsPageProps> = ({
  invoice,
  purchaseOrders = [],
  onBack,
  onUpdateInvoice,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'po-match' | 'agent-logs'>('overview');
  const [isReprocessing, setIsReprocessing] = useState(false);

  const matchedPo = purchaseOrders.find((p) => p.po_number === invoice.po_number);

  const handleReprocess = async () => {
    setIsReprocessing(true);
    try {
      const updated = await apiService.processInvoice(invoice.id);
      onUpdateInvoice(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsReprocessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAF0] pb-4">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white border border-[#E5EAF0] hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Back to Invoices"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#082B55] font-mono tracking-tight">
                {invoice.invoice_number}
              </h2>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Vendor: <strong className="text-slate-700">{invoice.vendor_name}</strong> • Latency: {invoice.processing_time_ms}ms • LangGraph Verified
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReprocess}
            disabled={isReprocessing}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#1769E0] font-semibold text-xs rounded-lg border border-blue-200 flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReprocessing ? 'animate-spin' : ''}`} />
            <span>{isReprocessing ? 'Re-evaluating Pipeline...' : 'Reprocess 7 Agents'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5EAF0] space-x-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-1 transition-all relative cursor-pointer ${
            activeTab === 'overview'
              ? 'text-[#1769E0] font-bold border-b-2 border-[#1769E0]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Extracted Overview
        </button>

        <button
          onClick={() => setActiveTab('po-match')}
          className={`pb-3 px-1 transition-all relative cursor-pointer ${
            activeTab === 'po-match'
              ? 'text-[#1769E0] font-bold border-b-2 border-[#1769E0]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          PO Reconciliation
        </button>

        <button
          onClick={() => setActiveTab('agent-logs')}
          className={`pb-3 px-1 transition-all relative cursor-pointer ${
            activeTab === 'agent-logs'
              ? 'text-[#1769E0] font-bold border-b-2 border-[#1769E0]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Agent Execution Graph ({invoice.agent_executions?.length || 7})
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Document Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl p-5 border border-[#E5EAF0] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-3">
                <h3 className="text-xs font-bold text-[#082B55] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1769E0]" />
                  Document Vision Stream ({invoice.file_type || 'PDF'})
                </h3>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  OCR Verified
                </span>
              </div>

              {/* Document Text Box */}
              <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E5EAF0] min-h-[420px] max-h-[500px] overflow-y-auto font-mono text-[11px] text-[#082B55] whitespace-pre-wrap leading-relaxed shadow-inner">
                {invoice.raw_text ||
                  `INVOICE DOCUMENT PARSED BUFFER\n\nVendor: ${invoice.vendor_name}\nInvoice #: ${invoice.invoice_number}\nDate: ${invoice.invoice_date}\nPO #: ${invoice.po_number || 'N/A'}\nTotal: $${invoice.total_amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </div>
            </div>
          </div>

          {/* RIGHT: AI Decision, Risk Score, and Metadata */}
          <div className="lg:col-span-7 space-y-6">
            {/* AI Decision Card */}
            <ExplainableDecisionCard invoice={invoice} />

            {/* Circular Risk Score */}
            <div className="bg-white rounded-xl p-5 border border-[#E5EAF0] shadow-xs flex flex-col md:flex-row items-center gap-6">
              <CircularRiskScore score={invoice.risk_score} riskLevel={invoice.risk_level} />
              <div className="flex-1 space-y-3 w-full">
                <h4 className="text-xs font-bold text-[#082B55] uppercase tracking-wider">
                  Neural Risk Factor Assessment
                </h4>
                {invoice.risk_assessment?.breakdown_json &&
                invoice.risk_assessment.breakdown_json.length > 0 ? (
                  <ul className="space-y-1.5 text-xs">
                    {invoice.risk_assessment.breakdown_json.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E5EAF0]"
                      >
                        <span className="text-slate-600 font-mono text-[11px]">{item.factor}</span>
                        <span className="font-mono font-bold text-amber-700">+{item.score} pts</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    All 7 automated risk heuristic gates validated clean.
                  </p>
                )}
              </div>
            </div>

            {/* Extracted Metadata Card */}
            <div className="bg-white rounded-xl p-5 border border-[#E5EAF0] shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-[#082B55] uppercase tracking-wider border-b border-[#E5EAF0] pb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1769E0]" />
                Structured Metadata Attributes
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E5EAF0]">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Vendor</span>
                  <span className="font-bold text-[#082B55] truncate block">{invoice.vendor_name || '—'}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E5EAF0]">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Invoice Date</span>
                  <span className="font-bold text-[#082B55]">{invoice.invoice_date || '—'}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E5EAF0]">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Due Date</span>
                  <span className="font-bold text-[#082B55]">{invoice.due_date || '—'}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E5EAF0]">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Subtotal</span>
                  <span className="font-bold text-[#082B55]">${invoice.subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E5EAF0]">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Tax (GST)</span>
                  <span className="font-bold text-[#082B55]">${invoice.tax?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200">
                  <span className="text-[#1769E0] block text-[10px] uppercase font-semibold">Total Payable</span>
                  <span className="font-bold text-[#082B55]">
                    ${invoice.total_amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Line Items Breakdown Table */}
              <div className="pt-2">
                <h4 className="text-[11px] font-bold text-[#082B55] mb-2 uppercase tracking-wider">
                  Extracted Line Items
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5EAF0] text-[10px] font-semibold text-slate-500 uppercase bg-slate-50/70">
                        <th className="py-2 px-2.5">Description</th>
                        <th className="py-2 px-2.5">Qty</th>
                        <th className="py-2 px-2.5">Unit Rate</th>
                        <th className="py-2 px-2.5">GST %</th>
                        <th className="py-2 px-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {invoice.items && invoice.items.length > 0 ? (
                        invoice.items.map((it, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-2.5 text-[#082B55] font-medium">{it.description}</td>
                            <td className="py-2.5 px-2.5 text-slate-600 font-mono">{it.quantity}</td>
                            <td className="py-2.5 px-2.5 text-slate-600 font-mono">
                              ${it.unit_price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-2.5 px-2.5 text-slate-600 font-mono">{it.tax_percentage}%</td>
                            <td className="py-2.5 px-2.5 font-bold text-[#082B55] text-right font-mono">
                              ${it.total_price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-slate-500">
                            Direct Services Charge
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'po-match' && (
        <div className="space-y-6">
          <PoComparisonView invoice={invoice} purchaseOrder={matchedPo} />
        </div>
      )}

      {activeTab === 'agent-logs' && (
        <div className="space-y-6">
          <AgentWorkflowVisualizer executions={invoice.agent_executions} />
          <AgentLogsTimeline logs={invoice.agent_executions} />
        </div>
      )}
    </div>
  );
};
