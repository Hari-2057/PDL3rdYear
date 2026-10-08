import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExceptionCategory {
  name: string;
  percentage: number;
  count: number;
  color: string;
}

export const ExceptionBreakdown: React.FC = () => {
  const [showAllMobile, setShowAllMobile] = useState(false);

  const data: ExceptionCategory[] = [
    { name: 'Total mismatch', percentage: 28, count: 72, color: '#1769E0' },
    { name: 'Missing receipt', percentage: 18, count: 46, color: '#F59E0B' },
    { name: 'Duplicate invoice', percentage: 15, count: 38, color: '#EF4444' },
    { name: 'PO/GR mismatch', percentage: 14, count: 36, color: '#4F46E5' },
    { name: 'Policy violation', percentage: 12, count: 31, color: '#7C3AED' },
    { name: 'Unknown vendor', percentage: 8, count: 20, color: '#64748B' },
    { name: 'Currency/date anomaly', percentage: 5, count: 13, color: '#0D9488' },
    { name: 'Suspicious amount', percentage: 4, count: 10, color: '#E11D48' },
  ];

  // Mobile top 5 or all 8
  const displayedMobile = showAllMobile ? data : data.slice(0, 5);

  return (
    <div className="bg-white border border-[#E5EAF0] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#082B55] tracking-tight">Exception Breakdown</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Distribution of exception types</p>
        </div>
        <span className="text-[11px] font-mono font-semibold text-slate-600 bg-[#F5F8FC] border border-[#E5EAF0] px-2 py-0.5 rounded">
          256 detected
        </span>
      </div>

      {/* Desktop / Tablet List (All 8) */}
      <div className="hidden sm:block space-y-2.5 my-3.5">
        {data.map((item) => (
          <div key={item.name} className="space-y-1 group">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 text-[11px] group-hover:text-[#082B55] transition-colors">
                {item.name}
              </span>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-slate-400 font-normal">({item.count})</span>
                <span className="font-bold text-[#082B55]">{item.percentage}%</span>
              </div>
            </div>

            {/* Progress track */}
            <div className="w-full bg-[#F5F8FC] h-2 rounded-full overflow-hidden border border-slate-100">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${item.percentage * 3.3}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Ranked List (1 through 5, with expansion toggle) */}
      <div className="sm:hidden space-y-3 my-3">
        {displayedMobile.map((item, idx) => (
          <div key={item.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-100 text-[#082B55] font-mono text-[10px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="font-semibold text-slate-800 text-[11px]">
                  {item.name}
                </span>
              </div>
              <span className="font-mono font-bold text-[#082B55] text-xs">
                {item.percentage}%
              </span>
            </div>

            {/* Mobile progress bar */}
            <div className="w-full bg-[#F5F8FC] h-2 rounded-full overflow-hidden border border-slate-100">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${item.percentage * 3.3}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}

        {/* Mobile Expand / Collapse Button */}
        <button
          onClick={() => setShowAllMobile(!showAllMobile)}
          className="w-full py-1.5 text-[11px] font-semibold text-[#1769E0] flex items-center justify-center gap-1 hover:underline pt-1"
        >
          <span>{showAllMobile ? 'Show Top 5 Only' : 'Show All 8 Categories'}</span>
          {showAllMobile ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Footer info */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          Leading driver: <strong className="text-[#082B55] font-semibold">Total mismatch (28%)</strong>
        </span>
        <span className="text-[#1769E0] font-semibold cursor-pointer hover:underline">
          View taxonomy →
        </span>
      </div>
    </div>
  );
};
