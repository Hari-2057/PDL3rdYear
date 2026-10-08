import React from 'react';
import { Sparkles, TrendingUp, ArrowRight, BarChart2 } from 'lucide-react';

interface AiInsightCardProps {
  onViewAnalysis?: () => void;
}

export const AiInsightCard: React.FC<AiInsightCardProps> = ({ onViewAnalysis }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50 border border-[#BFDBFE] rounded-xl p-5 shadow-xs space-y-3 relative overflow-hidden">
      {/* Decorative subtle background icon */}
      <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none">
        <Sparkles className="w-24 h-24 text-[#1769E0]" />
      </div>

      {/* Header with Title: “AI Insight ✨” and small analytics icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[#082B55]">
          <h3 className="text-xs font-bold tracking-tight font-sans">AI Insight ✨</h3>
        </div>
        <div className="w-6 h-6 rounded-md bg-blue-100/70 text-[#1769E0] flex items-center justify-center">
          <BarChart2 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Content */}
      <p className="text-xs text-slate-700 font-normal leading-relaxed">
        “Auto-resolution increased by <strong className="text-emerald-700 font-bold">8%</strong> this month while manual review time decreased by <strong className="text-[#1769E0] font-bold">45%</strong>.”
      </p>

      {/* Button: “View detailed analysis →” */}
      <div className="pt-1">
        <button
          onClick={onViewAnalysis}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1769E0] hover:text-blue-800 transition-colors group cursor-pointer"
        >
          <span>View detailed analysis</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
