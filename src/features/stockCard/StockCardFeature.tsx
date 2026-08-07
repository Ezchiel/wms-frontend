import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import TabNavigation from '../../components/TabNavigation';
import { useStockCard } from './useStockCard';
import ProductSelector from './components/ProductSelector';
import LocationFilter from './components/LocationFilter';
import StockCardTransactionTable from './components/StockCardTransactionTable';

export const StockCardFeature: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialProductId = searchParams.get('productId')
    ? Number(searchParams.get('productId'))
    : undefined;

  const { state, actions } = useStockCard(initialProductId);

  // Keep URL in sync when product is selected
  const handleSelectProduct = (productId: number | null) => {
    actions.setSelectedProductId(productId);
    if (productId) {
      setSearchParams({ productId: String(productId) });
    } else {
      setSearchParams({});
    }
  };

  const getTabColor = (index: number) => {
    if (index === tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">
      <div className="bg-transparent flex flex-col overflow-x-auto">

        <div className="flex justify-between">
          <TabNavigation
            tabs={['Stock cards']}
            activeTabIndex={tabIndex}
            onTabChange={setTabIndex}
            getTabColor={getTabColor}
          />

          <div className="flex items-center">
            <button
              onClick={actions.handleRefresh}
              disabled={!state.selectedProductId || state.loading}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-800 rounded-xl shadow-xs transition-all text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              id="stock-card-refresh-btn"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${state.loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Main card */}
        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-4 mb-6 pb-5 border-b border-wms-border-color">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-wms-muted uppercase tracking-wide">
                Product
              </label>
              <ProductSelector
                selectedProductId={state.selectedProductId}
                onSelect={handleSelectProduct}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-wms-muted uppercase tracking-wide">
                Filter by location
              </label>
              <LocationFilter
                selectedLocationId={state.selectedLocationId}
                onSelect={actions.setSelectedLocationId}
                disabled={!state.selectedProductId}
              />
            </div>

            {/* Summary badge */}
            {state.transactions.length > 0 && (
              <div className="ml-auto flex items-center gap-1.5 text-[12px] text-wms-muted font-medium">
                <span className="font-bold text-wms-text-main">{state.transactions.length}</span>
                transaction{state.transactions.length !== 1 ? 's' : ''} found
              </div>
            )}
          </div>

          {/* Error state */}
          {state.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-700 font-medium">
              {state.error}
            </div>
          )}

          {/* Loading / Table */}
          {state.loading ? (
            <div className="py-10 text-center text-wms-muted text-[13px]">
              Loading transaction history...
            </div>
          ) : (
            <StockCardTransactionTable
              data={state.transactions}
              hasSelectedProduct={!!state.selectedProductId}
            />
          )}
        </div>
      </div>
    </div>
  );
};
