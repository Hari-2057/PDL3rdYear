import React, { useState } from 'react';
import {
  Inbox,
  Mail,
  UploadCloud,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  Trash2,
  FileCheck,
  Cpu,
  Layers,
} from 'lucide-react';
import { DocumentRow } from '../components/RecentDocumentsTable';

interface IntakeItem {
  id: string;
  fileName: string;
  channel: 'Email' | 'Portal' | 'ERP' | 'Mobile Scan';
  sender: string;
  vendorParsed: string;
  amountExtracted: number;
  stage: 'OCR Ingestion' | 'Extraction Complete' | 'Duplicate Quarantine' | 'Classification Pending' | 'Ready for Triage';
  stageColor: string;
  confidence: number;
  receivedAt: string;
  fileSize: string;
}

const INTAKE_ITEMS: IntakeItem[] = [
  {
    id: 'DOC-IN-9081',
    fileName: 'invoice_acme_oct8.pdf',
    channel: 'Email',
    sender: 'billing@acme.com',
    vendorParsed: 'Acme Supplies',
    amountExtracted: 12450.0,
    stage: 'Ready for Triage',
    stageColor: 'bg-blue-50 text-[#1769E0] border-blue-200',
    confidence: 78,
    receivedAt: 'Today, 14:22',
    fileSize: '1.2 MB',
  },
  {
    id: 'DOC-IN-9080',
    fileName: 'scan_receipt_priya.jpeg',
    channel: 'Mobile Scan',
    sender: 'priya.sharma@internal.corp',
    vendorParsed: 'Priya Sharma (Meal)',
    amountExtracted: 125.0,
    stage: 'OCR Ingestion',
    stageColor: 'bg-amber-50 text-amber-700 border-amber-200',
    confidence: 65,
    receivedAt: 'Today, 13:45',
    fileSize: '3.4 MB',
  },
  {
    id: 'DOC-IN-9079',
    fileName: 'eu_inv_5760.pdf',
    channel: 'Email',
    sender: 'invoices@euroservices.de',
    vendorParsed: 'Euro Services',
    amountExtracted: 5760.0,
    stage: 'Classification Pending',
    stageColor: 'bg-purple-50 text-purple-700 border-purple-200',
    confidence: 72,
    receivedAt: 'Today, 11:10',
    fileSize: '840 KB',
  },
  {
    id: 'DOC-IN-9078',
    fileName: 'officemart_reorder.pdf',
    channel: 'Portal',
    sender: 'ap-portal@internal.corp',
    vendorParsed: 'OfficeMart',
    amountExtracted: 980.0,
    stage: 'Duplicate Quarantine',
    stageColor: 'bg-rose-50 text-rose-700 border-rose-200',
    confidence: 99,
    receivedAt: 'Today, 09:30',
    fileSize: '450 KB',
  },
  {
    id: 'DOC-IN-9077',
    fileName: 'gt_oct_bill.pdf',
    channel: 'ERP',
    sender: 'netsuite-sync@oracle.cloud',
    vendorParsed: 'Global Tech Ltd',
    amountExtracted: 3200.0,
    stage: 'Extraction Complete',
    stageColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    confidence: 96,
    receivedAt: 'Today, 08:15',
    fileSize: '1.8 MB',
  },
  {
    id: 'DOC-IN-9076',
    fileName: 'buildright_heavy_supplies.pdf',
    channel: 'Email',
    sender: 'ap@buildright.com',
    vendorParsed: 'BuildRight Co',
    amountExtracted: 22300.0,
    stage: 'Ready for Triage',
    stageColor: 'bg-blue-50 text-[#1769E0] border-blue-200',
    confidence: 61,
    receivedAt: 'Yesterday, 18:40',
    fileSize: '2.1 MB',
  },
  {
    id: 'DOC-IN-9075',
    fileName: 'travel_uber_receipt.png',
    channel: 'Email',
    sender: 'receipts@uber.com',
    vendorParsed: 'TravelPlus',
    amountExtracted: 1200.0,
    stage: 'Classification Pending',
    stageColor: 'bg-purple-50 text-purple-700 border-purple-200',
    confidence: 70,
    receivedAt: 'Yesterday, 16:20',
    fileSize: '512 KB',
  },
  {
    id: 'DOC-IN-9074',
    fileName: 'mehta_fuel_claim.pdf',
    channel: 'Mobile Scan',
    sender: 'rahul.mehta@internal.corp',
    vendorParsed: 'Rahul Mehta (Fuel)',
    amountExtracted: 48.0,
    stage: 'Extraction Complete',
    stageColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    confidence: 94,
    receivedAt: 'Yesterday, 14:05',
    fileSize: '1.1 MB',
  },
  {
    id: 'DOC-IN-9073',
    fileName: 'cloud_infra_aws_inv.pdf',
    channel: 'ERP',
    sender: 'aws-billing-api@aws.amazon.com',
    vendorParsed: 'Amazon Web Services',
    amountExtracted: 4850.0,
    stage: 'Extraction Complete',
    stageColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    confidence: 98,
    receivedAt: 'Yesterday, 12:30',
    fileSize: '790 KB',
  },
  {
    id: 'DOC-IN-9072',
    fileName: 'consulting_advisory_q3.pdf',
    channel: 'Email',
    sender: 'finance@deloitte.com',
    vendorParsed: 'Advisory Partners',
    amountExtracted: 15000.0,
    stage: 'Ready for Triage',
    stageColor: 'bg-blue-50 text-[#1769E0] border-blue-200',
    confidence: 85,
    receivedAt: 'Oct 6, 10:15',
    fileSize: '3.1 MB',
  },
  {
    id: 'DOC-IN-9071',
    fileName: 'logistics_freight_bill.pdf',
    channel: 'ERP',
    sender: 'edi-gateway@swift.com',
    vendorParsed: 'Swift Freight Lines',
    amountExtracted: 2780.0,
    stage: 'OCR Ingestion',
    stageColor: 'bg-amber-50 text-amber-700 border-amber-200',
    confidence: 79,
    receivedAt: 'Oct 6, 09:00',
    fileSize: '950 KB',
  },
  {
    id: 'DOC-IN-9070',
    fileName: 'hardware_monitors_dell.pdf',
    channel: 'Portal',
    sender: 'it-purchasing@internal.corp',
    vendorParsed: 'Dell Technologies',
    amountExtracted: 6120.0,
    stage: 'Ready for Triage',
    stageColor: 'bg-blue-50 text-[#1769E0] border-blue-200',
    confidence: 91,
    receivedAt: 'Oct 6, 07:45',
    fileSize: '1.4 MB',
  },
];

