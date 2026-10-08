import React, { useState } from 'react';
import {
  Search,
  Bell,
  Settings,
  ChevronDown,
  Calendar,
  Menu,
  Filter,
  Hexagon,
} from 'lucide-react';

interface TopNavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onNavigateSettings?: () => void;
  onToggleSidebar?: () => void;
  onOpenFilterSheet?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  searchTerm,
  setSearchTerm,
  onNavigateSettings,
  onToggleSidebar,
  onOpenFilterSheet,
}) => {
  const [period, setPeriod] = useState('Last 30 days');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notifications = [
    { id: 1, title: 'High-value invoice flagged', meta: 'INV-2026-1006 · $15,230.00', time: '2m ago', color: 'bg-rose-500' },
    { id: 2, title: 'New vendor detected', meta: 'TechNova Solutions', time: '12m ago', color: 'bg-blue-500' },
    { id: 3, title: 'Policy rule updated', meta: 'Travel expense limit changed', time: '1h ago', color: 'bg-emerald-500' },
    { id: 4, title: 'Weekly report ready', meta: 'October 2026 summary', time: '2h ago', color: 'bg-purple-500' },
  ];

  return (
    <header className="bg-white border-b border-[#E5EAF0] sticky top-0 z-20 shadow-2xs">
      {/* Main Top Bar */}
      <div className="h-16 px-3 sm:px-6 flex items-center justify-between gap-3">
        {/* Left Side: Hamburger Menu on Tablet/Mobile + Brand (when sidebar hidden) + Desktop Search */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Hamburger Menu (visible below 1024px) */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-700 hover:text-[#082B55] hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile/Tablet Brand Logo when sidebar is hidden */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#1769E0] text-white">
              <Hexagon className="w-4 h-4 fill-current opacity-90" />
            </div>
            <span className="font-bold text-sm text-[#082B55] font-sans">InvoiceAI</span>
          </div>

          {/* Desktop & Tablet Search Bar (hidden on mobile < 640px, moved below) */}
          <div className="hidden sm:block relative flex-1 max-w-xs md:max-w-sm lg:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoices, vendors, documents, policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-12 py-1.5 bg-[#F5F8FC] border border-[#E5EAF0] rounded-lg text-xs text-[#082B55] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#1769E0] focus:ring-1 focus:ring-[#1769E0] transition-all font-sans"
            />
            <div className="hidden lg:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center pointer-events-none">
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-400 border border-slate-200">
                ⌘ K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
          {/* Desktop Date Selector (hidden on mobile and tablet) */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5EAF0] bg-[#F5F8FC] text-slate-700 font-medium font-mono text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-[#1769E0]" />
            <span>Oct 1, 2026 – Oct 31, 2026</span>
          </div>

          {/* Desktop Period Dropdown (hidden on small screens) */}
          <div className="relative hidden lg:block">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none bg-white border border-[#E5EAF0] hover:border-slate-300 text-slate-800 py-1.5 pl-3 pr-8 rounded-lg font-medium text-xs focus:outline-none focus:border-[#1769E0] cursor-pointer min-h-[36px]"
            >
              <option value="Last 30 days">Last 30 days</option>
              <option value="This Month">This Month</option>
              <option value="Last Quarter">Last Quarter</option>
              <option value="Year to Date">Year to Date</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Mobile Filter Button (visible on mobile < 640px) */}
          <button
            onClick={onOpenFilterSheet}
            className="sm:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-[#E5EAF0] text-slate-700 hover:bg-slate-100"
            title="Open Filters"
            aria-label="Filter documents"
          >
            <Filter className="w-4 h-4 text-[#1769E0]" />
          </button>

          {/* Notification Icon with Red Badge (12) */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-600 hover:text-[#082B55] hover:bg-slate-100 transition-colors relative"
              title="Notifications"
              aria-label="Notifications, 12 unread"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                12
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-[#E5EAF0] rounded-xl shadow-lg z-50 p-3 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-[#082B55]">Recent Notifications</span>
                  <span className="text-[10px] font-mono text-[#1769E0] font-semibold cursor-pointer hover:underline">
                    View all
                  </span>
                </div>
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg hover:bg-[#F5F8FC] text-xs space-y-0.5 cursor-pointer border border-transparent hover:border-[#E5EAF0]">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${n.color}`} />
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 pl-3">{n.meta}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Icon (hidden on small mobile) */}
          <button
            onClick={onNavigateSettings}
            className="hidden sm:flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-600 hover:text-[#082B55] hover:bg-slate-100 transition-colors"
            title="Platform Settings"
            aria-label="Platform settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="h-6 w-[1px] bg-[#E5EAF0] hidden sm:block" />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="min-h-[44px] flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
              aria-label="User profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-[#082B55] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                HP
              </div>
              <div className="hidden xl:block leading-tight">
                <p className="text-xs font-bold text-[#082B55]">Hari Preeth P</p>
                <p className="text-[10px] text-slate-500">Finance Team</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block ml-0.5" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5EAF0] rounded-xl shadow-lg z-50 p-1.5 space-y-1 animate-fadeIn">
                <div className="px-2.5 py-1.5 border-b border-slate-100 text-xs">
                  <p className="font-bold text-[#082B55]">Hari Preeth P</p>
                  <p className="text-[11px] text-slate-500">Finance Manager</p>
                </div>
                <button
                  onClick={() => setShowUserDropdown(false)}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
                >
                  Security & Role
                </button>
                <button
                  onClick={() => setShowUserDropdown(false)}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50"
                >
                  Approval Limits
                </button>
                <button
                  onClick={() => setShowUserDropdown(false)}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Full-Width Search & Filter Bar (shown only on mobile < 640px) */}
      <div className="sm:hidden px-3 py-2 border-t border-slate-100 bg-[#F5F8FC] flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-white border border-[#E5EAF0] rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1769E0]"
          />
        </div>
        <button
          onClick={onOpenFilterSheet}
          className="min-h-[40px] px-3 bg-white border border-[#E5EAF0] rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 shrink-0"
        >
          <Filter className="w-3.5 h-3.5 text-[#1769E0]" />
          <span>Filters</span>
        </button>
      </div>
    </header>
  );
};
