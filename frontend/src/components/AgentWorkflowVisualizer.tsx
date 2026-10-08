import React, { useState } from 'react';
import { AgentExecution } from '../types';
import {
  FileText, Cpu, CheckCircle2, GitCompare, ShieldCheck, AlertTriangle,
  ArrowRight, Clock, Play, Terminal, Zap
} from 'lucide-react';

interface AgentWorkflowVisualizerProps {
  executions?: AgentExecution[];
  currentActiveAgent?: string;
  isProcessing?: boolean;
}

export const AGENT_STEPS = [
  {
    id: 'ocr_agent',
    name: 'OCR Agent',
    icon: FileText,
    role: 'Document Vision & Layout Parsing',
    desc: 'Extracts bounding boxes, invoice header & raw tabular tokens',
    model: 'Tesseract OCR + Vision Parser',
    inputSchema: 'PDF Binary / Image Stream',
    outputSchema: 'Raw text block & token layout',
  },
  {
    id: 'extraction_agent',
    name: 'Extraction Agent',
    icon: Cpu,
    role: 'Entity & Line Item Extraction',
    desc: 'Extracts Vendor, PO#, line items, taxes, currency & totals',
    model: 'Structured Extraction Engine',
    inputSchema: 'Raw text blocks',
    outputSchema: '12 normalized invoice schema fields',
  },
  {
    id: 'validation_agent',
    name: 'Validation Agent',
    icon: CheckCircle2,
    role: 'Deterministic Math & Integrity',
    desc: 'Verifies subtotal + tax = total, date sanity & duplicates',
    model: 'Deterministic Rule Engine',
    inputSchema: 'Parsed line items & totals',
    outputSchema: 'Math integrity boolean & variance delta',
  },
  {
    id: 'po_matching_agent',
    name: 'PO Matching Agent',
    icon: GitCompare,
    role: 'Two-Way Line Item Reconciliation',
    desc: 'Matches PO lines, computes item variance % and quantities',
    model: 'Fuzzy Matching & Line Classifier',
    inputSchema: 'Invoice items + Baseline PO#',
    outputSchema: 'Variance score & line discrepancy table',
  },
  {
    id: 'policy_agent',
    name: 'Policy Agent',
    icon: ShieldCheck,
    role: 'Corporate Policy Compliance',
    desc: 'Checks $50k auto-limit, manager threshold & PO requirements',
    model: 'Policy Constraint Solver',
    inputSchema: 'Invoice total, department, vendor rating',
    outputSchema: 'Approval authority requirements',
  },
  {
    id: 'fraud_agent',
    name: 'Fraud & Anomaly Agent',
    icon: AlertTriangle,
    role: 'Risk Scoring & Anomaly Detection',
    desc: 'Generates 0-100 risk score and scans vendor history deviations',
    model: 'Cosine Anomaly & Heuristic Scorer',
    inputSchema: 'Historical invoice vector + vendor record',
    outputSchema: 'Risk score (0-100) & risk factors',
  },
  {
    id: 'decision_agent',
    name: 'Decision Agent',
    icon: Zap,
    role: 'Synthesis & Execution Dispatcher',
    desc: 'Synthesizes all agent states to issue APPROVE, REVIEW, or REJECT',
    model: 'LangGraph Orchestrator Synthesis',
    inputSchema: 'All 6 prior agent outputs',
    outputSchema: 'Final decision, rationale & HITL route',
  },
];

