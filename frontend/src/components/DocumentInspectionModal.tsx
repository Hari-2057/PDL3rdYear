import React, { useState } from 'react';
import { DocumentRow } from './RecentDocumentsTable';
import { StatusBadge } from './StatusBadge';
import {
  X, Check, AlertTriangle, FileText, Bot, DollarSign,
  ChevronDown, ChevronUp, ZoomIn, ZoomOut, RotateCw, Download, Maximize2,
  GitCompare, ShieldCheck, History, Sparkles, Building, Layers
} from 'lucide-react';

interface DocumentInspectionModalProps {
  document: DocumentRow | null;
  onClose: () => void;
  onApprove: (doc: DocumentRow) => void;
  onReject: (doc: DocumentRow) => void;
}

export const DocumentInspectionModal: React.FC<DocumentInspectionModalProps> = ({
  document,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!document) return null;

  // Zoom and rotation state for invoice preview
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mobile Accordion open/close states
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    exception: true,
    fields: true,
    agents: true,
    reconciliation: false,
    resolution: false,
    history: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-hidden">
      <div className={`bg-white border border-[#E5EAF0] sm:rounded-2xl w-full ${isFullscreen ? 'h-full max-w-full rounded-none' : 'max-w-6xl h-full sm:h-[90vh]'} shadow-2xl flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-[#E5EAF0] flex items-center justify-between bg-[#F5F8FC]/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#082B55] text-white flex items-center justify-center font-bold text-xs shrink-0">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#082B55] font-mono truncate">{document.id}</h3>
                <StatusBadge status={document.status} size="sm" />
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Vendor: <strong className="text-slate-800">{document.vendor}</strong> • {document.type} • {document.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden sm:flex min-w-[36px] min-h-[36px] items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Amount & Exception Highlight Strip */}
        <div className="px-4 sm:px-6 py-2.5 bg-blue-50/60 border-b border-blue-100 flex flex-wrap items-center justify-between text-xs font-medium gap-2 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span>
              Total: <strong className="font-mono text-[#082B55] text-sm font-bold">${document.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span>
              Exception: <strong className="text-amber-700 font-bold">{document.exception}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold text-slate-600 bg-white border border-blue-200 px-2 py-0.5 rounded">
              {document.confidence}% AI Confidence
            </span>
            {document.poNumber && (
              <span className="text-[11px] font-mono text-slate-600 bg-white border border-blue-200 px-2 py-0.5 rounded hidden sm:inline">
                PO: {document.poNumber}
              </span>
            )}
          </div>
        </div>

        {/* Content Area: Responsive across Desktop (side-by-side), Tablet (stacked), Mobile (accordion) */}
        <div className="flex-1 overflow-y-auto">
          {/* DESKTOP (lg+) & TABLET (md): Multi-Column Layout */}
          <div className="hidden md:grid md:grid-cols-12 gap-0 h-full">
            {/* Left Column (5 cols): Interactive Invoice Preview */}
            <div className="md:col-span-5 border-r border-[#E5EAF0] bg-slate-100/60 flex flex-col">
              {/* Preview Toolbar */}
              <div className="p-2 border-b border-[#E5EAF0] bg-white flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-slate-700 font-mono">Invoice Document Scan</span>
                <div className="flex items-center gap-1">
                  <button onClick={handleZoomOut} className="p-1.5 rounded hover:bg-slate-100 text-slate-600" title="Zoom Out">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-mono px-1">{zoom}%</span>
                  <button onClick={handleZoomIn} className="p-1.5 rounded hover:bg-slate-100 text-slate-600" title="Zoom In">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button onClick={handleRotate} className="p-1.5 rounded hover:bg-slate-100 text-slate-600" title="Rotate">
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-slate-100 text-slate-600" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Invoice Preview Viewport */}
              <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
                <div
                  className="bg-white rounded-lg shadow-md border border-slate-300 p-6 text-slate-800 transition-transform origin-center max-w-sm w-full"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  }}
                >
                  <div className="border-b pb-3 mb-3 flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-xs text-[#082B55]">{document.vendor}</h4>
                      <p className="text-[9px] text-slate-400">INVOICE #{document.id}</p>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">{document.date}</span>
                  </div>
                  <div className="space-y-1.5 text-[10px] font-mono">
                    <div className="flex justify-between py-1 border-b border-dashed">
                      <span>Enterprise Software License</span>
                      <span className="font-bold">${(document.amount * 0.7).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-dashed">
                      <span>Advisory Consulting Services</span>
                      <span className="font-bold">${(document.amount * 0.3).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 font-bold text-xs">
                      <span>Total Amount:</span>
                      <span className="text-[#1769E0]">${document.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (7 cols): Exception Details, Extracted Fields, AI Findings */}
            <div className="md:col-span-7 p-6 overflow-y-auto space-y-5">
              {/* Exception Details & Findings */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Flagged Exception: {document.exception}</span>
                </div>
                <p className="text-xs text-amber-950 font-normal leading-relaxed">
                  {document.agentNotes || 'Reconciliation agent detected a pricing discrepancy exceeding configured tolerance limit.'}
                </p>
              </div>

              {/* Extracted Fields Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#082B55] font-mono">Extracted Fields</h4>
                <div className="border border-[#E5EAF0] rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#F5F8FC] text-[10px] font-mono font-semibold text-slate-500 uppercase border-b border-[#E5EAF0]">
                      <tr>
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-3">Qty</th>
                        <th className="py-2.5 px-3">Unit Price</th>
                        <th className="py-2.5 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-xs">
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-slate-800">Core Subscription Service</td>
                        <td className="py-2.5 px-3">1</td>
                        <td className="py-2.5 px-3">${(document.amount * 0.7).toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-bold">${(document.amount * 0.7).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-slate-800">Support & Maintenance SLA</td>
                        <td className="py-2.5 px-3">1</td>
                        <td className="py-2.5 px-3">${(document.amount * 0.3).toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-bold">${(document.amount * 0.3).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Agent Step Findings */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#082B55] font-mono">AI Agent Verification Chain</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg border border-[#E5EAF0] bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-slate-800">Extraction Agent</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">12 fields extracted (99.1% accuracy)</span>
                  </div>
                  <div className="p-3 rounded-lg border border-[#E5EAF0] bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-slate-800">Reconciliation Agent</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {document.poNumber ? `Matched to ${document.poNumber}` : 'Direct invoice (non-PO)'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-[#E5EAF0] bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-slate-800">Policy Agent</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">Corporate tolerance rule $100 checked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE (< md): Accordion Structure (Invoice Preview first, then sequential sections) */}
          <div className="md:hidden p-4 space-y-4">
            {/* 1. Mobile Invoice Preview First with Toolbar */}
            <div className="border border-[#E5EAF0] rounded-xl overflow-hidden bg-slate-50">
              <div className="p-2.5 bg-white border-b border-[#E5EAF0] flex items-center justify-between">
                <span className="text-xs font-bold text-[#082B55]">Invoice Preview</span>
                <div className="flex items-center gap-1">
                  <button onClick={handleZoomOut} className="p-2 rounded bg-slate-50 text-slate-700 min-h-[36px] min-w-[36px] flex items-center justify-center">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button onClick={handleZoomIn} className="p-2 rounded bg-slate-50 text-slate-700 min-h-[36px] min-w-[36px] flex items-center justify-center">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button onClick={handleRotate} className="p-2 rounded bg-slate-50 text-slate-700 min-h-[36px] min-w-[36px] flex items-center justify-center">
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded bg-slate-50 text-slate-700 min-h-[36px] min-w-[36px] flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile Preview Viewport */}
              <div className="p-4 flex items-center justify-center overflow-auto max-h-56">
                <div
                  className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 text-slate-800 w-full"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  }}
                >
                  <div className="border-b pb-2 mb-2 flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-xs text-[#082B55]">{document.vendor}</h4>
                      <p className="text-[9px] text-slate-400">#{document.id}</p>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">{document.date}</span>
                  </div>
                  <div className="flex justify-between pt-1 font-bold text-xs">
                    <span>Total Amount:</span>
                    <span className="text-[#1769E0] font-mono">${document.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Exception Details Accordion */}
            <div className="border border-[#E5EAF0] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => toggleSection('exception')}
                className="w-full min-h-[44px] px-4 py-3 flex items-center justify-between text-left font-bold text-xs text-[#082B55] bg-slate-50/70"
              >
                <span>Exception Details</span>
                {openSections.exception ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSections.exception && (
                <div className="p-4 text-xs space-y-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-amber-700 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{document.exception}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {document.agentNotes || 'Discrepancy flagged by validation agents. Manual sign-off required before disbursement.'}
                  </p>
                </div>
              )}
            </div>

            {/* 3. Extracted Fields Accordion */}
            <div className="border border-[#E5EAF0] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => toggleSection('fields')}
                className="w-full min-h-[44px] px-4 py-3 flex items-center justify-between text-left font-bold text-xs text-[#082B55] bg-slate-50/70"
              >
                <span>Extracted Fields</span>
                {openSections.fields ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSections.fields && (
                <div className="p-4 text-xs space-y-2 border-t border-slate-100">
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-sans">Vendor</span>
                      <span className="font-semibold text-slate-800">{document.vendor}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-sans">Amount</span>
                      <span className="font-bold text-[#082B55]">${document.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-sans">PO Reference</span>
                      <span className="text-slate-700">{document.poNumber || 'None'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. AI Agent Findings Accordion */}
            <div className="border border-[#E5EAF0] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => toggleSection('agents')}
                className="w-full min-h-[44px] px-4 py-3 flex items-center justify-between text-left font-bold text-xs text-[#082B55] bg-slate-50/70"
              >
                <span>AI Agent Findings</span>
                {openSections.agents ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSections.agents && (
                <div className="p-4 text-xs space-y-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold">Extraction Agent: 99% accuracy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold">Reconciliation Agent: PO Matched</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-semibold">Exception Detector: Flagged item</span>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Reconciliation Accordion */}
            <div className="border border-[#E5EAF0] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => toggleSection('reconciliation')}
                className="w-full min-h-[44px] px-4 py-3 flex items-center justify-between text-left font-bold text-xs text-[#082B55] bg-slate-50/70"
              >
                <span>Reconciliation & 3-Way Match</span>
                {openSections.reconciliation ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSections.reconciliation && (
                <div className="p-4 text-xs space-y-2 border-t border-slate-100">
                  <p className="text-slate-600 text-[11px]">
                    PO #{document.poNumber || 'PO-90412'} was matched to Goods Receipt #GR-1029. Variance detected on line item rate.
                  </p>
                </div>
              )}
            </div>

            {/* 6. Suggested Resolution Accordion */}
            <div className="border border-[#E5EAF0] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => toggleSection('resolution')}
                className="w-full min-h-[44px] px-4 py-3 flex items-center justify-between text-left font-bold text-xs text-[#082B55] bg-slate-50/70"
              >
                <span>Suggested Resolution</span>
                {openSections.resolution ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSections.resolution && (
                <div className="p-4 text-xs space-y-2 border-t border-slate-100">
                  <p className="text-slate-600 text-[11px]">
                    Accept variance under master vendor renegotiation clause or request revised credit memo from supplier.
                  </p>
                </div>
              )}
            </div>

            {/* 7. Review History Accordion */}
            <div className="border border-[#E5EAF0] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => toggleSection('history')}
                className="w-full min-h-[44px] px-4 py-3 flex items-center justify-between text-left font-bold text-xs text-[#082B55] bg-slate-50/70"
              >
                <span>Review History & Audit</span>
                {openSections.history ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSections.history && (
                <div className="p-4 text-xs space-y-2 border-t border-slate-100 font-mono text-[10px]">
                  <div>Ingested: {document.date} 09:14 UTC</div>
                  <div>Checksum: SHA-256 Verified</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STICKY BOTTOM ACTIONS: [Reject] [Approve Resolution] (minimum 44px touch height) */}
        <div className="sticky bottom-0 z-10 px-4 sm:px-6 py-3 border-t border-[#E5EAF0] bg-white flex items-center justify-between gap-3 shadow-lg">
          <button
            onClick={onClose}
            className="min-h-[44px] px-4 text-slate-600 hover:text-slate-900 font-semibold text-xs rounded-lg transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onReject(document)}
              className="min-h-[44px] px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => onApprove(document)}
              className="min-h-[44px] px-5 py-2 bg-[#1769E0] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
            >
              Approve Resolution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
