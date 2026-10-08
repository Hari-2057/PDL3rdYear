import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { MetricCard } from '../components/MetricCard';
import { AnalyticsSection } from '../components/AnalyticsSection';
import { RecentDocumentsTable, DocumentRow } from '../components/RecentDocumentsTable';
import { AiAgentStatusPanel } from '../components/AiAgentStatusPanel';
import { AiInsightCard } from '../components/AiInsightCard';
import { QuickActionsCard } from '../components/QuickActionsCard';
import { RecentNotificationsPanel } from '../components/RecentNotificationsPanel';
import { BottomAnalytics } from '../components/BottomAnalytics';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Activity,
  ShieldCheck,
} from 'lucide-react';

interface DashboardPageProps {
  onViewDocument: (doc: DocumentRow) => void;
  onNavigateTab: (tab: string) => void;
  onUploadInvoice: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onViewDocument,
  onNavigateTab,
  onUploadInvoice,
}) => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* 1. HERO BANNER */}
      <HeroBanner onViewExceptionQueue={() => onNavigateTab('exceptions')} />

      {/* 2. KPI SECTION:
          - Mobile: Horizontal swipeable carousel with snap points (~1.5 cards visible)
          - Tablet: 2 cards per row (sm:grid-cols-2)
          - Laptop: 3 cards per row (lg:grid-cols-3)
          - Desktop: 5 cards per row (xl:grid-cols-5) */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 scrollbar-none sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* CARD 1: Total Documents */}
        <MetricCard
          label="Total Documents"
          value="1,248"
          comparisonText="12% from last month"
          isIncrease={true}
          isFavorable={true}
          icon={FileText}
          variant="blue"
          visualizationType="bars"
        />

        {/* CARD 2: Auto-resolved */}
        <MetricCard
          label="Auto-resolved"
          value="892"
          percentage="72%"
          comparisonText="8% from last month"
          isIncrease={true}
          isFavorable={true}
          icon={CheckCircle2}
          variant="green"
          visualizationType="sparkline-green"
        />

        {/* CARD 3: Exceptions */}
        <MetricCard
          label="Exceptions"
          value="256"
          percentage="21%"
          comparisonText="5% from last month"
          isIncrease={true}
          isFavorable={false}
          icon={AlertTriangle}
          variant="red"
          visualizationType="sparkline-red"
        />

        {/* CARD 4: Pending Review */}
        <MetricCard
          label="Pending Review"
          value="98"
          percentage="8%"
          comparisonText="18% from last month"
          isIncrease={false}
          isFavorable={true}
          icon={Clock}
          variant="amber"
          visualizationType="sparkline-amber"
        />

        {/* CARD 5: Average Cycle Time */}
        <MetricCard
          label="Average Cycle Time"
          value="6.2 hrs"
          comparisonText="45% vs before"
          isIncrease={false}
          isFavorable={true}
          icon={Activity}
          variant="blue"
          visualizationType="sparkline-blue"
        />
      </div>

      {/* 3. MAIN ANALYTICS AREA (Stacked on tablet/mobile, 2-column on lg+) */}
      <AnalyticsSection />

      {/* 4. LAPTOP & TABLET LAYOUT (< xl / below 1200px):
          On laptop & tablet, AI Agent Status moves below Analytics instead of permanent right sidebar */}
      <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-5">
        <AiAgentStatusPanel />
        <div className="space-y-4">
          <AiInsightCard onViewAnalysis={() => onNavigateTab('reports')} />
          <QuickActionsCard
            onUploadInvoice={onUploadInvoice}
            onReviewExceptions={() => onNavigateTab('exceptions')}
            onViewReports={() => onNavigateTab('reports')}
            onAddPolicyRule={() => onNavigateTab('workflows')}
          />
        </div>
      </div>

      {/* 5. WORKSPACE OPERATIONS:
          - Desktop (1200px+ / xl): Left (8 cols) Recent Documents + Right (4 cols) AI Side Panels
          - Laptop / Tablet / Mobile: Recent Documents Table takes full width */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Recent Documents (8 cols on desktop, full width on laptop/tablet/mobile) */}
        <div className="xl:col-span-8 space-y-6">
          <RecentDocumentsTable onViewDocument={onViewDocument} />
        </div>

        {/* Desktop Permanent Right Sidebar (visible only on xl: 1200px+) */}
        <div className="hidden xl:block xl:col-span-4 space-y-4">
          <AiAgentStatusPanel />

          <AiInsightCard onViewAnalysis={() => onNavigateTab('reports')} />

          <QuickActionsCard
            onUploadInvoice={onUploadInvoice}
            onReviewExceptions={() => onNavigateTab('exceptions')}
            onViewReports={() => onNavigateTab('reports')}
            onAddPolicyRule={() => onNavigateTab('workflows')}
          />

          <RecentNotificationsPanel />
        </div>
      </div>

      {/* Notifications Panel for < xl screens (below 1200px) */}
      <div className="xl:hidden">
        <RecentNotificationsPanel />
      </div>

      {/* 6. BOTTOM ANALYTICS (Top Vendors, Resolution Rate Donut, Average Cycle Time) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Vendor & Resolution Analytics
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Real-time telemetry</span>
        </div>
        <BottomAnalytics />
      </div>

      {/* 7. GOVERNANCE & AUDIT ASSURANCE STRIP */}
      <div className="rounded-xl border border-[#E5EAF0] bg-white p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1769E0] flex items-center justify-center shrink-0 border border-blue-100 mt-0.5 sm:mt-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[#082B55] text-xs leading-snug">
              AI proposes. Rules validate. Humans approve when necessary. Every decision is auditable.
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              SOC-2 Type II certified · Immutable ledger checksums · ISO 27001 compliant enterprise AP pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <button
            onClick={() => onNavigateTab('audit-trail')}
            className="flex-1 md:flex-initial min-h-[40px] px-3 py-2 rounded-lg border border-[#E5EAF0] bg-[#F5F8FC] hover:bg-slate-100 font-semibold text-[11px] text-[#082B55] transition-colors text-center"
          >
            Inspect Audit Trail
          </button>
          <button
            onClick={() => onNavigateTab('workflows')}
            className="flex-1 md:flex-initial min-h-[40px] px-3.5 py-2 rounded-lg bg-[#1769E0] hover:bg-blue-600 font-semibold text-[11px] text-white transition-colors text-center shadow-xs"
          >
            Configure Rules
          </button>
        </div>
      </div>
    </div>
  );
};