export const AgentWorkflowVisualizer: React.FC<AgentWorkflowVisualizerProps> = ({
  executions = [],
  currentActiveAgent,
  isProcessing = false,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<typeof AGENT_STEPS[0] | null>(null);
  const [simActiveIdx, setSimActiveIdx] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulation runner for live demonstration
  const handleStartSimulation = () => {
    setIsSimulating(true);
    setSimActiveIdx(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= AGENT_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsSimulating(false);
          setSimActiveIdx(-1);
        }, 1200);
      } else {
        setSimActiveIdx(current);
      }
    }, 450);
  };

  const getAgentStatus = (agentName: string, stepIdx: number) => {
    if (isSimulating) {
      if (stepIdx < simActiveIdx) return 'SUCCESS';
      if (stepIdx === simActiveIdx) return 'RUNNING';
      return 'PENDING';
    }

    const matched = executions.find(
      (e) =>
        e.agent_name.toLowerCase().includes(agentName.toLowerCase()) ||
        agentName.toLowerCase().includes(e.agent_name.toLowerCase())
    );

    if (matched) return matched.status;
    if (isProcessing && currentActiveAgent && currentActiveAgent.toLowerCase().includes(agentName.toLowerCase())) {
      return 'RUNNING';
    }
    return executions.length > 0 ? 'PENDING' : 'READY';
  };

  const getAgentTime = (agentName: string, stepIdx: number) => {
    if (isSimulating && stepIdx <= simActiveIdx) {
      return `${Math.floor(100 + stepIdx * 35)}ms`;
    }
    const matched = executions.find(
      (e) =>
        e.agent_name.toLowerCase().includes(agentName.toLowerCase()) ||
        agentName.toLowerCase().includes(e.agent_name.toLowerCase())
    );
    return matched ? `${matched.execution_time_ms}ms` : null;
  };

  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 space-y-6 border border-[#E5EAF0] shadow-xs relative">
      {/* Header with Title & Simulation Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1769E0]" />
            </span>
            <h3 className="text-base font-bold text-[#082B55] tracking-tight flex items-center gap-2">
              LangGraph Multi-Agent Execution Pipeline
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#1769E0] border border-blue-200">
                7 Nodes Active
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Deterministic rule engines + neural verification state machine • Click any node to inspect telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStartSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1769E0] border border-blue-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Processing Nodes...' : 'Simulate Live Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Horizontal Flow Diagram */}
      <div className="overflow-x-auto pb-4 pt-2 -mx-2 px-2">
        <div className="flex items-center min-w-max space-x-2">
          {AGENT_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const status = getAgentStatus(step.name, idx);
            const execTime = getAgentTime(step.name, idx);
            const isSelected = selectedAgent?.id === step.id;

            let cardStyles = 'bg-[#F8FAFC] border-[#E5EAF0] text-slate-700 hover:border-slate-300';
            let iconStyles = 'text-slate-500 bg-white border-[#E5EAF0]';
            let statusText = 'Ready';

            if (status === 'SUCCESS') {
              cardStyles = 'bg-emerald-50/70 border-emerald-300 text-emerald-800';
              iconStyles = 'text-emerald-700 bg-emerald-100/60 border-emerald-300';
              statusText = 'Verified';
            } else if (status === 'WARNING') {
              cardStyles = 'bg-amber-50/70 border-amber-300 text-amber-800';
              iconStyles = 'text-amber-700 bg-amber-100/60 border-amber-300';
              statusText = 'Flagged';
            } else if (status === 'RUNNING') {
              cardStyles = 'bg-blue-50/80 border-[#1769E0] text-[#082B55] ring-1 ring-[#1769E0]';
              iconStyles = 'text-[#1769E0] bg-blue-100/60 border-blue-300 animate-spin';
              statusText = 'Executing...';
            } else if (status === 'FAILED') {
              cardStyles = 'bg-rose-50/70 border-rose-300 text-rose-800';
              iconStyles = 'text-rose-700 bg-rose-100/60 border-rose-300';
              statusText = 'Rejected';
            }

            return (
              <React.Fragment key={step.id}>
                {/* Agent Node Card */}
                <div
                  onClick={() => setSelectedAgent(step)}
                  className={`relative cursor-pointer flex flex-col p-3.5 rounded-xl border w-44 transition-all duration-200 transform hover:-translate-y-0.5 shadow-2xs ${cardStyles} ${
                    isSelected ? 'ring-2 ring-[#1769E0] border-[#1769E0]' : ''
                  }`}
                >
                  {/* Top bar in card */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`p-1.5 rounded-lg border ${iconStyles}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-[#E5EAF0] text-slate-500">
                      Node {idx + 1}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#082B55] truncate tracking-tight">{step.name}</h4>
                  <p className="text-[10px] text-slate-500 leading-snug line-clamp-2 mt-0.5 mb-2 min-h-[28px]">
                    {step.desc}
                  </p>

                  {/* Card bottom telemetry */}
                  <div className="mt-auto pt-2 border-t border-[#E5EAF0] flex items-center justify-between text-[10px] font-mono">
                    <span className="font-semibold flex items-center gap-1">
                      {status === 'SUCCESS' && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                      {statusText}
                    </span>
                    {execTime && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-2.5 h-2.5 text-[#1769E0]" /> {execTime}
                      </span>
                    )}
                  </div>
                </div>

                {/* Animated Connector Arrow */}
                {idx < AGENT_STEPS.length - 1 && (
                  <div className="relative flex items-center justify-center px-1 shrink-0">
                    <div className="w-5 h-0.5 bg-slate-200 relative overflow-hidden">
                      {isSimulating && idx < simActiveIdx && (
                        <div className="absolute inset-0 bg-[#1769E0] animate-pulse" />
                      )}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 -ml-1" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Node Inspector Drawer when an Agent is clicked */}
      {selectedAgent && (
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] space-y-3 relative overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#1769E0] border border-blue-200">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#082B55] flex items-center gap-2">
                  <span>Node Telemetry: {selectedAgent.name}</span>
                  <span className="text-[10px] font-mono text-[#1769E0] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedAgent.model}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500">{selectedAgent.role}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedAgent(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-mono px-2 py-0.5 rounded bg-white border border-[#E5EAF0] cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-[#E5EAF0]">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">Input Stream</span>
              <p className="text-[#082B55] font-mono text-[11px]">{selectedAgent.inputSchema}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#E5EAF0]">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">State Mutation</span>
              <p className="text-[#082B55] font-mono text-[11px]">{selectedAgent.outputSchema}</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#E5EAF0]">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">Error Policy</span>
              <p className="text-[#082B55] font-mono text-[11px]">Route to Reviewer on confidence &lt; 95%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
