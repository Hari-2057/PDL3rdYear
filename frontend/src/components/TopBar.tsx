import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Check, User, ShieldCheck } from 'lucide-react';

interface TopBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  reviewNotificationCount?: number;
  onOpenNotifications?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchTerm,
  setSearchTerm,
  reviewNotificationCount = 14,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsList = [
    { id: 1, title: 'PO Mismatch Detected', time: '10m ago', text: 'INV-2026-1001 requires sign-off ($12,450.00)', type: 'warning' },
    { id: 2, title: 'Auto-Resolved Batch', time: '42m ago', text: '18 invoices matched and auto-scheduled for disbursement', type: 'success' },
    { id: 3, title: 'Duplicate Flag Triggered', time: '1h ago', text: 'INV-2026-0998 blocked (Hash matched INV-2026-0814)', type: 'error' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Global Search Bar */}
      <div className="relative w-80 sm:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search invoices, vendors, documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-sans"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-400 border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Header Navigation Items */}
      <div className="flex items-center gap-4">
        {/* Notification Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            title="Review Notifications"
          >
            <Bell className="w-4 h-4" />
            {reviewNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                <span className="text-xs font-bold text-slate-900">Review Notifications</span>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                  {reviewNotificationCount} new
                </span>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {notificationsList.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg hover:bg-slate-50 text-xs space-y-0.5 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-slate-200" />

        {/* User Profile with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              HP
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-xs font-semibold text-slate-900">Hari Preeth P</p>
              <p className="text-[11px] text-slate-500">Finance Team</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1.5 space-y-1">
              <div className="px-2.5 py-1.5 border-b border-slate-100 text-xs">
                <p className="font-bold text-slate-900">Hari Preeth P</p>
                <p className="text-[11px] text-slate-500">Finance Manager</p>
              </div>
              <button
                onClick={() => setShowUserMenu(false)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
              >
                Profile & Security
              </button>
              <button
                onClick={() => setShowUserMenu(false)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
              >
                Approval Delegation
              </button>
              <button
                onClick={() => setShowUserMenu(false)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
