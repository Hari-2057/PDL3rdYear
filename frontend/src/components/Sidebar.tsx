import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Receipt,
  AlertTriangle,
  UserCheck,
  Building2,
  Sliders,
  GitBranch,
  Users,
  BarChart3,
  FileSpreadsheet,
  History,
  Sparkles,
  ArrowRight,
  LucideIcon,
  Hexagon,
  X,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiAssistant?: () => void;
  pendingReviewCount?: number;
  exceptionsCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isOpen?: boolean; // Mobile/tablet drawer open state
  onClose?: () => void; // Mobile/tablet drawer close handler
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  badgeColor?: string;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiAssistant,
  pendingReviewCount = 8,
  exceptionsCount = 8,
  isCollapsed = false,
  onToggleCollapse,
  isOpen = false,
  onClose,
}) => {
  const navSections: NavSection[] = [
    {
      group: 'WORKSPACE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'inbox', label: 'Inbox', icon: Inbox, badge: 12, badgeColor: 'bg-rose-500 text-white' },
        { id: 'invoices', label: 'Invoices', icon: FileText },
        { id: 'expenses', label: 'Expenses', icon: Receipt },
        { id: 'exceptions', label: 'Exceptions', icon: AlertTriangle, badge: exceptionsCount, badgeColor: 'bg-rose-500 text-white' },
        { id: 'my-review', label: 'My Review', icon: UserCheck, badge: pendingReviewCount, badgeColor: 'bg-amber-400 text-[#082B55]' },
      ],
    },
    {
      group: 'MANAGEMENT',
      items: [
        { id: 'vendors', label: 'Vendors', icon: Building2 },
        { id: 'policies', label: 'Policies', icon: Sliders },
        { id: 'workflows', label: 'Workflows', icon: GitBranch },
        { id: 'users', label: 'Users', icon: Users },
      ],
    },
    {
      group: 'REPORTING',
      items: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
        { id: 'audit-trail', label: 'Audit Trail', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  // Helper for badge display in collapsed mode: 1-9 shows number, 10+ shows "9+"
  const formatCollapsedBadge = (count?: number) => {
    if (!count || count <= 0) return null;
    return count > 9 ? '9+' : `${count}`;
  };

  return (
    <>
      {/* ========================================================
          1. DESKTOP & LAPTOP PERMANENT COLLAPSIBLE SIDEBAR
          - Visible on lg+ (≥ 1024px)
          - Fixed at left: 0, top: 0, height: 100vh
          - Smooth 300ms transition between 240px and 76px
          ======================================================== */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen z-30 bg-[#082B55] text-slate-100 select-none border-r border-[#0D386B] shadow-md transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[76px]' : 'w-[240px]'
        }`}
        aria-label="Sidebar navigation"
      >
        {/* Top Header: Logo + Brand Name + Toggle Button */}
        <div className="h-16 px-3.5 border-b border-[#0D386B] flex items-center justify-between shrink-0 relative">
          {/* Logo & Brand text */}
          <div className={`flex items-center gap-2.5 overflow-hidden ${isCollapsed ? 'w-full justify-center' : ''}`}>
            {/* Hexagonal AI logo */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#1769E0] text-white shadow-xs shrink-0">
              <Hexagon className="w-5 h-5 fill-current opacity-90" />
              <span className="absolute text-[10px] font-extrabold font-mono text-white">AI</span>
            </div>

            {/* Brand text (hidden in collapsed mode) */}
            {!isCollapsed && (
              <div className="overflow-hidden leading-tight transition-opacity duration-200">
                <span className="font-bold text-sm tracking-tight text-white font-sans block">InvoiceAI</span>
                <p className="text-[10px] text-slate-300 font-normal truncate mt-0.5">
                  AI-powered finance operations
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse / Expand Toggle Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={`min-w-[28px] min-h-[28px] rounded-md bg-[#0D386B] hover:bg-[#1769E0] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs ${
                isCollapsed
                  ? 'absolute -right-3.5 top-5 z-40 bg-[#082B55] border border-[#1769E0] text-white hover:bg-[#1769E0] cursor-pointer'
                  : 'ml-1 cursor-pointer'
              }`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          )}
        </div>

        {/* Navigation List: overflow-visible in collapsed mode so hover tooltips aren't clipped */}
        <nav
          className={`flex-1 px-2 py-3 space-y-4 scrollbar-none ${
            isCollapsed ? 'overflow-visible' : 'overflow-y-auto'
          }`}
        >
          {navSections.map((section) => (
            <div key={section.group} className="space-y-0.5">
              {/* Section Group Header (hidden in collapsed mode) */}
              {!isCollapsed ? (
                <div className="px-2.5 mb-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  {section.group}
                </div>
              ) : (
                // In collapsed mode, subtle hairline separator between groups
                <div className="my-2 border-t border-slate-700/40 w-8 mx-auto" />
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const collapsedBadge = formatCollapsedBadge(item.badge);

                return (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center rounded-lg text-xs font-medium transition-all relative ${
                        isCollapsed
                          ? 'h-10 justify-center'
                          : 'px-2.5 py-2 justify-between'
                      } ${
                        isActive
                          ? 'bg-[#1769E0] text-white font-semibold shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {/* Icon with relative badge container */}
                      <div className="relative flex items-center justify-center shrink-0">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />

                        {/* Collapsed Mode Badge: small red circular badge on top-right of icon */}
                        {isCollapsed && collapsedBadge && (
                          <span
                            className="absolute -top-1.5 -right-2.5 min-w-[16px] h-3.5 px-1 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold flex items-center justify-center ring-2 ring-[#082B55] shadow-xs"
                            title={`${item.badge} unread`}
                          >
                            {collapsedBadge}
                          </span>
                        )}
                      </div>

                      {/* Expanded Mode: Text Label and Full Badge */}
                      {!isCollapsed && (
                        <>
                          <span className="truncate text-[11px] ml-2.5 flex-1 text-left">
                            {item.label}
                          </span>

                          {item.badge !== undefined && item.badge > 0 && (
                            <span
                              className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold shrink-0 ${
                                item.badgeColor || 'bg-white/20 text-white'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>

                    {/* Collapsed Mode Hover Tooltip (Never appears in expanded mode) */}
                    {isCollapsed && (
                      <div className="absolute left-[70px] top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-out translate-x-1 group-hover:translate-x-0">
                        <div className="bg-[#0B192C] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl border border-[#1A365D] whitespace-nowrap flex items-center gap-2 relative">
                          {/* Caret */}
                          <div className="w-1.5 h-1.5 bg-[#0B192C] border-l border-b border-[#1A365D] rotate-45 absolute -left-1 top-1/2 -translate-y-1/2" />
                          <span>{item.label}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-rose-500 text-white">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Section: AI Assistant Card + User Profile */}
        <div className="p-2 border-t border-[#0D386B] space-y-2 bg-[#062244]/60 shrink-0">
          {/* AI Assistant Card (Expanded mode) */}
          {!isCollapsed ? (
            <div className="p-2.5 rounded-lg bg-[#0C3566] border border-[#1769E0]/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Sparkles className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>Need help?</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-tight">
                Ask our AI assistant about invoices, policies or exceptions.
              </p>
              <button
                onClick={onOpenAiAssistant}
                className="w-full mt-1 py-1.5 px-2 bg-[#1769E0] hover:bg-blue-500 text-white font-semibold text-[10px] rounded flex items-center justify-center gap-1 transition-colors min-h-[30px] cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            /* Collapsed mode compact AI Assistant button */
            <div className="flex justify-center relative group">
              <button
                onClick={onOpenAiAssistant}
                className="w-10 h-10 rounded-lg bg-[#0C3566] hover:bg-[#1769E0] text-[#60A5FA] hover:text-white flex items-center justify-center transition-colors border border-[#1769E0]/40 shadow-xs cursor-pointer"
                title="Ask AI Assistant"
                aria-label="Ask AI Assistant"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              {/* Tooltip */}
              <div className="absolute left-[70px] top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-out translate-x-1 group-hover:translate-x-0">
                <div className="bg-[#0B192C] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl border border-[#1A365D] whitespace-nowrap flex items-center gap-1.5 relative">
                  <div className="w-1.5 h-1.5 bg-[#0B192C] border-l border-b border-[#1A365D] rotate-45 absolute -left-1 top-1/2 -translate-y-1/2" />
                  <Sparkles className="w-3 h-3 text-[#60A5FA]" />
                  <span>Ask AI Assistant</span>
                </div>
              </div>
            </div>
          )}

          {/* User Profile Container */}
          <div className="relative group">
            <div
              className={`flex items-center rounded-lg bg-[#082B55] border border-[#0D386B] transition-all ${
                isCollapsed
                  ? 'h-10 justify-center p-0 cursor-pointer hover:border-[#1769E0]'
                  : 'p-2 justify-between'
              }`}
            >
              {/* Avatar */}
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="relative shrink-0">
                  <div className="w-7 h-7 rounded-full bg-[#1769E0] text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                    HP
                  </div>
                </div>

                {/* Name & Role (hidden in collapsed mode) */}
                {!isCollapsed && (
                  <div className="overflow-hidden leading-tight">
                    <p className="text-[11px] font-bold text-white truncate">Hari Preeth P</p>
                    <p className="text-[9px] text-slate-300 truncate">Finance Team</p>
                  </div>
                )}
              </div>

              {/* Online indicator (Expanded mode) */}
              {!isCollapsed && (
                <div className="flex items-center gap-1 text-[9px] font-medium text-emerald-400 shrink-0 font-mono" title="Online">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online</span>
                </div>
              )}
            </div>

            {/* Collapsed Mode Avatar Tooltip / Popover */}
            {isCollapsed && (
              <div className="absolute left-[70px] bottom-1 z-50 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-out translate-x-1 group-hover:translate-x-0">
                <div className="bg-[#0B192C] text-white p-2.5 rounded-lg shadow-xl border border-[#1A365D] whitespace-nowrap space-y-0.5 relative">
                  {/* Caret */}
                  <div className="w-1.5 h-1.5 bg-[#0B192C] border-l border-b border-[#1A365D] rotate-45 absolute -left-1 bottom-4" />
                  <p className="text-xs font-bold text-white">Hari Preeth P</p>
                  <p className="text-[10px] text-slate-300">Finance Team</p>
                  <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-mono pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Online</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================================
          2. TABLET & MOBILE SLIDE-OUT NAVIGATION DRAWER (280px)
          - Active below 1024px (< lg)
          - Triggered when hamburger is tapped
          - Semi-transparent dark overlay behind drawer
          ======================================================== */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay (click outside to close) */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* 280px Slide-out Drawer */}
          <div className="relative w-[280px] max-w-[85vw] h-full bg-[#082B55] text-slate-100 shadow-2xl z-10 animate-slideRight flex flex-col select-none">
            {/* Header: Logo + Brand + Close Button */}
            <div className="h-16 px-4 border-b border-[#0D386B] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#1769E0] text-white shadow-xs shrink-0">
                  <Hexagon className="w-5 h-5 fill-current opacity-90" />
                  <span className="absolute text-[10px] font-extrabold font-mono text-white">AI</span>
                </div>
                <div>
                  <span className="font-bold text-sm tracking-tight text-white font-sans block">InvoiceAI</span>
                  <p className="text-[10px] text-slate-300 font-normal truncate mt-0.5">
                    AI-powered finance operations
                  </p>
                </div>
              </div>

              {/* Close X Button */}
              <button
                onClick={onClose}
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Groups */}
            <nav className="flex-1 overflow-y-auto px-3 py-3.5 space-y-4">
              {navSections.map((section) => (
                <div key={section.group} className="space-y-0.5">
                  <div className="px-2 mb-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    {section.group}
                  </div>

                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                          isActive
                            ? 'bg-[#1769E0] text-white font-semibold shadow-xs'
                            : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate text-xs">{item.label}</span>
                        </div>

                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold shrink-0 ${
                              item.badgeColor || 'bg-white/20 text-white'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* AI Assistant Card in Mobile Drawer */}
            <div className="p-3 border-t border-[#0D386B] bg-[#062244]/40">
              <div className="p-2.5 rounded-lg bg-[#0C3566] border border-[#1769E0]/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Sparkles className="w-3.5 h-3.5 text-[#60A5FA]" />
                  <span>Need help?</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Ask our AI assistant about invoices, policies or exceptions.
                </p>
                <button
                  onClick={() => {
                    if (onOpenAiAssistant) onOpenAiAssistant();
                    if (onClose) onClose();
                  }}
                  className="w-full mt-1 py-2 px-2 bg-[#1769E0] hover:bg-blue-500 text-white font-semibold text-xs rounded flex items-center justify-center gap-1 transition-colors min-h-[38px] active:scale-[0.98]"
                >
                  <span>Ask AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom User Profile in Drawer */}
            <div className="p-3 border-t border-[#0D386B] bg-[#062244]/60 shrink-0">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#082B55] border border-[#0D386B]">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-[#1769E0] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    HP
                  </div>
                  <div className="overflow-hidden leading-tight">
                    <p className="text-xs font-bold text-white truncate">Hari Preeth P</p>
                    <p className="text-[10px] text-slate-300 truncate">Finance Team</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-medium text-emerald-400 shrink-0 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
