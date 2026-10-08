import React from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onViewExceptionQueue: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onViewExceptionQueue }) => {
  return (
    <div className="relative rounded-xl p-5 sm:p-7 text-white shadow-sm overflow-hidden hero-corporate-visual border border-[#0A3366]">
      {/* Background Architectural Vector Geometry on Right - hidden on mobile & tablet */}
      <div className="absolute right-0 top-0 bottom-0 w-2/5 opacity-15 pointer-events-none hidden lg:block">
        <svg viewBox="0 0 500 240" fill="none" className="w-full h-full object-cover">
          <path d="M60 240L180 30L300 240M180 30V240M300 240L420 70L540 240M420 70V240" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="0" y1="90" x2="500" y2="90" stroke="white" strokeWidth="1" />
          <line x1="0" y1="160" x2="500" y2="160" stroke="white" strokeWidth="1" />
          <circle cx="180" cy="30" r="4.5" fill="#60A5FA" />
          <circle cx="420" cy="70" r="4.5" fill="#60A5FA" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
        {/* Left Content */}
        <div className="space-y-2.5 sm:space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#1769E0]/30 border border-[#60A5FA]/30 text-blue-200 text-[10px] sm:text-[11px] font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#60A5FA]" />
            <span>Autonomous Multi-Agent AP Platform</span>
          </div>

          {/* Desktop Headline vs Mobile Headline */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-sans leading-tight">
            <span className="hidden sm:inline">Turn invoices into insights</span>
            <span className="sm:hidden">Invoice intelligence, simplified.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed">
            <span className="hidden sm:inline">AI agents detect, resolve and automate your invoice and expense exceptions.</span>
            <span className="sm:hidden">AI agents detect, resolve and automate exceptions.</span>
          </p>

          {/* Feature Pills - Horizontally Scrollable on Mobile */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1 scrollbar-none max-w-full">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 text-white text-[10px] sm:text-[11px] font-medium border border-white/15 whitespace-nowrap shrink-0">
              <Check className="w-3 h-3 text-emerald-400" /> Faster Processing
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 text-white text-[10px] sm:text-[11px] font-medium border border-white/15 whitespace-nowrap shrink-0">
              <Check className="w-3 h-3 text-emerald-400" /> Higher Accuracy
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 text-white text-[10px] sm:text-[11px] font-medium border border-white/15 whitespace-nowrap shrink-0">
              <Check className="w-3 h-3 text-emerald-400" /> Audit Ready
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 text-white text-[10px] sm:text-[11px] font-medium border border-white/15 whitespace-nowrap shrink-0">
              <Check className="w-3 h-3 text-emerald-400" /> AI Agent Powered
            </span>
          </div>
        </div>

        {/* Right Floating White Card */}
        <div className="w-full lg:w-80 bg-white text-[#082B55] rounded-xl p-4 sm:p-5 shadow-md border border-[#E5EAF0] space-y-3 shrink-0">
          <div className="space-y-1.5 text-xs font-semibold text-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1769E0]" />
              <span>Reduce manual effort</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1769E0]" />
              <span>Ensure policy compliance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1769E0]" />
              <span>Get real-time insights</span>
            </div>
          </div>

          <button
            onClick={onViewExceptionQueue}
            className="w-full min-h-[44px] py-2 px-3 bg-[#1769E0] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
          >
            <span>View Exception Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
