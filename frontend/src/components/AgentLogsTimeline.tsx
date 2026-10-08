import React from 'react';
import { AgentExecution } from '../types';
import { Clock, Terminal } from 'lucide-react';

interface AgentLogsTimelineProps {
  logs?: AgentExecution[];
}

export const AgentLogsTimeline: React.FC<AgentLogsTimelineProps> = ({ logs = [] }) => {
  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#E5EAF0] shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-3">
        <h3 className="text-xs font-bold text-[#082B55] uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#1769E0]" />
          LangGraph Agent Execution Audit Trail
        </h3>
        <span className="text-[10px] font-mono font-bold text-[#1769E0] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          {logs.length} Nodes Recorded
        </span>
      </div>

      <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
        {logs.map((log, idx) => {
          const timeStr = log.executed_at
            ? new Date(log.executed_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
            : `14:32:0${idx + 1}`;

          const isSuccess = log.status === 'SUCCESS';
          const isWarning = log.status === 'WARNING';

          return (
            <div key={idx} className="relative flex items-start gap-4 pl-8 group">
              {/* Timeline Bullet */}
              <div
                className={`absolute left-1.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                  isSuccess
                    ? 'border-emerald-500 text-emerald-600'
                    : isWarning
                    ? 'border-amber-500 text-amber-600'
                    : 'border-rose-500 text-rose-600'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              </div>

              {/* Log Card */}
              <div className="flex-1 bg-[#F8FAFC] p-3 rounded-lg border border-[#E5EAF0] hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">{timeStr}</span>
                    <span className="text-xs font-bold text-[#082B55] font-mono">{log.agent_name}</span>
                    <span
                      className={`text-[9px] px-2 py-0.2 rounded-full font-mono font-bold uppercase border ${
                        isSuccess
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isWarning
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    {log.input_summary || log.error_message || 'Node execution completed.'}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-mono text-[#1769E0] shrink-0 self-end sm:self-center bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  <Clock className="w-3 h-3" />
                  <span>{log.execution_time_ms}ms</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
