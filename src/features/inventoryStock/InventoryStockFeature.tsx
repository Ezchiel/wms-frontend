import React from 'react';
import TabNavigation from '../../components/TabNavigation';
import FilterInventoryStock from './components/FilterInventoryStock';
import InventoryStockTable from './components/InventoryStockTable';
import { useInventoryStock } from './useInventoryStock';

export const InventoryStockFeature: React.FC = () => {
  const { state, actions } = useInventoryStock();

  const tableHeads = [
    'Product name',
    'Location',
    'Quantity',
    'Batch No',
    'Expiry Date',
    'Serial Number',
  ];

  const getTabColor = (index: number) => {
    if (index === state.tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">
      {/* --- PAGE TITLE --- */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.25">Inventory Stock Management</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">
          View warehouse inventory, locations, and quantities
        </p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <TabNavigation
          tabs={['All stocks', 'Low stock alerts']}
          activeTabIndex={state.tabIndex}
          onTabChange={actions.setTabIndex}
          getTabColor={getTabColor}
        />

        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterInventoryStock />

          {state.isLoading ? (
            <div className="py-10 text-center">Loading data...</div>
          ) : (
            <InventoryStockTable
              heads={tableHeads}
              data={state.stocks}
              locations={state.storageLocations}
            />
          )}
        </div>
      </div>
    </div>
  );
};
