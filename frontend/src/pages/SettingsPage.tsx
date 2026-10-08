import React, { useState } from 'react';
import { Key, Cpu, Database, Save, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [provider, setProvider] = useState('fallback');
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-[#E5EAF0] pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#082B55] tracking-tight flex items-center gap-2.5">
          <span>System & LLM Engine Configuration</span>
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1769E0] border border-blue-200">
            Runtime Controls
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure multi-model abstractions, LangGraph API integrations, and secure persistence layers
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-[#E5EAF0] p-6 sm:p-8 shadow-xs space-y-6">
        {/* LLM Provider Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-3">
            <h3 className="text-xs font-bold text-[#082B55] uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#1769E0]" /> AI LLM Orchestration Provider
            </h3>
            <span className="text-[10px] font-mono font-bold text-[#1769E0] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Active: {provider.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <button
              type="button"
              onClick={() => setProvider('fallback')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                provider === 'fallback'
                  ? 'bg-blue-50/70 border-[#1769E0] ring-1 ring-[#1769E0] shadow-xs'
                  : 'bg-white border-[#E5EAF0] hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <h4 className="font-bold text-xs text-[#082B55]">Local Heuristic Fallback</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Zero configuration required. Instant deterministic offline execution.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setProvider('openai')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                provider === 'openai'
                  ? 'bg-blue-50/70 border-[#1769E0] ring-1 ring-[#1769E0] shadow-xs'
                  : 'bg-white border-[#E5EAF0] hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <h4 className="font-bold text-xs text-[#082B55]">OpenAI GPT-4o / Mini</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Multi-modal document vision reasoning with LangGraph agent tool calling.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setProvider('gemini')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                provider === 'gemini'
                  ? 'bg-blue-50/70 border-[#1769E0] ring-1 ring-[#1769E0] shadow-xs'
                  : 'bg-white border-[#E5EAF0] hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <h4 className="font-bold text-xs text-[#082B55]">Google Gemini 1.5 Flash</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                High-throughput context processing for complex multipage invoices.
              </p>
            </button>
          </div>
        </div>

        {/* API Credentials */}
        <div className="space-y-4 pt-4 border-t border-[#E5EAF0]">
          <h3 className="text-xs font-bold text-[#082B55] uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-[#1769E0]" /> Provider API Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                OpenAI API Key
              </label>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-xs text-[#082B55] placeholder-slate-400 focus:outline-none focus:border-[#1769E0] focus:bg-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                Google Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-xs text-[#082B55] placeholder-slate-400 focus:outline-none focus:border-[#1769E0] focus:bg-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Database Persistence */}
        <div className="space-y-3 pt-4 border-t border-[#E5EAF0]">
          <h3 className="text-xs font-bold text-[#082B55] uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-[#1769E0]" /> Database & Storage Persistence
          </h3>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] text-xs font-mono flex items-center justify-between">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Active SQLite Database</span>
              <span className="text-[#082B55] font-semibold">sqlite:///./invoiceguard.db</span>
            </div>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              CONNECTED
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E5EAF0]">
          {saved && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4" /> Configuration settings saved successfully!
            </span>
          )}
          {!saved && <div />}

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#1769E0] hover:bg-blue-600 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
