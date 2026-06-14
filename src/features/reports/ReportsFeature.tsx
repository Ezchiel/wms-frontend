import React from 'react';
import TabNavigation from '../../components/TabNavigation';
import { useReports } from './useReports';
import { StockTrendChart } from './components/StockTrendChart';
import { StockByGroupTable } from './components/StockByGroupTable';
import { LocationUtilizationChart } from './components/LocationUtilizationChart';
import { InventoryMovementTable } from './components/InventoryMovementTable';
import { ExpiringStockTable } from './components/ExpiringStockTable';
import { RefreshCw } from 'lucide-react';

export const ReportsFeature: React.FC = () => {
  const { state, actions } = useReports();

  const reportTabs = [
    'Xu hướng tồn kho',
    'Tồn theo nhóm',
    'Tỷ lệ sử dụng kệ',
    'Biến động tồn kho',
    'Lô sắp hết hạn',
  ];

  const getTabColor = (index: number) => {
    if (index === state.activeTab) return '#ffffff';
    const lightness = Math.max(92 - index * 3, 75);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  const getActiveTabLoading = () => {
    const { loading } = state.reportsState;
    if (state.activeTab === 0) return loading.stockTrend;
    if (state.activeTab === 1) return loading.stockByGroup;
    if (state.activeTab === 2) return loading.locationUtilization;
    if (state.activeTab === 3) return loading.inventoryMovement;
    if (state.activeTab === 4) return loading.expiringStock;
    return false;
  };

  return (
    <div className="w-full pl-75 pr-10 py-6 text-wms-text-main">
      {/* --- PAGE TITLE --- */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-gray-800">Báo cáo & Thống kê</h1>
          <p className="text-[13px] text-wms-muted mt-1">
            Phân tích dữ liệu lịch sử tồn kho và hiệu suất kho hàng
          </p>
        </div>
        <button
          onClick={actions.refreshActiveTab}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-800 rounded-xl shadow-xs transition-all text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${getActiveTabLoading() ? 'animate-spin' : ''}`} />
          Làm mới tab
        </button>
      </div>

      {/* --- Tab Navigation --- */}
      <div className="bg-transparent flex flex-col">
        <TabNavigation
          tabs={reportTabs}
          activeTabIndex={state.activeTab}
          onTabChange={actions.setActiveTab}
          getTabColor={getTabColor}
        />

        {/* Tab Body wrapper */}
        <div className="w-full bg-white rounded-r-3xl rounded-bl-3xl p-6.5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] min-h-[450px]">
          {state.activeTab === 0 && (
            <StockTrendChart
              data={state.reportsState.stockTrend}
              loading={state.reportsState.loading.stockTrend}
              products={state.products}
              filters={state.trendFilters}
              onFiltersChange={actions.setTrendFilters}
            />
          )}

          {state.activeTab === 1 && (
            <StockByGroupTable
              data={state.reportsState.stockByGroup}
              loading={state.reportsState.loading.stockByGroup}
            />
          )}

          {state.activeTab === 2 && (
            <LocationUtilizationChart
              data={state.reportsState.locationUtilization}
              loading={state.reportsState.loading.locationUtilization}
            />
          )}

          {state.activeTab === 3 && (
            <InventoryMovementTable
              data={state.reportsState.inventoryMovement}
              loading={state.reportsState.loading.inventoryMovement}
              products={state.products}
              productGroups={state.productGroups}
              filters={state.movementFilters}
              onFiltersChange={actions.setMovementFilters}
            />
          )}

          {state.activeTab === 4 && (
            <ExpiringStockTable
              data={state.reportsState.expiringStock}
              loading={state.reportsState.loading.expiringStock}
              withinDays={state.withinDays}
              onWithinDaysChange={actions.setWithinDays}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsFeature;
