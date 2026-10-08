import React, { useState } from 'react';
import { X, Filter, RotateCcw, Check } from 'lucide-react';

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: FilterState) => void;
}

export interface FilterState {
  dateRange: string;
  documentType: string;
  exceptionType: string;
  status: string;
  vendor: string;
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [documentType, setDocumentType] = useState('All');
  const [exceptionType, setExceptionType] = useState('All');
  const [status, setStatus] = useState('All');
  const [vendor, setVendor] = useState('All');

  if (!isOpen) return null;

  const handleReset = () => {
    setDateRange('Last 30 days');
    setDocumentType('All');
    setExceptionType('All');
    setStatus('All');
    setVendor('All');
  };

  const handleApply = () => {
    onApplyFilters?.({
      dateRange,
      documentType,
      exceptionType,
      status,
      vendor,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Bottom Sheet Content */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slideUp">
        {/* Drag handle for mobile */}
        <div className="pt-2 pb-1 sm:hidden flex justify-center">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E5EAF0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#1769E0]" />
            <h3 className="text-base font-bold text-[#082B55] tracking-tight">Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs">
          {/* 1. Date Range */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#082B55] uppercase tracking-wider text-[10px] font-mono">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Last 30 days', 'This Month', 'Last 7 days', 'All Time'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setDateRange(range)}
                  className={`min-h-[40px] px-3 py-2 rounded-lg border text-left font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-blue-50 border-[#1769E0] text-[#1769E0] font-semibold'
                      : 'border-[#E5EAF0] text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Document Type */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#082B55] uppercase tracking-wider text-[10px] font-mono">
              Document Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['All', 'Invoice', 'Expense'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDocumentType(type)}
                  className={`min-h-[40px] px-3 py-2 rounded-lg border text-center font-medium transition-colors ${
                    documentType === type
                      ? 'bg-blue-50 border-[#1769E0] text-[#1769E0] font-semibold'
                      : 'border-[#E5EAF0] text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Exception Type */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#082B55] uppercase tracking-wider text-[10px] font-mono">
              Exception Type
            </label>
            <select
              value={exceptionType}
              onChange={(e) => setExceptionType(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-[#E5EAF0] bg-white text-slate-800 font-medium focus:outline-none focus:border-[#1769E0]"
            >
              <option value="All">All Exceptions</option>
              <option value="PO mismatch">PO mismatch</option>
              <option value="Total mismatch">Total mismatch</option>
              <option value="Missing receipt">Missing receipt</option>
              <option value="Duplicate invoice">Duplicate invoice</option>
              <option value="Policy violation">Policy violation</option>
              <option value="Currency anomaly">Currency anomaly</option>
              <option value="Suspicious amount">Suspicious amount</option>
              <option value="Unknown vendor">Unknown vendor</option>
            </select>
          </div>

          {/* 4. Status */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#082B55] uppercase tracking-wider text-[10px] font-mono">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Pending Review', 'Auto-resolved', 'Blocked'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`min-h-[40px] px-3 py-2 rounded-lg border text-left font-medium transition-colors ${
                    status === st
                      ? 'bg-blue-50 border-[#1769E0] text-[#1769E0] font-semibold'
                      : 'border-[#E5EAF0] text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Vendor */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#082B55] uppercase tracking-wider text-[10px] font-mono">
              Vendor
            </label>
            <select
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-[#E5EAF0] bg-white text-slate-800 font-medium focus:outline-none focus:border-[#1769E0]"
            >
              <option value="All">All Vendors</option>
              <option value="Acme Supplies">Acme Supplies</option>
              <option value="Global Tech Ltd">Global Tech Ltd</option>
              <option value="Priya Sharma">Priya Sharma</option>
              <option value="OfficeMart">OfficeMart</option>
              <option value="Euro Services">Euro Services</option>
              <option value="Rahul Mehta">Rahul Mehta</option>
              <option value="BuildRight Co">BuildRight Co</option>
              <option value="TravelPlus">TravelPlus</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-[#E5EAF0] bg-slate-50/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[44px] px-4 py-2 rounded-lg border border-[#E5EAF0] bg-white text-slate-600 font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 min-h-[44px] px-4 py-2 rounded-lg bg-[#1769E0] hover:bg-blue-600 text-white font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
