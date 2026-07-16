import React from 'react';
import { useDashboard } from './useDashboard';
import { SummaryCard } from './components/SummaryCard';
import { StockByZoneChart } from './components/StockByZoneChart';
import { StockByProductChart } from './components/StockByProductChart';
import { LowStockAlertTable } from './components/LowStockAlertTable';
import { MultiStatCard } from '../../components/StatCard';
import { BarListCard } from '../../components/BarListCard';
import { ClipboardCheck, Layers } from 'lucide-react';

export const DashboardFeature: React.FC = () => {
  const { state } = useDashboard();

  return (
    <div className="w-full pl-75 pr-10 pb-6 text-wms-text-main">
      {state.loading && !state.totalStock && !state.stockByZone.length && !state.stockByProduct.length ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-wms-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Summary Row */}
          <SummaryCard
            totalStock={state.totalStock}
            lowStockCount={state.lowStockAlerts.length}
          />

          {/* ── NEW: MultiStatCard + BarListCard row (matches the design) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: multi-metric card like "Approval Status" */}
            <MultiStatCard
              title="Stock Summary"
              icon={ClipboardCheck}
              iconColor="text-blue-600"
              stats={[
                {
                  label: 'Total',
                  value: state.totalStock ?? 0,
                  trend: { value: 0, label: 'vs yesterday' },
                },
                {
                  label: 'Low Stock',
                  value: state.lowStockAlerts.length,
                  trend: {
                    value: -state.lowStockAlerts.length,
                    label: 'items need reorder',
                  },
                },
                {
                  label: 'Zones',
                  value: state.stockByZone.length,
                },
                {
                  label: 'Products',
                  value: state.stockByProduct.length,
                },
              ]}
            />

            {/* Right: bar list card like "Time Off Request Type" */}
            <BarListCard
              title="Stock by Zone"
              icon={Layers}
              iconColor="text-blue-600"
              items={state.stockByZone.slice(0, 5).map((z) => ({
                label: z.label,
                value: z.value,
                barColor: 'bg-blue-500',
              }))}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StockByZoneChart data={state.stockByZone} />
            <StockByProductChart data={state.stockByProduct} />
          </div>

          {/* Table Row */}
          <LowStockAlertTable alerts={state.lowStockAlerts} />
        </div>
      )}
    </div>
  );
};

export default DashboardFeature;
