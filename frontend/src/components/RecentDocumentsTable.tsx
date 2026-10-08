import React, { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { Search, Filter, MoreHorizontal, ArrowRight, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

export interface DocumentRow {
  id: string;
  vendor: string;
  type: 'Invoice' | 'Expense';
  amount: number;
  exception: string;
  status: 'Pending Review' | 'Auto-resolved' | 'Blocked' | 'Escalated' | 'Informational';
  confidence: number;
  date: string;
  poNumber?: string;
  lineItemsCount?: number;
  agentNotes?: string;
}

interface RecentDocumentsTableProps {
  onViewDocument: (doc: DocumentRow) => void;
  onOpenFilterSheet?: () => void;
}

export const INITIAL_DOCUMENTS: DocumentRow[] = [
  {
    id: 'INV-2026-1001',
    vendor: 'Acme Supplies',
    type: 'Invoice',
    amount: 12450.0,
    exception: 'PO mismatch',
    status: 'Pending Review',
    confidence: 78,
    date: 'Oct 8, 2026',
    poNumber: 'PO-90412',
    lineItemsCount: 5,
    agentNotes: 'Line item 3 unit rate $420 vs PO rate $360 (16.6% unit rate escalation).',
  },
  {
    id: 'INV-2026-1002',
    vendor: 'Global Tech Ltd',
    type: 'Invoice',
    amount: 3200.0,
    exception: 'Total mismatch',
    status: 'Auto-resolved',
    confidence: 96,
    date: 'Oct 8, 2026',
    poNumber: 'PO-88741',
    lineItemsCount: 2,
    agentNotes: 'Subtotal math rounding discrepancy of $0.02 auto-adjusted per tolerance policy.',
  },
  {
    id: 'EXP-2026-0456',
    vendor: 'Priya Sharma',
    type: 'Expense',
    amount: 125.0,
    exception: 'Missing receipt',
    status: 'Pending Review',
    confidence: 65,
    date: 'Oct 7, 2026',
    lineItemsCount: 1,
    agentNotes: 'Meal expense > $75 requires itemized receipt attachment per travel policy.',
  },
  {
    id: 'INV-2026-0998',
    vendor: 'OfficeMart',
    type: 'Invoice',
    amount: 980.0,
    exception: 'Duplicate invoice',
    status: 'Blocked',
    confidence: 99,
    date: 'Oct 7, 2026',
    poNumber: 'PO-91024',
    lineItemsCount: 4,
    agentNotes: 'Identical checksum and invoice hash previously settled on Sep 29, 2026.',
  },
  {
    id: 'INV-2026-0997',
    vendor: 'Euro Services',
    type: 'Invoice',
    amount: 5760.0,
    exception: 'Currency anomaly',
    status: 'Pending Review',
    confidence: 72,
    date: 'Oct 6, 2026',
    poNumber: 'PO-87612',
    lineItemsCount: 3,
    agentNotes: 'Invoice stated in EUR (€5,200) converted to USD ($5,760); FX rate variance exceeds 3%.',
  },
  {
    id: 'EXP-2026-0455',
    vendor: 'Rahul Mehta',
    type: 'Expense',
    amount: 48.0,
    exception: 'Policy violation',
    status: 'Auto-resolved',
    confidence: 94,
    date: 'Oct 6, 2026',
    lineItemsCount: 1,
    agentNotes: 'Fuel expense incurred outside core working hours, auto-approved via shift schedule match.',
  },
  {
    id: 'INV-2026-0996',
    vendor: 'BuildRight Co',
    type: 'Invoice',
    amount: 22300.0,
    exception: 'Suspicious amount',
    status: 'Escalated',
    confidence: 61,
    date: 'Oct 5, 2026',
    poNumber: 'PO-84190',
    lineItemsCount: 6,
    agentNotes: 'Invoice total exceeds average historic volume by 320% without prior change order approval.',
  },
  {
    id: 'INV-2026-0995',
    vendor: 'TravelPlus',
    type: 'Invoice',
    amount: 1200.0,
    exception: 'Unknown vendor',
    status: 'Pending Review',
    confidence: 70,
    date: 'Oct 5, 2026',
    lineItemsCount: 2,
    agentNotes: 'Tax identification number not found in approved master vendor ledger.',
  },
];

type TableTab = 'recent' | 'review' | 'resolved' | 'blocked';

export const RecentDocumentsTable: React.FC<RecentDocumentsTableProps> = ({
  onViewDocument,
  onOpenFilterSheet,
}) => {
  const [activeTab, setActiveTab] = useState<TableTab>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Tab Filtering
  const filteredByTab = INITIAL_DOCUMENTS.filter((doc) => {
    if (activeTab === 'recent') return true;
    if (activeTab === 'review') return doc.status === 'Pending Review' || doc.status === 'Escalated';
    if (activeTab === 'resolved') return doc.status === 'Auto-resolved';
    if (activeTab === 'blocked') return doc.status === 'Blocked';
    return true;
  });

  // Search filtering
  const visibleDocs = filteredByTab.filter((doc) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.id.toLowerCase().includes(query) ||
      doc.vendor.toLowerCase().includes(query) ||
      doc.exception.toLowerCase().includes(query) ||
      doc.type.toLowerCase().includes(query)
    );
  });

  // Checkbox helpers
  const allSelected = visibleDocs.length > 0 && visibleDocs.every((d) => selectedIds.has(d.id));
  const someSelected = visibleDocs.some((d) => selectedIds.has(d.id)) && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      const next = new Set<string>();
      visibleDocs.forEach((d) => next.add(d.id));
      setSelectedIds(next);
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  return (
    <div className="bg-white border border-[#E5EAF0] rounded-xl shadow-xs overflow-hidden">
      {/* Top Header Controls: Tabs + Search & Filters */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Tabs - Horizontally Scrollable on Mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
          <button
            onClick={() => setActiveTab('recent')}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'recent'
                ? 'bg-[#082B55] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Recent Documents
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'review'
                ? 'bg-[#082B55] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Exceptions Requiring Review</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'review' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              98
            </span>
          </button>

          <button
            onClick={() => setActiveTab('resolved')}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'resolved'
                ? 'bg-[#082B55] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Auto-resolved</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'resolved' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              892
            </span>
          </button>

          <button
            onClick={() => setActiveTab('blocked')}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'blocked'
                ? 'bg-[#082B55] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Blocked</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'blocked' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
              }`}
            >
              24
            </span>
          </button>
        </div>

        {/* Right Side: Search documents... & Filters button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#F5F8FC] border border-[#E5EAF0] rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#1769E0] min-h-[36px]"
            />
          </div>

          <button
            onClick={onOpenFilterSheet}
            className="min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5EAF0] bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shrink-0 shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* 1. TABLET & DESKTOP: Horizontally scrollable table with sticky header (hidden on mobile < 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-slate-100 bg-[#F5F8FC] text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
              <th className="py-3 px-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={toggleSelectAll}
                  className="rounded border-[#E5EAF0] text-[#1769E0] focus:ring-[#1769E0] cursor-pointer"
                  aria-label="Select all rows"
                />
              </th>
              <th className="py-3 px-3">Document ID</th>
              <th className="py-3 px-3">Vendor</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Amount</th>
              <th className="py-3 px-3">Exception</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Confidence</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {visibleDocs.map((doc) => {
              const isSelected = selectedIds.has(doc.id);
              return (
                <tr
                  key={doc.id}
                  onClick={() => onViewDocument(doc)}
                  className={`hover:bg-[#F5F8FC]/70 transition-colors group cursor-pointer ${
                    isSelected ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <td
                    className="py-3 px-3.5 text-center"
                    onClick={(e) => toggleSelectRow(doc.id, e)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded border-[#E5EAF0] text-[#1769E0] focus:ring-[#1769E0] cursor-pointer"
                      aria-label={`Select ${doc.id}`}
                    />
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#1769E0] group-hover:underline">
                    {doc.id}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#082B55]">
                    {doc.vendor}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        doc.type === 'Invoice'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {doc.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    ${doc.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60 text-[11px] whitespace-nowrap">
                      {doc.exception}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <StatusBadge status={doc.status} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <div className="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            doc.confidence >= 90
                              ? 'bg-emerald-500'
                              : doc.confidence >= 75
                              ? 'bg-[#1769E0]'
                              : doc.confidence >= 65
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${doc.confidence}%` }}
                        />
                      </div>
                      <span className="text-slate-600 font-semibold">{doc.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {doc.date}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDocument(doc);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-[#1769E0] hover:text-white hover:bg-[#1769E0] border border-[#1769E0]/30 rounded-md transition-colors shadow-2xs"
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="More options"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 2. MOBILE: Dedicated Document Cards (visible only on mobile < 768px) */}
      <div className="md:hidden divide-y divide-slate-100">
        {visibleDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onViewDocument(doc)}
            className="p-4 hover:bg-slate-50 transition-colors cursor-pointer space-y-3 active:bg-blue-50/30"
          >
            {/* Top row: Document ID & Date */}
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-[#1769E0]">
                {doc.id}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {doc.date}
              </span>
            </div>

            {/* Vendor Name & Type */}
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">
                {doc.vendor}
              </h4>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  doc.type === 'Invoice'
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}
              >
                {doc.type}
              </span>
            </div>

            {/* Amount & Exception Tag */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-base font-bold font-mono text-[#082B55]">
                ${doc.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="font-medium text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-xs">
                {doc.exception}
              </span>
            </div>

            {/* Status & Confidence progress & Action Button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <StatusBadge status={doc.status} size="sm" />
                <span className="text-[11px] font-mono text-slate-500 font-semibold">
                  {doc.confidence}%
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDocument(doc);
                }}
                className="min-h-[38px] px-3 py-1.5 bg-blue-50 text-[#1769E0] font-bold text-xs rounded-lg flex items-center gap-1 hover:bg-[#1769E0] hover:text-white transition-colors"
              >
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer: Showing 1–8 of 256 documents & Pagination */}
      <div className="p-3.5 sm:p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white text-xs">
        <span className="text-slate-500 font-mono text-[11px] text-center sm:text-left">
          Showing <strong className="text-slate-800">1–8</strong> of <strong className="text-slate-800">256</strong> documents
        </span>

        {/* Pagination controls */}
        <div className="flex items-center justify-center gap-1 font-mono text-xs">
          <button
            className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[1, 2, 3, 4, 5].map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md font-medium text-xs transition-colors ${
                currentPage === pageNum
                  ? 'bg-[#082B55] text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <span className="px-1 text-slate-400">...</span>

          <button
            onClick={() => setCurrentPage(32)}
            className={`min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md font-medium text-xs transition-colors ${
              currentPage === 32
                ? 'bg-[#082B55] text-white font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            32
          </button>

          <button
            className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            disabled={currentPage === 32}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
