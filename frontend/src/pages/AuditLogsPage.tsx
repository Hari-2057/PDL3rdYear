import React, { useState } from 'react';
import { AuditLog } from '../types';
import { Search, Filter, User, Terminal } from 'lucide-react';

interface AuditLogsPageProps {
  logs: AuditLog[];
}

export const AuditLogsPage: React.FC<AuditLogsPageProps> = ({ logs = [] }) => {
  const [actorFilter, setActorFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter((log) => {
    if (actorFilter !== 'All' && !log.actor.toLowerCase().includes(actorFilter.toLowerCase())) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.action?.toLowerCase().includes(q) ||
        log.details?.toLowerCase().includes(q) ||
        log.invoice_number?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-[#E5EAF0] pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#082B55] tracking-tight flex items-center gap-2.5">
          <span>Immutable Governance & Audit Ledger</span>
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1769E0] border border-blue-200">
            {logs.length} Audit Events
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Cryptographically timestamped trail of autonomous agent handoffs and human sign-off overrides
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-[#E5EAF0] p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, details, invoice #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg text-xs text-[#082B55] placeholder-slate-400 focus:outline-none focus:border-[#1769E0] focus:bg-white font-sans"
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5 text-[#1769E0]" /> Actor Filter:
          </span>
          <select
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
            className="bg-[#F8FAFC] border border-[#E5EAF0] text-slate-700 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-[#1769E0]"
          >
            <option value="All">All Entities</option>
            <option value="Agent">AI Agents Only</option>
            <option value="Reviewer">Human Reviewers Only</option>
            <option value="Admin">Admin Actions</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAF0] text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-sans">
              {filteredLogs.map((log) => {
                const isAgent = log.actor.toLowerCase().includes('agent');
                return (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          isAgent
                            ? 'bg-blue-50 text-[#1769E0] border-blue-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {isAgent ? <Terminal className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {log.actor}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#082B55]">{log.action}</td>
                    <td className="py-3.5 px-4 text-[#1769E0] font-semibold font-mono">{log.invoice_number || '—'}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-md truncate">{log.details}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
