import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Building2, PieChart as PieIcon, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const BottomAnalytics: React.FC = () => {
  // CARD 1: Top Vendors data
  const topVendors = [
    { name: 'Acme Supplies', count: 45, max: 50, color: '#EF4444' },
    { name: 'Global Tech Ltd', count: 32, max: 50, color: '#F59E0B' },
    { name: 'BuildRight Co', count: 28, max: 50, color: '#1769E0' },
    { name: 'Euro Services', count: 18, max: 50, color: '#64748B' },
  ];

  // CARD 2: Resolution Rate Donut data
  const resolutionData = [
    { name: 'Auto-resolved', value: 72, color: '#10B981' },
    { name: 'Human Review', value: 20, color: '#F59E0B' },
    { name: 'Blocked', value: 8, color: '#EF4444' },
  ];

  // CARD 3: Cycle Time Trend data (smooth downward trend from ~11.3 hrs down to 6.2 hrs)
  const cycleTimeData = [
    { day: 'Oct 1', hours: 11.2 },
    { day: 'Oct 5', hours: 10.4 },
    { day: 'Oct 10', hours: 9.1 },
    { day: 'Oct 15', hours: 8.5 },
    { day: 'Oct 20', hours: 7.6 },
    { day: 'Oct 25', hours: 6.9 },
    { day: 'Oct 31', hours: 6.2 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* CARD 1: Top Vendors by Exceptions */}
      <div className="bg-white border border-[#E5EAF0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1769E0]" />
              <h3 className="text-sm font-bold text-[#082B55] tracking-tight">Top Vendors by Exceptions</h3>
            </div>
            <span className="text-[11px] font-mono font-semibold text-slate-500 bg-[#F5F8FC] border border-[#E5EAF0] px-2 py-0.5 rounded">
              Ranked
            </span>
          </div>

          <div className="space-y-3.5 my-4">
            {topVendors.map((vendor) => (
              <div key={vendor.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{vendor.name}</span>
                  <span className="font-mono font-bold text-[#082B55]">{vendor.count}</span>
                </div>
                {/* Horizontal progress bar */}
                <div className="w-full bg-[#F5F8FC] h-2 rounded-full overflow-hidden border border-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(vendor.count / vendor.max) * 100}%`,
                      backgroundColor: vendor.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Total flagged vendor records: <strong>123</strong></span>
          <span className="text-[#1769E0] font-semibold cursor-pointer hover:underline">
            Manage vendors →
          </span>
        </div>
      </div>

      {/* CARD 2: Resolution Rate (Donut Chart) */}
      <div className="bg-white border border-[#E5EAF0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#10B981]" />
              <h3 className="text-sm font-bold text-[#082B55] tracking-tight">Resolution Rate</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              8%
            </span>
          </div>

          {/* Donut Chart with Centered Metric */}
          <div className="relative h-44 my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resolutionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={74}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {resolutionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-2xl font-bold font-sans text-[#082B55] leading-none">72%</span>
              <span className="text-[11px] font-medium text-slate-500 mt-0.5">Auto-resolved</span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-100">
            <div>
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>Auto-resolved</span>
              </div>
              <p className="text-xs font-bold text-[#082B55] font-mono mt-0.5">72%</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span>Human Review</span>
              </div>
              <p className="text-xs font-bold text-[#082B55] font-mono mt-0.5">20%</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                <span>Blocked</span>
              </div>
              <p className="text-xs font-bold text-[#082B55] font-mono mt-0.5">8%</p>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: Average Cycle Time (Trend line chart) */}
      <div className="bg-white border border-[#E5EAF0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1769E0]" />
              <h3 className="text-sm font-bold text-[#082B55] tracking-tight">Average Cycle Time</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
              45% vs before
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#082B55] tracking-tight font-sans">6.2 hrs</span>
            <span className="text-xs font-medium text-emerald-600 font-sans flex items-center">
              ↓ 45% vs before
            </span>
          </div>

          {/* Smooth Trend Area Chart */}
          <div className="h-36 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cycleTimeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="cycleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1769E0" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1769E0" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={{ stroke: '#E5EAF0' }} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} domain={[4, 13]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5EAF0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(8, 43, 85, 0.05)',
                    fontSize: '11px',
                  }}
                  formatter={(value: any) => [`${value} hrs`, 'Cycle Time']}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#1769E0"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#cycleGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Previous baseline: <strong>11.3 hrs</strong></span>
          <span className="text-[#1769E0] font-semibold cursor-pointer hover:underline">
            SLA Benchmarks →
          </span>
        </div>
      </div>
    </div>
  );
};
