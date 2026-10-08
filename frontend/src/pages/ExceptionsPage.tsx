import React, { useState } from 'react';
import { Invoice } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import { DocumentRow } from '../components/RecentDocumentsTable';

interface ExceptionsPageProps {
  invoices: Invoice[];
  onSelectDocument: (doc: DocumentRow) => void;
}

export const ExceptionsPage: React.FC<ExceptionsPageProps> = ({ invoices = [], onSelectDocument }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Total mismatch',
    'Missing receipt',
    'Duplicate invoice',
    'PO/GR mismatch',
    'Policy violation',
    'Unknown vendor',
  ];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Exception Queue</h2>
          <p className="text-xs text-slate-500 mt-0.5">Automated anomaly classification and human review prioritization</p>
        </div>
        <span className="text-xs font-mono font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
          256 Active Exceptions
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
              selectedCategory === cat
                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Exceptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {invoices
          .filter((inv) => inv.exceptions && inv.exceptions.length > 0)
          .map((inv) => (
            <div
              key={inv.id}
              onClick={() =>
                onSelectDocument({
                  id: inv.invoice_number || `INV-${inv.id}`,
                  vendor: inv.vendor_name || 'Vendor',
                  type: 'Invoice',
                  amount: inv.total_amount,
                  exception: inv.exceptions?.[0]?.type || 'Exception',
                  status: 'Pending Review',
                  confidence: 78,
                  date: inv.invoice_date || 'Oct 8, 2026',
                  poNumber: inv.po_number,
                  agentNotes: inv.exceptions?.[0]?.description,
                })
              }
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="font-mono font-semibold text-xs text-blue-700">{inv.invoice_number || `INV-${inv.id}`}</span>
                <StatusBadge status="Pending Review" size="sm" />
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900">{inv.exceptions?.[0]?.type}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {inv.exceptions?.[0]?.description || 'Discrepancy detected during deterministic rule checking.'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Vendor: <strong className="text-slate-800">{inv.vendor_name}</strong></span>
                <span className="text-blue-600 font-semibold flex items-center gap-1">
                  Inspect <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