interface InboxPageProps {
  onSelectDocument: (doc: DocumentRow) => void;
  onNavigateUpload: () => void;
}

export const InboxPage: React.FC<InboxPageProps> = ({
  onSelectDocument,
  onNavigateUpload,
}) => {
  const [channelFilter, setChannelFilter] = useState<'All' | 'Email' | 'Portal' | 'ERP' | 'Mobile Scan'>('All');
  const [search, setSearch] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const filteredItems = INTAKE_ITEMS.filter((item) => {
    if (channelFilter !== 'All' && item.channel !== channelFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.fileName.toLowerCase().includes(q) ||
        item.vendorParsed.toLowerCase().includes(q) ||
        item.sender.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyInboundEmail = () => {
    navigator.clipboard.writeText('invoices@company.invoiceai.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAF0] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1769E0] text-white flex items-center justify-center shadow-xs">
              <Inbox className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-[#082B55] tracking-tight font-sans">
              Document Intake Inbox
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500 text-white shadow-2xs">
              12 Unprocessed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Incoming multi-channel document pipeline: OCR extraction, quarantine checks, and auto-triage stream.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={onNavigateUpload}
            className="min-h-[40px] px-3.5 py-2 bg-[#1769E0] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Documents</span>
          </button>
        </div>
      </div>

      {/* 4 Ingestion Pipeline Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E5EAF0] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Unprocessed Intake
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-[#082B55]">12</span>
            <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
              Needs Triage
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Avg time to ingest: ~2.4m</p>
        </div>

        <div className="bg-white border border-[#E5EAF0] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            OCR Parsing Active
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-amber-600">3</span>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
              Running
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Computer vision OCR</p>
        </div>

        <div className="bg-white border border-[#E5EAF0] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Extraction Complete
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-600">5</span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              Auto-Passed
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">98.4% mean accuracy</p>
        </div>

        <div className="bg-white border border-[#E5EAF0] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Quarantine / Flagged
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-rose-600">4</span>
            <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
              Anomaly
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Duplicate or unreadable</p>
        </div>
      </div>

      {/* Inbound Email Gateway Banner */}
      <div className="bg-gradient-to-r from-blue-50/90 via-white to-blue-50/60 border border-[#BFDBFE] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1769E0] flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[#082B55] text-xs">
              Direct Vendor Forwarding Address: <code className="bg-white px-2 py-0.5 rounded border border-blue-200 text-[#1769E0] font-mono font-bold">invoices@company.invoiceai.com</code>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Suppliers can email PDF attachments directly. The Extraction Agent parses header and line items within seconds.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyInboundEmail}
          className="min-h-[36px] px-3 py-1.5 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 text-[#1769E0] font-bold text-[11px] transition-colors flex items-center gap-1.5 shrink-0 self-start md:self-auto"
        >
          {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Inbound Email'}</span>
        </button>
      </div>

      {/* Controls: Channel Tabs + Search */}
      <div className="bg-white border border-[#E5EAF0] rounded-xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Channel filter pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['All', 'Email', 'Portal', 'ERP', 'Mobile Scan'] as const).map((ch) => (
            <button
              key={ch}
              onClick={() => setChannelFilter(ch)}
              className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                channelFilter === ch
                  ? 'bg-[#082B55] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {ch === 'All' ? 'All Channels (12)' : ch}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search intake files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#F5F8FC] border border-[#E5EAF0] rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#1769E0] min-h-[36px]"
          />
        </div>
      </div>

      {/* Intake Ledger Table */}
      <div className="bg-white border border-[#E5EAF0] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F5F8FC] text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Intake ID</th>
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-4">Channel & Origin</th>
                <th className="py-3 px-4">Parsed Vendor</th>
                <th className="py-3 px-4">Extracted Total</th>
                <th className="py-3 px-4">Agent Pipeline Status</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#F5F8FC]/80 transition-colors group cursor-pointer"
                  onClick={() =>
                    onSelectDocument({
                      id: item.id,
                      vendor: item.vendorParsed,
                      type: item.fileName.includes('receipt') ? 'Expense' : 'Invoice',
                      amount: item.amountExtracted,
                      exception: item.stage === 'Duplicate Quarantine' ? 'Duplicate invoice' : 'PO mismatch',
                      status: item.stage === 'Extraction Complete' ? 'Auto-resolved' : 'Pending Review',
                      confidence: item.confidence,
                      date: 'Oct 8, 2026',
                    })
                  }
                >
                  {/* Intake ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1769E0]">
                    {item.id}
                  </td>

                  {/* File Name & Size */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-800 block truncate max-w-[180px]">
                          {item.fileName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.fileSize}</span>
                      </div>
                    </div>
                  </td>

                  {/* Channel & Origin */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {item.channel}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]">{item.sender}</p>
                    </div>
                  </td>

                  {/* Parsed Vendor */}
                  <td className="py-3.5 px-4 font-semibold text-[#082B55]">
                    {item.vendorParsed}
                  </td>

                  {/* Extracted Amount */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ${item.amountExtracted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Pipeline Stage */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border inline-flex items-center gap-1.5 ${item.stageColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {item.stage}
                    </span>
                  </td>

                  {/* Confidence */}
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.confidence >= 90 ? 'bg-emerald-500' : item.confidence >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${item.confidence}%` }}
                        />
                      </div>
                      <span className="text-slate-600 font-bold">{item.confidence}%</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDocument({
                          id: item.id,
                          vendor: item.vendorParsed,
                          type: item.fileName.includes('receipt') ? 'Expense' : 'Invoice',
                          amount: item.amountExtracted,
                          exception: item.stage === 'Duplicate Quarantine' ? 'Duplicate invoice' : 'PO mismatch',
                          status: item.stage === 'Extraction Complete' ? 'Auto-resolved' : 'Pending Review',
                          confidence: item.confidence,
                          date: 'Oct 8, 2026',
                        });
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-[#1769E0] hover:text-white hover:bg-[#1769E0] border border-[#1769E0]/30 rounded-md transition-colors"
                    >
                      Triage →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <span>Showing 12 intake documents awaiting pipeline routing</span>
          <span className="font-mono">Auto-sync: Every 30s</span>
        </div>
      </div>
    </div>
  );
};
