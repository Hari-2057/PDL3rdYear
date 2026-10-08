import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  label: string;
  metric: string;
  percentageBadge?: string;
  changeText: string;
  isPositiveChange?: boolean;
  icon: LucideIcon;
  iconColorVariant: 'blue' | 'green' | 'red' | 'amber' | 'cyan';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  metric,
  percentageBadge,
  changeText,
  isPositiveChange = true,
  icon: Icon,
  iconColorVariant,
}) => {
  const iconVariants = {
    blue: {
      bg: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    green: {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    red: {
      bg: 'bg-red-50 text-red-600 border-red-100',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    cyan: {
      bg: 'bg-teal-50 text-teal-600 border-teal-100',
    },
  };

  const currentVariant = iconVariants[iconColorVariant] || iconVariants.blue;

  // Check if change is positive or negative (note: for exceptions, +5% is technically warning)
  const isTrendGood = isPositiveChange;

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between h-[132px] transition-all hover:border-slate-300 hover:shadow-sm">
      {/* Top Label & Minimal Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 truncate">{label}</span>
        <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${currentVariant.bg}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Middle Metric & Percentage Badge */}
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans">{metric}</span>
        {percentageBadge && (
          <span className="text-xs font-semibold text-slate-500 font-mono">
            {percentageBadge}
          </span>
        )}
      </div>

      {/* Bottom Change Subtext */}
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mt-2">
        <span
          className={`font-semibold inline-flex items-center gap-0.5 ${
            isTrendGood ? 'text-emerald-600' : 'text-slate-600'
          }`}
        >
          {isTrendGood ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : <TrendingDown className="w-3 h-3 text-slate-500" />}
          {changeText}
        </span>
      </div>
    </div>
  );
};
