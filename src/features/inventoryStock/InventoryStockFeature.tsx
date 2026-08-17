import React from 'react';
import TabNavigation from '../../components/TabNavigation';
import Pagination from '../../components/Pagination';
import FilterInventoryStock from './components/FilterInventoryStock';
import InventoryStockTable from './components/InventoryStockTable';
import { useInventoryStock } from './useInventoryStock';
import { RefreshCw } from 'lucide-react';

export const InventoryStockFeature: React.FC = () => {
  const { state, actions } = useInventoryStock();

  const tableHeads = [
    'Product name',
    'Location',
    'Quantity',
    'Batch No',
    'Expiry Date',
    'Serial Number',
    'Actions',
  ];

  const getTabColor = (index: number) => {
    if (index === state.tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <div className='flex justify-between'>
          <TabNavigation
            tabs={['All stocks']}
            activeTabIndex={state.tabIndex}
            onTabChange={actions.setTabIndex}
            getTabColor={getTabColor}
          />

          <div className='flex items-center'>
            <button
              onClick={actions.handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-800 rounded-xl shadow-xs transition-all text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${state.isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterInventoryStock />

          {state.isLoading ? (
            <div className="py-10 text-center">Loading data...</div>
          ) : (
            <>
              <InventoryStockTable
                heads={tableHeads}
                data={state.stocks}
                locations={state.storageLocations}
              />
              <Pagination meta={state.meta} onPageChange={actions.setCurrentPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
