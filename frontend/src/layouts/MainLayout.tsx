import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopNavbar } from '../components/TopNavbar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { FilterBottomSheet, FilterState } from '../components/FilterBottomSheet';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  pendingReviewCount?: number;
  exceptionsCount?: number;
  onOpenAiAssistant?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  pendingReviewCount = 8,
  exceptionsCount = 8,
  onOpenAiAssistant,
}) => {
  // Mobile / Tablet Drawer State (< 1024px)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Desktop Collapsible Sidebar State (≥ 1024px):
  // Default: collapsed on laptop (1024 - 1199px), expanded on desktop (1200px+)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024 && window.innerWidth < 1200;
    }
    return false;
  });

  // Mobile Filter Sheet State
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Resize listener to adapt default collapse on screen width transitions
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && window.innerWidth < 1200) {
        setIsSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleApplyFilters = (filters: FilterState) => {
    console.log('Applied filters:', filters);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-slate-900 font-sans flex flex-col">
      {/* 1. Permanent Desktop Sidebar (fixed left-0 top-0, 240px expanded or 76px collapsed)
             + Mobile / Tablet Slide-out Drawer (280px) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingReviewCount={pendingReviewCount}
        exceptionsCount={exceptionsCount}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenAiAssistant={onOpenAiAssistant}
      />

      {/* 2. Main Content Viewport:
             Smooth 300ms transition synchronized with the sidebar width!
             - Expanded: margin-left: 240px
             - Collapsed: margin-left: 76px
             - Mobile/Tablet (< 1024px): margin-left: 0 */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:ml-[76px]' : 'lg:ml-[240px]'
        }`}
      >
        {/* Top Header */}
        <TopNavbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onNavigateSettings={() => setActiveTab('settings')}
          onToggleSidebar={() => setIsDrawerOpen(!isDrawerOpen)}
          onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
        />

        {/* Content Container (max-w-[1600px] centered on very large screens)
            with pb-24 on mobile so bottom navigation bar never covers content */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-7 pb-24 md:pb-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* 3. Mobile Fixed Bottom Navigation Bar (< 768px) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMenu={() => setIsDrawerOpen(true)}
        exceptionsBadge={exceptionsCount}
      />

      {/* 4. Mobile Bottom Sheet for Filters */}
      <FilterBottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
