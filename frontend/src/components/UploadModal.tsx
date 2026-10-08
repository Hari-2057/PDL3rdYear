import React, { useState } from 'react';
import { X, Upload, FileText, Check, Sparkles, ArrowRight } from 'lucide-react';
import { DocumentRow } from './RecentDocumentsTable';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDoc: DocumentRow) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  if (!isOpen) return null;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [poNumber, setPoNumber] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const samplePresets = [
    {
      vendor: 'Stripe Payments Inc',
      amount: 4850.0,
      exception: 'None (Clean Match)',
      po: 'PO-94103',
      type: 'Invoice' as const,
      status: 'Auto-resolved' as const,
      confidence: 98,
    },
    {
      vendor: 'DataDog Cloud Telemetry',
      amount: 14200.0,
      exception: 'PO mismatch',
      po: 'PO-88210',
      type: 'Invoice' as const,
      status: 'Pending Review' as const,
      confidence: 81,
    },
  ];

  const handleRunPreset = (preset: typeof samplePresets[0]) => {
    setIsUploading(true);
    setTimeout(() => {
      const newDoc: DocumentRow = {
        id: `INV-2026-${Math.floor(1005 + Math.random() * 50)}`,
        vendor: preset.vendor,
        type: preset.type,
        amount: preset.amount,
        exception: preset.exception,
        status: preset.status,
        confidence: preset.confidence,
        date: 'Oct 8, 2026',
        poNumber: preset.po,
        lineItemsCount: 3,
        agentNotes: 'Simulated multi-agent extraction and rule solver evaluation completed.',
      };
      onUploadSuccess(newDoc);
      setIsUploading(false);
      onClose();
    }, 600);
  };

  const handleManualUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setTimeout(() => {
      const newDoc: DocumentRow = {
        id: `INV-2026-${Math.floor(1020 + Math.random() * 50)}`,
        vendor: selectedFile.name.replace(/\.[^/.]+$/, ''),
        type: 'Invoice',
        amount: 8750.0,
        exception: poNumber ? 'PO mismatch' : 'Missing PO',
        status: 'Pending Review',
        confidence: 84,
        date: 'Oct 8, 2026',
        poNumber: poNumber || undefined,
        lineItemsCount: 2,
        agentNotes: 'OCR Vision Agent completed text extraction. Awaiting review.',
      };
      onUploadSuccess(newDoc);
      setIsUploading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full shadow-2xl p-6 space-y-4 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Upload Document / Invoice</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Invoices */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Instant Test Presets (No file needed):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {samplePresets.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleRunPreset(p)}
                disabled={isUploading}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all text-xs space-y-1"
              >
                <div className="flex justify-between font-bold text-slate-800">
                  <span className="truncate">{p.vendor}</span>
                  <span className="font-mono text-blue-700">${p.amount}</span>
                </div>
                <p className="text-[10px] text-slate-500">{p.exception}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Drag & Drop File Zone */}
        <form onSubmit={handleManualUpload} className="space-y-3 pt-2 border-t border-slate-100">
          <div
            onClick={() => document.getElementById('manual-file-input')?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-lg p-6 text-center cursor-pointer transition-colors bg-slate-50/60"
          >
            <input
              id="manual-file-input"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
            />
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">
              {selectedFile ? selectedFile.name : 'Click to select PDF or image invoice'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, TIFF, PNG up to 15MB</p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              PO Reference Number (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. PO-90412"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-slate-600 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-xs"
            >
              {isUploading ? 'Dispatching to Agents...' : 'Ingest Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
