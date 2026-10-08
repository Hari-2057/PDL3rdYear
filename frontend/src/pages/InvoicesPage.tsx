import React, { useState } from 'react';
import { Invoice } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  FileText, Search, Eye, Filter, Plus, Download, ArrowUpRight
} from 'lucide-react';
import { DocumentRow } from '../components/RecentDocumentsTable';

interface InvoicesPageProps {
  invoices: Invoice[];
  onSelectDocument: (doc: DocumentRow) => void;
  onNavigateUpload: () => void;
}

export const InvoicesPage: React.FC<InvoicesPageProps> = ({
  invoices = [],
  onSelectDocument,
  onNavigateUpload,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Invoices Registry</h2>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive audit ledger of automated and queued invoice disbursements</p>
        </div>

        <button
          onClick={onNavigateUpload}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" /> Upload Invoice
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter invoices by number, vendor, PO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 text-xs focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Auto-resolved</option>
            <option value="Review">Pending Review</option>
            <option value="Rejected">Blocked</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() =>
                    onSelectDocument({
                      id: inv.invoice_number || `INV-${inv.id}`,
                      vendor: inv.vendor_name || 'Vendor',
                      type: 'Invoice',
                      amount: inv.total_amount,
                      exception: inv.exceptions?.[0]?.type || 'None',
                      status: inv.status === 'Approved' ? 'Auto-resolved' : inv.status === 'Rejected' ? 'Blocked' : 'Pending Review',
                      confidence: Math.round(100 - (inv.risk_score || 0)),
                      date: inv.invoice_date || 'Oct 8, 2026',
                      poNumber: inv.po_number,
                      lineItemsCount: inv.items?.length || 2,
                    })
                  }
                >
                  <td className="py-3 px-4 font-mono font-semibold text-blue-700">{inv.invoice_number || `INV-${inv.id}`}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{inv.vendor_name}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{inv.invoice_date || 'Oct 8, 2026'}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                    ${inv.total_amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{inv.po_number || '—'}</td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={inv.status === 'Approved' ? 'Auto-resolved' : inv.status === 'Rejected' ? 'Blocked' : 'Pending Review'}
                      size="sm"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
