import React from 'react';
import { Bell, ArrowRight } from 'lucide-react';

interface NotificationItem {
  id: string;
  dotColor: string;
  dotBg: string;
  title: string;
  subtitle: string;
  time: string;
}

export const RecentNotificationsPanel: React.FC = () => {
  const notifications: NotificationItem[] = [
    {
      id: '1',
      dotColor: 'bg-rose-500',
      dotBg: 'bg-rose-100',
      title: 'High-value invoice flagged',
      subtitle: 'INV-2026-1006 · $15,230.00',
      time: '2m ago',
    },
    {
      id: '2',
      dotColor: 'bg-blue-500',
      dotBg: 'bg-blue-100',
      title: 'New vendor detected',
      subtitle: 'TechNova Solutions',
      time: '12m ago',
    },
    {
      id: '3',
      dotColor: 'bg-emerald-500',
      dotBg: 'bg-emerald-100',
      title: 'Policy rule updated',
      subtitle: 'Travel expense limit changed',
      time: '1h ago',
    },
    {
      id: '4',
      dotColor: 'bg-purple-500',
      dotBg: 'bg-purple-100',
      title: 'Weekly report ready',
      subtitle: 'October 2026 summary',
      time: '2h ago',
    },
  ];

  return (
    <div className="bg-white border border-[#E5EAF0] rounded-xl p-5 shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#1769E0]" />
          <h3 className="text-sm font-bold text-[#082B55] tracking-tight">Recent Notifications</h3>
        </div>
        <button className="text-[11px] font-semibold text-[#1769E0] hover:underline cursor-pointer">
          View all
        </button>
      </div>

      {/* Items list */}
      <div className="divide-y divide-slate-100">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="py-2.5 px-1 hover:bg-[#F5F8FC] rounded-lg transition-colors cursor-pointer group flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              {/* Colored Dot */}
              <div className="mt-1 shrink-0">
                <span className={`flex w-2.5 h-2.5 rounded-full ${item.dotColor} ring-4 ${item.dotBg}`} />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-[#082B55] group-hover:text-[#1769E0] transition-colors">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{item.subtitle}</p>
              </div>
            </div>

            <span className="text-[10px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
