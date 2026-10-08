import React from 'react';
import {
  CheckCircle2, Cpu, GitCompare, ShieldCheck,
  AlertTriangle, FileText, Zap, Layers
} from 'lucide-react';
import { AgentWorkflowVisualizer } from '../components/AgentWorkflowVisualizer';

export const AGENT_MONITOR_DATA = [
  {
    name: 'Document / OCR Vision Agent',
    id: 'ocr',
    tasks: 1245,
    successRate: '99.4%',
    avgTime: '120ms',
    icon: FileText,
    desc: 'Dual-engine document rasterization, layout analysis & raw OCR text extraction.',
    model: 'Tesseract OCR + LayoutLM',
    color: 'blue',
  },
  {
    name: 'Invoice Extraction Agent',
    id: 'extraction',
    tasks: 1245,
    successRate: '98.8%',
    avgTime: '250ms',
    icon: Cpu,
    desc: 'Extracts 12 core metadata fields, tabular line items, tax IDs & currency rates.',
    model: 'Structured Extraction Engine',
    color: 'blue',
  },
  {
    name: 'Validation Agent',
    id: 'validation',
    tasks: 1245,
    successRate: '99.1%',
    avgTime: '180ms',
    icon: CheckCircle2,
    desc: 'Executes mathematical verification (Quantity × Rate = Total), date validity & checksums.',
    model: 'Deterministic Constraint Engine',
    color: 'emerald',
  },
  {
    name: 'PO Matching Agent',
    id: 'po_matching',
    tasks: 1245,
    successRate: '97.5%',
    avgTime: '210ms',
    icon: GitCompare,
    desc: 'Cross-references baseline purchase orders, calculating line variance and price creep.',
    model: 'Fuzzy Token Matcher + SQL',
    color: 'indigo',
  },
  {
    name: 'Policy Compliance Agent',
    id: 'policy',
    tasks: 1245,
    successRate: '100%',
    avgTime: '140ms',
    icon: ShieldCheck,
    desc: 'Enforces corporate limits, tiered approvals, mandatory PO rules & spending ceilings.',
    model: 'Corporate Policy Solver',
    color: 'purple',
  },
  {
    name: 'Fraud & Anomaly Agent',
    id: 'fraud',
    tasks: 1245,
    successRate: '98.2%',
    avgTime: '290ms',
    icon: AlertTriangle,
    desc: 'Scans for duplicate invoices, vendor address drifts, unusual round numbers & spikes.',
    model: 'Cosine Anomaly & Heuristics',
    color: 'amber',
  },
  {
    name: 'Decision Orchestration Agent',
    id: 'decision',
    tasks: 1245,
    successRate: '100%',
    avgTime: '150ms',
    icon: Zap,
    desc: 'Synthesizes multi-agent state into actionable APPROVE, REVIEW, or REJECT outcomes.',
    model: 'LangGraph State Orchestrator',
    color: 'blue',
  },
];

export const AiAgentsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAF0] pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#082B55] tracking-tight flex items-center gap-2.5">
            <span>AI Multi-Agent Topology & Diagnostics</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1769E0] border border-blue-200">
              LangGraph State Graph
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time telemetry, success metrics, and topology of the 7 autonomous LangGraph agent nodes
          </p>
        </div>

        {/* Global Cluster Stats Pill */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-emerald-800 font-semibold">Cluster: HEALTHY</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#082B55]">
            Pipeline Avg: <strong className="text-[#1769E0]">1.28s</strong>
          </div>
        </div>
      </div>

      {/* Visual Interactive Agent Topology Graph */}
      <AgentWorkflowVisualizer />

      {/* 7 Agent Status Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#082B55] uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#1769E0]" />
          Autonomous Agent Specifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AGENT_MONITOR_DATA.map((ag) => {
            const Icon = ag.icon;
            return (
              <div
                key={ag.id}
                className="bg-white rounded-xl p-5 border border-[#E5EAF0] shadow-xs hover:border-slate-300 hover:shadow-sm space-y-4 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 text-[#1769E0] border border-blue-200 group-hover:bg-[#1769E0] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#082B55]">
                          {ag.name}
                        </h4>
                        <span className="text-[10px] font-mono text-[#1769E0] flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {ag.model}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                    {ag.desc}
                  </p>
                </div>

                {/* Agent Performance Telemetry */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#E5EAF0] font-mono">
                  <div className="bg-[#F8FAFC] p-2 rounded-lg border border-[#E5EAF0]">
                    <span className="text-[9px] text-slate-500 block uppercase font-semibold">Tasks</span>
                    <span className="text-xs font-bold text-[#082B55]">{ag.tasks}</span>
                  </div>
                  <div className="bg-[#F8FAFC] p-2 rounded-lg border border-[#E5EAF0]">
                    <span className="text-[9px] text-slate-500 block uppercase font-semibold">Accuracy</span>
                    <span className="text-xs font-bold text-emerald-700">{ag.successRate}</span>
                  </div>
                  <div className="bg-[#F8FAFC] p-2 rounded-lg border border-[#E5EAF0]">
                    <span className="text-[9px] text-slate-500 block uppercase font-semibold">Latency</span>
                    <span className="text-xs font-bold text-[#1769E0]">{ag.avgTime}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
