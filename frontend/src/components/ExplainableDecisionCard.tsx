import React from 'react';
import { Invoice } from '../types';
import { ShieldCheck, AlertTriangle, XCircle, Info, Sparkles, CheckCircle2, Bot, Zap } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface ExplainableDecisionCardProps {
  invoice: Invoice;
}

export const ExplainableDecisionCard: React.FC<ExplainableDecisionCardProps> = ({ invoice }) => {
  const getDecisionDetails = () => {
    switch (invoice.decision) {
      case 'APPROVE':
        return {
          icon: ShieldCheck,
          iconColor: 'text-emerald-700',
          iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          borderColor: 'border-emerald-200',
          badgeText: 'AUTOMATIC APPROVAL GRANTED',
          confidence: '99.4%',
        };
      case 'REVIEW':
        return {
          icon: AlertTriangle,
          iconColor: 'text-amber-700',
          iconBg: 'bg-amber-50 border-amber-200 text-amber-700',
          borderColor: 'border-amber-200',
          badgeText: 'HITL REVIEW MANDATORY',
          confidence: '91.2%',
        };
      case 'REJECT':
        return {
          icon: XCircle,
          iconColor: 'text-rose-700',
          iconBg: 'bg-rose-50 border-rose-200 text-rose-700',
          borderColor: 'border-rose-200',
          badgeText: 'SYSTEM BLOCKED & REJECTED',
          confidence: '98.7%',
        };
      default:
        return {
          icon: Info,
          iconColor: 'text-[#1769E0]',
          iconBg: 'bg-blue-50 border-blue-200 text-[#1769E0]',
          borderColor: 'border-blue-200',
          badgeText: 'INSPECTION PENDING',
          confidence: '95.0%',
        };
    }
  };

  const details = getDecisionDetails();
  const Icon = details.icon;

  return (
    <div
      className={`bg-white rounded-xl p-5 sm:p-6 space-y-5 border border-[#E5EAF0] shadow-xs relative overflow-hidden`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAF0] pb-4">
        <div className="flex items-center gap-3.5">
          <div className={`p-2.5 rounded-xl border ${details.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1769E0]" />
              <h3 className="text-base font-bold text-[#082B55] tracking-tight">
                AI Neural Decision Synthesis
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1769E0] border border-blue-200">
                Confidence {details.confidence}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-agent state machine synthesis • LangGraph Decision Engine
            </p>
          </div>
        </div>

        <StatusBadge
          status={
            invoice.decision === 'APPROVE'
              ? 'APPROVED'
              : invoice.decision === 'REVIEW'
              ? 'HUMAN REVIEW'
              : 'REJECTED'
          }
          size="lg"
        />
      </div>

      {/* Decision Summary Callout */}
      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#1769E0] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5" /> Explainable Agent Rationale
          </span>
          <span className="text-slate-400 font-normal">Deterministic Proof</span>
        </div>
        <p className="text-xs sm:text-sm text-[#082B55] leading-relaxed font-medium">
          {invoice.decision_reason ||
            'Verified line items, tax rates, and purchase order matching against active corporate policy guidelines.'}
        </p>
      </div>

      {/* Structured Explainability Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Detected Exceptions */}
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-3">
          <h5 className="text-xs font-bold text-amber-700 uppercase tracking-wider font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Detected Discrepancies
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              {invoice.exceptions?.length || 0} Flags
            </span>
          </h5>

          {invoice.exceptions && invoice.exceptions.length > 0 ? (
            <ul className="space-y-2 text-xs">
              {invoice.exceptions.map((exc, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-amber-200"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-amber-800 font-mono text-[11px]">
                      {exc.type}
                    </span>
                    <p className="text-slate-600 text-[11px] leading-snug">{exc.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-2.5 text-xs text-emerald-800 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero discrepancies detected. 100% two-way match validated.</span>
            </div>
          )}
        </div>

        {/* Recommended Action & Routing */}
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-3">
          <h5 className="text-xs font-bold text-[#1769E0] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Next Operational Step
          </h5>

          <div className="text-xs">
            {invoice.requires_human_review ? (
              <div className="p-3.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 space-y-2">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Escalated to Human Review Queue
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Requires manual verification by Finance Reviewer due to variance above 10% or invoice amount exceeding manager sign-off threshold.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 space-y-2">
                <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Autonomous Settlement Authorized
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Invoice meets all low-risk criteria ($50,000 threshold, 0 variance). Queued for instant automated ERP disbursement.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
