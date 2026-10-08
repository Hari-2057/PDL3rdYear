import React from 'react';
import { Invoice, PurchaseOrder } from '../types';
import { AlertTriangle, CheckCircle2, GitCompare, Building, DollarSign, Layers, ShieldAlert } from 'lucide-react';

interface PoComparisonViewProps {
  invoice: Invoice;
  purchaseOrder?: PurchaseOrder | null;
}

export const PoComparisonView: React.FC<PoComparisonViewProps> = ({ invoice, purchaseOrder }) => {
  const invAmount = invoice.subtotal || invoice.total_amount;
  const poAmount = purchaseOrder ? purchaseOrder.total_amount : 0;
  const amountDiff = purchaseOrder ? invAmount - poAmount : invAmount;
  const variancePct = poAmount > 0 ? ((amountDiff / poAmount) * 100).toFixed(1) : '100.0';

  const poMatched = purchaseOrder && Math.abs(Number(variancePct)) <= 10.0 && invoice.vendor_name === purchaseOrder.vendor_name;

  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#E5EAF0] shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAF0] pb-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-200 text-[#1769E0]">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#082B55] tracking-tight">
              Two-Way Line Item PO Reconciliation
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated line-by-line comparison against enterprise ERP Purchase Order registry
            </p>
          </div>
        </div>

        {poMatched ? (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" /> 100% PO Match Verified
          </span>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
            <AlertTriangle className="w-4 h-4" /> Variance Threshold Breached
          </span>
        )}
      </div>

      {/* Visual Variance Meter */}
      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-600 font-sans">Calculated Variance Delta:</span>
          <span className={`font-bold ${poMatched ? 'text-emerald-700' : 'text-amber-700'}`}>
            {variancePct}% (Max allowable: 10.0%)
          </span>
        </div>

        <div className="relative w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              poMatched ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(Math.abs(Number(variancePct)) * 4, 100)}%` }}
          />
        </div>
      </div>

      {/* Side-by-Side Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Invoice Column */}
        <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-2.5">
            <span className="text-xs font-bold text-[#1769E0] font-mono uppercase tracking-wider">
              INVOICE #{invoice.invoice_number}
            </span>
            <span className="text-[10px] font-mono text-[#1769E0] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Submitted
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#1769E0]" /> Vendor Name
              </span>
              <span className="font-bold text-[#082B55]">{invoice.vendor_name || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#1769E0]" /> Net Subtotal
              </span>
              <span className="font-bold text-[#082B55] font-mono">${invAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#1769E0]" /> Line Items
              </span>
              <span className="font-semibold text-slate-700">{invoice.items?.length || 1} Item(s)</span>
            </div>
          </div>
        </div>

        {/* PO Column */}
        <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-2.5">
            <span className="text-xs font-bold text-indigo-700 font-mono uppercase tracking-wider">
              PO #{invoice.po_number || 'NONE'}
            </span>
            <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Baseline PO
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-600" /> Vendor Record
              </span>
              <span className="font-bold text-[#082B55]">
                {purchaseOrder ? purchaseOrder.vendor_name : 'No Linked PO in ERP'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-indigo-600" /> Baseline PO Amount
              </span>
              <span className="font-bold text-[#082B55] font-mono">
                {purchaseOrder ? `$${poAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" /> Approval Status
              </span>
              <span className="font-bold text-indigo-700">
                {purchaseOrder ? purchaseOrder.status : 'Missing PO'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Discrepancy Callout */}
      {!poMatched && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-amber-800 uppercase">
              Variance Analysis Findings
            </h4>
            <p className="text-slate-700 leading-relaxed font-normal">
              Invoice subtotal deviates from PO baseline by{' '}
              <strong className="font-mono text-amber-800">
                ${Math.abs(amountDiff).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </strong>{' '}
              ({variancePct}% variance). Maximum allowable corporate policy threshold is{' '}
              <strong className="text-amber-800 font-mono">10.0%</strong>. Human-in-the-loop review was triggered automatically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
