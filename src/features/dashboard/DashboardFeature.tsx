import React from 'react';
import { useDashboard } from './useDashboard';
import { SummaryCard } from './components/SummaryCard';
import { StockByZoneChart } from './components/StockByZoneChart';
import { StockByProductChart } from './components/StockByProductChart';
import { LowStockAlertTable } from './components/LowStockAlertTable';
import { RefreshCw } from 'lucide-react';

export const DashboardFeature: React.FC = () => {
  const { state, actions } = useDashboard();

  return (
    <div className="w-full pl-75 pr-10 py-6 text-wms-text-main">
      {/* --- PAGE TITLE & REFRESH --- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold mb-1.25">Dashboard</h1>
          <p className="text-[13px] text-wms-muted mb-6.25">
            Monitor inventory levels and receive real-time operational alerts
          </p>
        </div>
        <button
          onClick={actions.refresh}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-800 rounded-xl shadow-xs transition-all text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${state.loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

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
