import React from 'react';
import { AnalyticsResponse } from '../types';
import { DollarSign, Activity } from 'lucide-react';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface AnalyticsPageProps {
  analytics: AnalyticsResponse | null;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ analytics }) => {
  const kpis = analytics?.kpis || {
    total_invoices: 1245,
    processed_today: 42,
    auto_approved: 982,
    human_review: 183,
    rejected: 80,
    exception_rate: 14.7,
    avg_processing_time_sec: 0.8,
    total_invoice_value: 12450000.0,
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-[#E5EAF0] pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#082B55] tracking-tight flex items-center gap-2.5">
          <span>Financial & Operational Telemetry</span>
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Real-Time Analytics
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Deep telemetry across AP cash-flow velocity, vendor spend density, and multi-agent latency
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-xs hover:border-slate-300 transition-all">
          <span className="text-[11px] text-slate-500 block font-semibold uppercase tracking-wider">
            Total AP Outlay
          </span>
          <span className="text-2xl font-bold text-[#082B55] font-mono mt-2 block">
            ${(kpis.total_invoice_value / 1000).toFixed(1)}k
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Verified accounts payable
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-xs hover:border-slate-300 transition-all">
          <span className="text-[11px] text-slate-500 block font-semibold uppercase tracking-wider">
            Auto-Settlement Rate
          </span>
          <span className="text-2xl font-bold text-[#1769E0] font-mono mt-2 block">
            {((kpis.auto_approved / kpis.total_invoices) * 100).toFixed(1)}%
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Zero-touch clearance
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-xs hover:border-slate-300 transition-all">
          <span className="text-[11px] text-slate-500 block font-semibold uppercase tracking-wider">
            Exception Rate
          </span>
          <span className="text-2xl font-bold text-amber-700 font-mono mt-2 block">
            {kpis.exception_rate}%
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Policy & PO variances
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-xs hover:border-slate-300 transition-all">
          <span className="text-[11px] text-slate-500 block font-semibold uppercase tracking-wider">
            End-To-End Latency
          </span>
          <span className="text-2xl font-bold text-indigo-700 font-mono mt-2 block">
            {kpis.avg_processing_time_sec}s
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            7-Agent LangGraph pipeline
          </span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Vendor Spending Breakdown */}
        <div className="bg-white rounded-xl border border-[#E5EAF0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#082B55] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#1769E0]" />
              Vendor Expenditure Aggregation ($k)
            </h3>
            <span className="text-xs font-semibold text-[#1769E0]">Top 5 Vendors</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.vendor_values || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
                    color: '#082B55',
                  }}
                />
                <Bar dataKey="value" fill="#1769E0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Execution Latency Area Chart */}
        <div className="bg-white rounded-xl border border-[#E5EAF0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#082B55] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1769E0]" />
              Multi-Agent Execution Latency Trend
            </h3>
            <span className="text-xs font-semibold text-emerald-700">Sub-second execution</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.processing_time_trend || []}>
                <defs>
                  <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1769E0" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1769E0" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
                    color: '#082B55',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#1769E0"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#latencyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
