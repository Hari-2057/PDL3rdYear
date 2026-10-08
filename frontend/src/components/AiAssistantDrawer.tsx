import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Building,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { DocumentRow, INITIAL_DOCUMENTS } from './RecentDocumentsTable';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  agentBadge?: string;
  actionDocId?: string;
  policyRef?: string;
}

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDocument?: (doc: DocumentRow) => void;
  onNavigateTab?: (tab: string) => void;
}

const PRESET_QUERIES = [
  'Why was INV-2026-1001 flagged for review?',
  'What is our travel policy expense limit?',
  'Which vendor has the highest exception rate?',
  'Explain the 3-way PO matching tolerance rule',
  'Summarize blocked invoices this month',
];

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onViewDocument,
  onNavigateTab,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello Hari! I'm your **InvoiceAI Financial Operations Copilot**. I have real-time visibility across our multi-agent pipeline, active invoices, corporate policies, and vendor histories.\n\nHow can I assist your team today?",
      timestamp: 'Just now',
      agentBadge: 'Reconciliation & Policy Agent',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate multi-agent synthesis response
    setTimeout(() => {
      const lower = text.toLowerCase();
      let aiResponseText = '';
      let badge = 'Decision Agent';
      let docId: string | undefined = undefined;
      let policy: string | undefined = undefined;

      if (lower.includes('1001') || lower.includes('acme')) {
        badge = 'Reconciliation Agent';
        docId = 'INV-2026-1001';
        aiResponseText =
          `**Document INV-2026-1001** (Acme Supplies, $12,450.00) was flagged with a **PO Mismatch** exception.\n\n` +
          `• **Root Cause:** Line item 3 unit rate is billed at **$420.00**, whereas Purchase Order **PO-90412** specified **$360.00** (a 16.6% escalation).\n` +
          `• **Policy Rule:** Price variance limit is capped at 5.0% without an attached change order.\n` +
          `• **Recommendation:** Route to Accounts Payable manager for approval or request a revised credit memo from Acme Supplies.`;
      } else if (lower.includes('travel') || lower.includes('meal') || lower.includes('receipt') || lower.includes('expense')) {
        badge = 'Policy Agent';
        policy = 'POL-TRV-2024-02';
        aiResponseText =
          `**Corporate Travel & Expense Policy Summary:**\n\n` +
          `• **Individual Meals:** Maximum limit is **$75.00** per meal. Any meal claim above $75 requires an itemized tax invoice attachment (flagged on EXP-2026-0456 by Priya Sharma).\n` +
          `• **Daily Per Diem:** Domestic cap is **$150.00/day**; International cap is **$250.00/day**.\n` +
          `• **Fuel & Mileage:** Auto-approved if scheduled within verified shift hours ($0.67/mile).`;
      } else if (lower.includes('vendor') || lower.includes('highest') || lower.includes('rate')) {
        badge = 'Analytics Agent';
        aiResponseText =
          `**Top Vendors by Flagged Exceptions (October 2026):**\n\n` +
          `1. **Acme Supplies** — **45 exceptions** (Primary issue: unit rate pricing drift on hardware).\n` +
          `2. **Global Tech Ltd** — **32 exceptions** (Primary issue: subtotal tax rounding variances).\n` +
          `3. **BuildRight Co** — **28 exceptions** (Primary issue: volume threshold anomalies).\n` +
          `4. **Euro Services** — **18 exceptions** (Primary issue: foreign exchange rate spreads > 3%).\n\n` +
          `*Recommendation:* Schedule a vendor terms reconciliation review with Acme Supplies procurement lead.`;
      } else if (lower.includes('tolerance') || lower.includes('3-way') || lower.includes('po matching') || lower.includes('match')) {
        badge = 'Reconciliation Agent';
        aiResponseText =
          `**Autonomous 3-Way Match Rules:**\n\n` +
          `1. **Header Tolerance:** Total invoice amount must match PO header within ±0.5% or $5.00 (whichever is lower).\n` +
          `2. **Line-Item Quantity Match:** Invoiced quantity cannot exceed Goods Receipt (GR) confirmed quantity.\n` +
          `3. **Auto-Resolution Rule:** Subtotal rounding discrepancies under $0.05 are auto-cleared per micro-variance policy (applied to INV-2026-1002).`;
      } else if (lower.includes('block') || lower.includes('duplicate') || lower.includes('fraud')) {
        badge = 'Fraud Detection Agent';
        docId = 'INV-2026-0998';
        aiResponseText =
          `**Blocked Documents Overview:**\n\n` +
          `• **24 Documents** currently in Blocked status across the platform.\n` +
          `• **Key Case: INV-2026-0998** ($980.00, OfficeMart) was blocked by the Fraud Detection Agent because its SHA-256 binary hash and invoice number matched an invoice previously paid on September 29, 2026 (Duplicate Invoice prevention).`;
      } else {
        badge = 'Classifier Agent';
        aiResponseText =
          `I analyzed your query: "*${text}*".\n\n` +
          `Our multi-agent system has processed **1,248 documents** this month with **72% auto-resolution** (892 documents) and **256 exceptions** flagged for review.\n\n` +
          `You can ask me specific details about any document ID (e.g. *INV-2026-1001*), vendor trends (*Acme Supplies*), or compliance limits.`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentBadge: badge,
        actionDocId: docId,
        policyRef: policy,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInspectDoc = (id: string) => {
    const found = INITIAL_DOCUMENTS.find((d) => d.id === id);
    if (found && onViewDocument) {
      onViewDocument(found);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      {/* Semi-transparent Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Assistant Drawer (Right Side) */}
      <div className="relative w-full sm:w-[460px] h-full bg-white shadow-2xl z-10 flex flex-col border-l border-[#E5EAF0] animate-slideLeft">
        {/* Header */}
        <div className="px-5 py-4 bg-[#082B55] text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1769E0] text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight font-sans">InvoiceAI Copilot</h3>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-blue-200 mt-0.5">
                Financial Operations & Policy Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'reset',
                    sender: 'ai',
                    text: 'Conversation reset. How can I assist you with invoices, policies or exceptions?',
                    timestamp: 'Just now',
                    agentBadge: 'System',
                  },
                ]);
              }}
              className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Multi-Agent Live Banner */}
        <div className="px-4 py-2 bg-[#0D386B] text-slate-200 text-[10px] flex items-center justify-between font-mono shrink-0 border-t border-blue-900/40">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            6 Autonomous Agents Synchronized
          </span>
          <span className="text-blue-300">Context: Oct 2026 AP Ledger</span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5F8FC]/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-[#082B55] text-[#60A5FA] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-[#1769E0] text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-[#E5EAF0] rounded-bl-xs'
                }`}
              >
                {/* Agent Badge if AI */}
                {msg.sender === 'ai' && msg.agentBadge && (
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1 text-[10px]">
                    <span className="font-mono font-semibold text-[#1769E0] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#1769E0]" />
                      {msg.agentBadge}
                    </span>
                    <span className="text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>
                )}

                {/* Message Body with simple markdown linebreaks & bolding */}
                <div className="leading-relaxed whitespace-pre-wrap font-sans text-[11.5px]">
                  {msg.text.split('\n').map((line, idx) => {
                    const isBullet = line.startsWith('• ') || line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ');
                    return (
                      <p key={idx} className={`${isBullet ? 'pl-2 py-0.5' : 'py-0.5'}`}>
                        {line}
                      </p>
                    );
                  })}
                </div>

                {/* Interactive Action Button in AI message */}
                {msg.actionDocId && (
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => handleInspectDoc(msg.actionDocId!)}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1769E0] font-bold text-[10px] rounded-md transition-colors flex items-center gap-1 border border-blue-200"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Inspect {msg.actionDocId}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {msg.policyRef && onNavigateTab && (
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onNavigateTab('workflows');
                        onClose();
                      }}
                      className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[10px] rounded-md transition-colors flex items-center gap-1 border border-purple-200"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>Configure Policy Rules</span>
                    </button>
                  </div>
                )}

                {/* Footer copy button */}
                {msg.sender === 'ai' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[#1769E0] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-bold text-[10px]">
                  HP
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2.5 items-center">
              <div className="w-7 h-7 rounded-lg bg-[#082B55] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div className="bg-white border border-[#E5EAF0] rounded-2xl px-4 py-2.5 shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1769E0] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#1769E0] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#1769E0] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] text-slate-400 font-mono ml-1.5">Analyzing agents...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Chips */}
        <div className="px-3.5 py-2.5 bg-white border-t border-[#E5EAF0] overflow-x-auto scrollbar-none shrink-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
            Suggested Prompts:
          </p>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {PRESET_QUERIES.map((query) => (
              <button
                key={query}
                onClick={() => handleSend(query)}
                className="px-2.5 py-1 rounded-full bg-[#F5F8FC] hover:bg-blue-50 text-slate-700 hover:text-[#1769E0] border border-[#E5EAF0] text-[10px] font-medium whitespace-nowrap transition-colors shrink-0"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div className="p-3 bg-white border-t border-[#E5EAF0] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about invoices, policies, vendors or exceptions..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-[#F5F8FC] border border-[#E5EAF0] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#1769E0] min-h-[44px]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="min-w-[44px] min-h-[44px] rounded-xl bg-[#1769E0] hover:bg-blue-600 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-1.5 font-mono">
            Powered by InvoiceAI Multi-Agent Synthesis Engine
          </p>
        </div>
      </div>
    </div>
  );
};
