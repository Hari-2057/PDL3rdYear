import React from 'react';
import { Upload, AlertTriangle, BarChart3, PlusCircle, ArrowUpRight } from 'lucide-react';

interface QuickActionsCardProps {
  onUploadInvoice: () => void;
  onReviewExceptions: () => void;
  onViewReports: () => void;
  onAddPolicyRule: () => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onUploadInvoice,
  onReviewExceptions,
  onViewReports,
  onAddPolicyRule,
}) => {
  const actions = [
    {
      title: 'Upload Invoice',
      description: 'PDF, image, email',
      icon: Upload,
      iconColor: 'text-[#1769E0]',
      bgColor: 'bg-blue-50',
      onClick: onUploadInvoice,
      highlight: true,
    },
    {
      title: 'Review Exceptions',
      description: '256 pending',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      onClick: onReviewExceptions,
      badge: '256',
    },
    {
      title: 'View Reports',
      description: 'Analytics & insights',
      icon: BarChart3,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      onClick: onViewReports,
    },
    {
      title: 'Add Policy Rule',
      description: 'Create new rule',
      icon: PlusCircle,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      onClick: onAddPolicyRule,
    },
  ];

  return (
    <div className="bg-white border border-[#E5EAF0] rounded-xl p-5 shadow-xs space-y-3.5">
      <div className="border-b border-slate-100 pb-2.5">
        <h3 className="text-sm font-bold text-[#082B55] tracking-tight">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.title}
              onClick={act.onClick}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left group ${
                act.highlight
                  ? 'bg-blue-50/50 border-blue-200/70 hover:bg-blue-50 hover:border-blue-300'
                  : 'bg-white border-[#E5EAF0] hover:bg-[#F5F8FC] hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.bgColor} ${act.iconColor} group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#082B55] group-hover:text-[#1769E0] transition-colors">
                      {act.title}
                    </span>
                    {act.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-100 text-amber-800">
                        {act.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{act.description}</span>
                </div>
              </div>

              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1769E0] transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
