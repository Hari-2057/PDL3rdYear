import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  percentage?: string;
  comparisonText: string;
  isIncrease: boolean;
  isFavorable: boolean; // whether positive/green vs slate/red styling
  icon: LucideIcon;
  variant: 'blue' | 'green' | 'red' | 'amber';
  visualizationType: 'bars' | 'sparkline-green' | 'sparkline-red' | 'sparkline-amber' | 'sparkline-blue';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  percentage,
  comparisonText,
  isIncrease,
  isFavorable,
  icon: Icon,
  variant,
  visualizationType,
}) => {
  const iconThemes = {
    blue: 'bg-blue-50 text-[#1769E0] border-blue-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    red: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className="w-[240px] sm:w-auto shrink-0 snap-start bg-white border border-[#E5EAF0] rounded-xl p-4 sm:p-4.5 shadow-xs flex flex-col justify-between h-[134px] transition-all hover:border-slate-300 hover:shadow-sm">
      {/* Top Header: Label & Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 truncate">{label}</span>
        <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${iconThemes[variant]}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Center Metric & Percentage */}
      <div className="flex items-baseline gap-2 mt-0.5">
        <span className="text-2xl font-bold tracking-tight text-[#082B55] font-sans">{value}</span>
        {percentage && (
          <span className="text-xs font-bold text-slate-500 font-mono">
            {percentage}
          </span>
        )}
      </div>

      {/* Bottom Comparison & Mini Visualization */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1 text-[11px] font-medium truncate">
          <span
            className={`font-semibold flex items-center gap-0.5 ${
              isFavorable ? 'text-emerald-600' : 'text-slate-600'
            }`}
          >
            <span className="font-bold">{isIncrease ? '↑' : '↓'}</span>
            <span>{comparisonText}</span>
          </span>
        </div>

        {/* Tiny visualizations */}
        <div className="shrink-0 w-12 h-4 flex items-end justify-end">
          {visualizationType === 'bars' && (
            <div className="flex items-end gap-0.5 h-full">
              <span className="w-1.5 h-2 bg-blue-200 rounded-xs" />
              <span className="w-1.5 h-3 bg-blue-300 rounded-xs" />
              <span className="w-1.5 h-2.5 bg-blue-400 rounded-xs" />
              <span className="w-1.5 h-4 bg-[#1769E0] rounded-xs" />
            </div>
          )}

          {visualizationType === 'sparkline-green' && (
            <svg className="w-12 h-4" viewBox="0 0 48 16" fill="none">
              <path d="M0 12L12 10L24 13L36 5L48 2" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}

          {visualizationType === 'sparkline-red' && (
            <svg className="w-12 h-4" viewBox="0 0 48 16" fill="none">
              <path d="M0 14L12 11L24 9L36 6L48 3" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}

          {visualizationType === 'sparkline-amber' && (
            <svg className="w-12 h-4" viewBox="0 0 48 16" fill="none">
              <path d="M0 4L12 6L24 9L36 12L48 14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}

          {visualizationType === 'sparkline-blue' && (
            <svg className="w-12 h-4" viewBox="0 0 48 16" fill="none">
              <path d="M0 2L12 5L24 10L36 12L48 14" stroke="#1769E0" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};
