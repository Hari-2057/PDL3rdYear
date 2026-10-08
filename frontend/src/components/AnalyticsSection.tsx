import React from 'react';
import { ProcessingChart } from './ProcessingChart';
import { ExceptionBreakdown } from './ExceptionBreakdown';

export const AnalyticsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT: Processing Performance (Stacked Bar Chart) */}
      <div className="lg:col-span-7">
        <ProcessingChart />
      </div>

      {/* RIGHT: Exception Breakdown (Horizontal Breakdown) */}
      <div className="lg:col-span-5">
        <ExceptionBreakdown />
      </div>
    </div>
  );
};
