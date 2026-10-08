import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (normalized.includes('auto') || normalized.includes('approved') || normalized.includes('resolved') || normalized.includes('success')) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    dotColor = 'bg-emerald-500';
  } else if (normalized.includes('pending') || normalized.includes('review') || normalized.includes('warning')) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200/80';
    dotColor = 'bg-amber-500';
  } else if (normalized.includes('blocked') || normalized.includes('escalated') || normalized.includes('reject') || normalized.includes('failed')) {
    styles = 'bg-red-50 text-red-700 border-red-200/80';
    dotColor = 'bg-red-500';
  } else if (normalized.includes('info') || normalized.includes('informational')) {
    styles = 'bg-purple-50 text-purple-700 border-purple-200/80';
    dotColor = 'bg-purple-500';
  } else if (normalized.includes('processing')) {
    styles = 'bg-blue-50 text-blue-700 border-blue-200/80';
    dotColor = 'bg-blue-500';
  }

  const sizeClass =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px]'
      : size === 'lg'
      ? 'px-3 py-1.5 text-xs font-semibold'
      : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium font-sans ${styles} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};
