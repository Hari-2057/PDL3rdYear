import React, { useState } from 'react';
import {
  FileText,
  Layers,
  AlertOctagon,
  ShieldCheck,
  GitCompare,
  Fingerprint,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Activity,
} from 'lucide-react';

interface AgentInfo {
  name: string;
  activity: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
}

export const AiAgentStatusPanel: React.FC = () => {
  const [expandedMobile, setExpandedMobile] = useState(false);

  const agents: AgentInfo[] = [
    {
      name: 'Extraction Agent',
      activity: 'Processing documents',
      icon: FileText,
      iconColor: 'text-[#1769E0]',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Classifier Agent',
      activity: 'Categorizing documents',
      icon: Layers,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      name: 'Exception Detector',
      activity: 'Detecting anomalies',
      icon: AlertOctagon,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      name: 'Policy Agent',
      activity: 'Checking policy violations',
      icon: ShieldCheck,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Reconciliation Agent',
      activity: 'Matching PO/GR',
      icon: GitCompare,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      name: 'Fraud Detection Agent',
      activity: 'Monitoring anomalies',
      icon: Fingerprint,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
  ];

  return (
    <div className="bg-white border border-[#E5EAF0] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#1769E0]" />
          <h3 className="text-sm font-bold text-[#082B55] tracking-tight">AI Agent Status</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>6 agents operational</span>
        </div>
      </div>

      {/* Agents List */}
      <div className="divide-y divide-slate-100 my-1">
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          // On mobile, if not expanded, only show first 3
          const isHiddenOnMobile = !expandedMobile && index >= 3;

          return (
            <div
              key={agent.name}
              className={`flex items-center justify-between py-2.5 px-1 hover:bg-[#F5F8FC] rounded-lg transition-colors cursor-pointer group ${
                isHiddenOnMobile ? 'hidden sm:flex' : 'flex'
              }`}
            >
              {/* Left: Circular colored AI icon + Name + Activity */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${agent.bgColor} ${agent.iconColor} border border-slate-200/50 shadow-2xs group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="leading-tight truncate">
                  <p className="text-xs font-semibold text-[#082B55] group-hover:text-[#1769E0] transition-colors truncate">
                    {agent.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{agent.activity}</p>
                </div>
              </div>

              {/* Right: Green operational indicator + Right-facing arrow */}
              <div className="flex items-center gap-2.5 shrink-0 pl-2">
                <span
                  className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"
                  title="Operational"
                />
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Collapsible Button: "View all agents" */}
      <div className="sm:hidden pt-2 border-t border-slate-100">
        <button
          onClick={() => setExpandedMobile(!expandedMobile)}
          className="w-full min-h-[40px] flex items-center justify-center gap-1.5 text-xs font-semibold text-[#1769E0] hover:text-blue-800 transition-colors"
        >
          <span>{expandedMobile ? 'Show less' : 'View all agents'}</span>
          {expandedMobile ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Footer */}
      <div className="hidden sm:flex pt-2.5 border-t border-slate-100 items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Latency: <strong className="text-slate-800">~120ms</strong></span>
        <span className="text-[#1769E0] font-semibold cursor-pointer hover:underline font-sans">
          Cluster health metrics →
        </span>
      </div>
    </div>
  );
};
