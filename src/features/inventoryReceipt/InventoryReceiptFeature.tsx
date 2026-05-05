import React from 'react';
import TabNavigation from '../../components/TabNavigation';
import type { Partner } from '../partners/partnerTypes';
import AddReceiptModal from './components/AddReceiptModal';
import FilterInventoryReceipt from './components/FilterInventoryReceipt';
import InventoryReceiptTable from './components/InventoryReceiptTable';
import ReceiptDetailModal from './components/ReceiptDetailModal';
import { useInventoryReceipt } from './useInventoryReceipt';

export const InventoryReceiptFeature: React.FC = () => {
  const { state, actions } = useInventoryReceipt();

  const getTabColor = (index: number) => {
    if (index === state.tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">
      {/* --- PAGE TITLE --- */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.25">Inventory Receipt</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">
          Inventory receipt management for Admin and Manager
        </p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <TabNavigation
          tabs={['All Receipts', 'Expected', 'Receiving', 'Putaway']}
          activeTabIndex={state.tabIndex}
          onTabChange={actions.setTabIndex}
          getTabColor={getTabColor}
        />

        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterInventoryReceipt onActionClick={() => actions.setIsModalOpen(true)} />

          {state.loading ? (
            <div className="py-10 text-center text-wms-muted text-[13px]">Loading data...</div>
          ) : (
            <InventoryReceiptTable
              heads={[
                'Receipt Code',
                'Supplier',
                'Date Created',
                'Total Amount',
                'Status',
                'Actions',
              ]}
              data={state.filteredData}
              onViewDetail={(receipt) => {
                actions.setSelectedReceipt(receipt);
                actions.setIsDetailModalOpen(true);
              }}
            />
          )}
        </div>
      </div>

      {/* --- MODAL --- */}
      <AddReceiptModal
        isOpen={state.isModalOpen}
        suppliers={state.partners.filter((p: Partner) => p.type === 'SUPPLIER')}
        products={state.products}
        onClose={() => actions.setIsModalOpen(false)}
        onSave={actions.handleCreateReceipt}
      />
      <ReceiptDetailModal
        isOpen={state.isDetailModalOpen}
        receipt={state.selectedReceipt}
        onClose={() => {
          actions.setIsDetailModalOpen(false);
          actions.setSelectedReceipt(null);
        }}
        onConfirm={actions.handleConfirm}
      />
    </div>
  );
};
