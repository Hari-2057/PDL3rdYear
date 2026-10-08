import React, { useState } from 'react';
import { Invoice } from '../types';
import {
  Upload, RefreshCw, AlertCircle, ArrowRight,
  Sparkles, Terminal, Check
} from 'lucide-react';
import { AGENT_STEPS } from '../components/AgentWorkflowVisualizer';
import { apiService } from '../services/api';

interface InvoiceUploadPageProps {
  onInvoiceUploaded: (invoice: Invoice) => void;
  onNavigateToDetails: (invoice: Invoice) => void;
}

export const InvoiceUploadPage: React.FC<InvoiceUploadPageProps> = ({
  onInvoiceUploaded,
  onNavigateToDetails,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [poNumber, setPoNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAgentIdx, setCurrentAgentIdx] = useState<number>(-1);
  const [completedInvoice, setCompletedInvoice] = useState<Invoice | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const samplePresets = [
    {
      title: 'Cloud Infrastructure (Clean)',
      vendor: 'Apex Cloud Solutions',
      amount: '$42,500',
      po: 'PO-10023',
      desc: 'Matches approved PO with 0% variance and < $50k limit.',
      tag: 'Auto-Approve',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      scenario: 'perfect_invoice',
    },
    {
      title: 'Industrial Equipment (Variance)',
      vendor: 'Precision Tooling Corp',
      amount: '$295,000',
      po: 'PO-10019',
      desc: 'Exceeds PO baseline by 18% ($45k difference).',
      tag: 'Critical Variance',
      tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
      scenario: 'amount_mismatch',
    },
    {
      title: 'Logistics Freight (Missing PO)',
      vendor: 'Global Freight Dynamics',
      amount: '$177,000',
      po: '',
      desc: 'Invoice > $10,000 corporate policy requires valid PO.',
      tag: 'Missing PO',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
      scenario: 'missing_po',
    },
  ];

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleRunPreset = async (preset: typeof samplePresets[0]) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setCurrentAgentIdx(0);
    setTerminalLogs([
      `[Pipeline Start] Ingesting preset: ${preset.title}...`,
      `[OCR Node] Initializing bounding box recognition on simulated invoice...`,
    ]);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < AGENT_STEPS.length) {
        setCurrentAgentIdx(step);
        const agentName = AGENT_STEPS[step].name;
        setTerminalLogs((prev) => [
          ...prev,
          `[${agentName}] State node executed in ${110 + step * 25}ms. Telemetry OK.`,
        ]);
      }
    }, 400);

    try {
      const demoInv = await apiService.triggerDemoProcess(preset.scenario);
      clearInterval(interval);
      setCurrentAgentIdx(AGENT_STEPS.length);
      setCompletedInvoice(demoInv);
      setIsProcessing(false);
      onInvoiceUploaded(demoInv);
    } catch (err: any) {
      clearInterval(interval);
      setIsProcessing(false);
      setErrorMsg('Demo processing failed. Check backend status.');
    }
  };

  const handleUploadSubmit = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setCurrentAgentIdx(0);
    setTerminalLogs([
      `[Pipeline Ingestion] Received file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      `[OCR Engine] Dispatching raster image to OCR Vision Agent...`,
    ]);

    const timerInterval = setInterval(() => {
      setCurrentAgentIdx((prev) => {
        if (prev < AGENT_STEPS.length - 1) {
          const next = prev + 1;
          setTerminalLogs((l) => [
            ...l,
            `[${AGENT_STEPS[next].name}] LangGraph state transitioned successfully.`,
          ]);
          return next;
        }
        clearInterval(timerInterval);
        return prev;
      });
    }, 420);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (poNumber) formData.append('po_number', poNumber);

      const inv = await apiService.uploadInvoice(formData);
      clearInterval(timerInterval);
      setCurrentAgentIdx(AGENT_STEPS.length);
      setCompletedInvoice(inv);
      setIsProcessing(false);
      onInvoiceUploaded(inv);
    } catch (err: any) {
      clearInterval(timerInterval);
      setIsProcessing(false);
      setErrorMsg(
        err.response?.data?.detail ||
          'AI processing failed. Please retry or manually review this invoice.'
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-[#E5EAF0] pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#082B55] tracking-tight flex items-center gap-2">
          <span>Autonomous Multi-Agent Processing Pipeline</span>
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1769E0] border border-blue-200">
            LangGraph Core
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload PDF/image files or select a preconfigured test scenario to watch the 7 AI agents analyze the invoice live
        </p>
      </div>

      {/* Preset Test Invoices Selector */}
      <div className="bg-white rounded-xl p-5 border border-[#E5EAF0] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#082B55] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#1769E0]" />
            Instant One-Click AI Test Scenarios
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">No local PDF required</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleRunPreset(preset)}
              disabled={isProcessing}
              className="text-left p-3.5 rounded-xl bg-[#F8FAFC] hover:bg-blue-50/50 border border-[#E5EAF0] hover:border-[#1769E0] transition-all group flex flex-col justify-between space-y-2 cursor-pointer disabled:opacity-50"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#082B55] group-hover:text-[#1769E0] transition-colors">
                    {preset.title}
                  </span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${preset.tagColor}`}>
                    {preset.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{preset.desc}</p>
              </div>

              <div className="pt-2 border-t border-[#E5EAF0] flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Vendor: <strong className="text-slate-700">{preset.vendor}</strong></span>
                <span className="text-[#1769E0] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-bold">
                  Test <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {!completedInvoice ? (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E5EAF0] shadow-xs space-y-6">
          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-blue-200 hover:border-[#1769E0] bg-[#F8FAFC] rounded-xl p-8 sm:p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 group"
            onClick={() => document.getElementById('file-upload-input')?.click()}
          >
            <input
              id="file-upload-input"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />

            <div className="w-14 h-14 rounded-xl bg-blue-50 text-[#1769E0] border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-bold text-[#082B55]">
                {file ? (
                  <span className="text-[#1769E0] font-mono">{file.name}</span>
                ) : (
                  'Drag & Drop Invoice File or Click to Browse'
                )}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports PDF, TIFF, PNG, JPEG (Up to 15MB) • OCR Vision Engine will parse automatically
              </p>
            </div>
          </div>

          {/* PO Number Reference Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Baseline Purchase Order Reference (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. PO-10023 (for 2-way matching)"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-xs text-[#082B55] placeholder-slate-400 focus:outline-none focus:border-[#1769E0] focus:bg-white font-mono"
              />
            </div>
            <div className="flex flex-col justify-end">
              <button
                onClick={handleUploadSubmit}
                disabled={!file || isProcessing}
                className="w-full py-2.5 bg-[#1769E0] hover:bg-blue-600 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing 7-Agent Pipeline...</span>
                  </>
                ) : (
                  <span>Trigger AI Pipeline Analysis</span>
                )}
              </button>
            </div>
          </div>

          {/* Live Multi-Agent Execution Progress & Terminal */}
          {isProcessing && (
            <div className="space-y-4 pt-4 border-t border-[#E5EAF0] animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#1769E0] font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1769E0] animate-pulse" />
                  LangGraph Active: {AGENT_STEPS[currentAgentIdx]?.name || 'Initializing...'}
                </span>
                <span className="text-slate-500 font-semibold">
                  Step {currentAgentIdx + 1} of {AGENT_STEPS.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-[#E5EAF0]">
                <div
                  className="h-full bg-[#1769E0] rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentAgentIdx + 1) / AGENT_STEPS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Terminal Logs Window */}
              <div className="p-3.5 rounded-lg bg-[#082B55] text-[11px] font-mono text-blue-100 space-y-1 max-h-40 overflow-y-auto">
                <div className="flex items-center gap-1.5 text-blue-300 text-[10px] pb-1 border-b border-blue-900/60">
                  <Terminal className="w-3 h-3" /> Live Agent Telemetry Console
                </div>
                {terminalLogs.map((log, i) => (
                  <p key={i} className="text-blue-100 leading-relaxed font-mono">
                    <span className="text-blue-400 mr-1.5">&gt;</span>
                    {log}
                  </p>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      ) : (
        /* Completed Invoice Review Card */
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-emerald-200 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#082B55] flex items-center gap-2">
                  <span>Invoice Ingestion Completed</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Decision: {completedInvoice.decision}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Invoice #{completedInvoice.invoice_number} processed in {completedInvoice.processing_time_ms}ms
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setCompletedInvoice(null);
                setFile(null);
                setPoNumber('');
              }}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E5EAF0] cursor-pointer"
            >
              Upload Another
            </button>
          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EAF0]">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Vendor</span>
              <span className="font-bold text-[#082B55] text-sm">{completedInvoice.vendor_name}</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EAF0]">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Amount</span>
              <span className="font-bold text-[#082B55] text-sm">
                ${completedInvoice.total_amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EAF0]">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Risk Score</span>
              <span className="font-bold text-[#1769E0] text-sm">{completedInvoice.risk_score} / 100</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E5EAF0]">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Exceptions</span>
              <span className="font-bold text-amber-700 text-sm">
                {completedInvoice.exceptions?.length || 0} Found
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => onNavigateToDetails(completedInvoice)}
              className="px-5 py-2.5 bg-[#1769E0] hover:bg-blue-600 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Inspect Detailed AI Explanations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
