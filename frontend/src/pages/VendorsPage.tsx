import React from 'react';
import { Vendor } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Building2, ShieldAlert, DollarSign, Layers } from 'lucide-react';

interface VendorsPageProps {
  vendors: Vendor[];
}

export const VendorsPage: React.FC<VendorsPageProps> = ({ vendors = [] }) => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-[#E5EAF0] pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#082B55] tracking-tight flex items-center gap-2.5">
          <span>Vendor Intelligence Directory</span>
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1769E0] border border-blue-200">
            {vendors.length} Vendors Active
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Historical vendor risk profiles, cumulative expenditure tracking, and anomaly scoring
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vendors.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-xl p-5 border border-[#E5EAF0] shadow-xs hover:border-slate-300 hover:shadow-sm space-y-4 flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-3">
                <div>
                  <span className="font-mono text-[10px] text-[#1769E0] font-bold block uppercase tracking-wider">
                    {v.vendor_id_str}
                  </span>
                  <h3 className="text-base font-bold text-[#082B55] group-hover:text-[#1769E0] transition-colors truncate max-w-[200px]">
                    {v.name}
                  </h3>
                </div>
                <StatusBadge status={v.risk_level + ' Risk'} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono mt-3">
                <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E5EAF0]">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">Invoices</span>
                  <span className="font-bold text-[#082B55] text-sm">{v.total_invoices}</span>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E5EAF0]">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">Spend</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    ${(v.total_value / 1000).toFixed(1)}k
                  </span>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E5EAF0]">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">Avg Value</span>
                  <span className="font-semibold text-slate-700">
                    ${(v.avg_invoice_amount / 1000).toFixed(1)}k
                  </span>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E5EAF0]">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">Exceptions</span>
                  <span className="font-bold text-amber-700">
                    {v.exception_count} Flagged
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-500 pt-3 border-t border-[#E5EAF0] flex items-center justify-between">
              <span className="truncate">Tax ID: {v.tax_id || 'N/A'}</span>
              <span className="text-[#1769E0] font-semibold">{v.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
