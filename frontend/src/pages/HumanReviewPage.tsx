import React, { useState } from 'react';
import { Invoice } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { UserCheck, Check, X, AlertTriangle, Building, DollarSign } from 'lucide-react';
import { DocumentRow } from '../components/RecentDocumentsTable';

interface HumanReviewPageProps {
  pendingInvoices: Invoice[];
  onReviewCompleted: (updatedInvoice: Invoice) => void;
  onSelectDocument?: (doc: DocumentRow) => void;
}

export const HumanReviewPage: React.FC<HumanReviewPageProps> = ({
  pendingInvoices = [],
  onReviewCompleted,
  onSelectDocument,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(pendingInvoices[0] || null);
  const [comments, setComments] = useState('');

  const handleApprove = () => {
    if (!selectedInvoice) return;
    const updated: Invoice = {
      ...selectedInvoice,
      status: 'Approved',
      requires_human_review: false,
    };
    onReviewCompleted(updated);
    const remaining = pendingInvoices.filter((i) => i.id !== selectedInvoice.id);
    setSelectedInvoice(remaining[0] || null);
  };

  const handleReject = () => {
    if (!selectedInvoice) return;
    const updated: Invoice = {
      ...selectedInvoice,
      status: 'Rejected',
      requires_human_review: false,
    };
    onReviewCompleted(updated);
    const remaining = pendingInvoices.filter((i) => i.id !== selectedInvoice.id);
    setSelectedInvoice(remaining[0] || null);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">My Review Queue</h2>
          <p className="text-xs text-slate-500 mt-0.5">High-priority invoices and expense claims assigned to Hari Preeth P</p>
        </div>
        <span className="text-xs font-mono font-semibold text-[#1769E0] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-md self-start sm:self-auto">
          {pendingInvoices.length} Items Awaiting Sign-Off
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-2.5">
          {pendingInvoices.map((inv) => {
            const isSelected = selectedInvoice?.id === inv.id;
            return (
              <div
                key={inv.id}
                onClick={() => setSelectedInvoice(inv)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/60 border-blue-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-xs text-[#1769E0]">{inv.invoice_number}</span>
                  <StatusBadge status={inv.status} size="sm" />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="font-semibold text-slate-800">{inv.vendor_name}</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${inv.total_amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-amber-700 font-medium">
                  {inv.exceptions?.[0]?.type || 'Variance exception'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        {selectedInvoice && (
          <div className="lg:col-span-7 bg-white border border-[#E5EAF0] rounded-xl p-4 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#082B55] font-mono">{selectedInvoice.invoice_number}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Vendor: {selectedInvoice.vendor_name} • PO: {selectedInvoice.po_number || 'None'}</p>
              </div>
              <StatusBadge status="Pending Review" />
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs font-mono">
              <div className="p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase">Subtotal</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">${selectedInvoice.total_amount?.toLocaleString()}</span>
              </div>
              <div className="p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase">Risk Score</span>
                <span className="font-bold text-amber-700 text-xs sm:text-sm">{selectedInvoice.risk_score} / 100</span>
              </div>
              <div className="p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase">Exceptions</span>
                <span className="font-bold text-red-600 text-xs sm:text-sm">{selectedInvoice.exceptions?.length || 1} Detected</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="font-semibold text-slate-800 block">Agent Exception Rationale:</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {selectedInvoice.exceptions?.[0]?.description || 'Invoice amount exceeds PO threshold. Requires managerial authorization.'}
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Audit Resolution Note:</label>
              <textarea
                rows={3}
                placeholder="Enter justification for sign-off or escalation..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={handleReject}
                className="min-h-[44px] px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-lg border border-red-200 transition-colors"
              >
                Reject / Block
              </button>
              <button
                onClick={handleApprove}
                className="min-h-[44px] px-5 py-2 bg-[#1769E0] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
              >
                Approve & Settle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
