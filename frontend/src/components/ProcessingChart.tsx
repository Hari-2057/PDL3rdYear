import React, { useState } from 'react';
import { MoreVertical, ChevronDown } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export const ProcessingChart: React.FC = () => {
  const [frequency, setFrequency] = useState('Daily');
  const [timeRange, setTimeRange] = useState('Last 30 days');

  const data = [
    { date: 'Oct 1', totalDocuments: 140, autoResolved: 110, humanReview: 18, exceptions: 12 },
    { date: 'Oct 5', totalDocuments: 160, autoResolved: 130, humanReview: 14, exceptions: 16 },
    { date: 'Oct 10', totalDocuments: 180, autoResolved: 145, humanReview: 20, exceptions: 15 },
    { date: 'Oct 15', totalDocuments: 150, autoResolved: 120, humanReview: 16, exceptions: 14 },
    { date: 'Oct 20', totalDocuments: 190, autoResolved: 160, humanReview: 12, exceptions: 18 },
    { date: 'Oct 25', totalDocuments: 170, autoResolved: 140, humanReview: 10, exceptions: 20 },
    { date: 'Oct 31', totalDocuments: 220, autoResolved: 187, humanReview: 8, exceptions: 25 },
  ];

  return (
    <div className="bg-white border border-[#E5EAF0] rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#082B55] tracking-tight">Processing Performance</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Daily document processing and resolution trend</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Daily dropdown */}
          <div className="relative">
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="appearance-none bg-[#F5F8FC] border border-[#E5EAF0] text-slate-700 py-1 pl-2.5 pr-7 rounded-lg font-medium text-xs focus:outline-none focus:border-[#1769E0] cursor-pointer min-h-[36px]"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Last 30 days dropdown */}
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-[#F5F8FC] border border-[#E5EAF0] text-slate-700 py-1 pl-2.5 pr-7 rounded-lg font-medium text-xs focus:outline-none focus:border-[#1769E0] cursor-pointer min-h-[36px]"
            >
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 90 days">Last 90 days</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Three-dot menu */}
          <button className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-slate-600 my-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#082B55]" />
          <span className="text-[11px]">Total Documents</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]" />
          <span className="text-[11px]">Auto-resolved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B]" />
          <span className="text-[11px]">Human Review</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#EF4444]" />
          <span className="text-[11px]">Exceptions</span>
        </div>
      </div>

      {/* Stacked Bar Chart with min-width container for small screens to prevent unreadable squeezing */}
      <div className="w-full overflow-x-auto scrollbar-none">
        <div className="h-60 sm:h-64 min-w-[320px] sm:min-w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: '#E5EAF0' }} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5EAF0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(8, 43, 85, 0.05)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="autoResolved" name="Auto-resolved" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} barSize={22} />
              <Bar dataKey="humanReview" name="Human Review" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} barSize={22} />
              <Bar dataKey="exceptions" name="Exceptions" stackId="a" fill="#EF4444" radius={[3, 3, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
