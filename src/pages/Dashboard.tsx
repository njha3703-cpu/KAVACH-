import React from 'react';
import { KpiRow } from '../components/kpi/KpiRow';
import { LiveGisMap } from '../components/map/LiveGisMap';
import { RecentAlertsPanel } from '../components/alerts/RecentAlertsPanel';
import { DeformationTrends } from '../components/trends/DeformationTrends';
import { AiPredictionCard } from '../components/ai/AiPredictionCard';
import { NodeDetailsTable } from '../components/nodes/NodeDetailsTable';
import { QuickActions } from '../components/actions/QuickActions';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-4 pb-20">
      {/* 1. Top KPI Row (5 status cards) */}
      <section aria-label="Key Performance Indicators">
        <KpiRow />
      </section>

      {/* 2. Middle Grid: Large Interactive GIS Map (approx 68%) + Recent Alerts Panel (approx 32%) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <LiveGisMap />
        </div>
        <div className="lg:col-span-4">
          <RecentAlertsPanel />
        </div>
      </section>

      {/* 3. Bottom Grid: 4 Equal Analytical & Action Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Deformation Trends */}
        <DeformationTrends />

        {/* Card 2: AI Prediction */}
        <AiPredictionCard />

        {/* Card 3: Node Details Table */}
        <NodeDetailsTable />

        {/* Card 4: Quick Actions */}
        <QuickActions />
      </section>
    </div>
  );
};
