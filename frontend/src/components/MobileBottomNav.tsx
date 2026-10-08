import React from 'react';
import { LayoutDashboard, FileText, AlertTriangle, BarChart3, Menu } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMenu: () => void;
  exceptionsBadge?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMenu,
  exceptionsBadge = 256,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'exceptions', label: 'Exceptions', icon: AlertTriangle, badge: exceptionsBadge },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5EAF0] shadow-lg flex items-center justify-around px-2 py-1 safe-bottom"
      aria-label="Mobile Navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center relative rounded-lg transition-colors ${
              isActive ? 'text-[#1769E0]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2.5 px-1 min-w-[16px] h-3.5 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
            {isActive && (
              <span className="w-4 h-0.5 rounded-full bg-[#1769E0] mt-0.5" />
            )}
          </button>
        );
      })}

      {/* More Button to open Slide-out Drawer */}
      <button
        onClick={onOpenMenu}
        className="flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
        aria-label="Open full navigation"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 font-medium">More</span>
      </button>
    </nav>
  );
};
