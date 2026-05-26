import React from 'react';
import Pagination from '../../components/Pagination';
import TabNavigation from '../../components/TabNavigation';
import FilterInventoryCheck from './components/FilterInventoryCheck';
import InventoryCheckTable from './components/InventoryCheckTable';
import InventoryCheckDetailModal from './components/InventoryCheckDetailModal';
import CreateCheckModal from './components/CreateCheckModal';
import { useInventoryCheck } from './useInventoryCheck';

const InventoryCheckFeature: React.FC = () => {
  const { state, actions } = useInventoryCheck();

  const getTabColor = (index: number) => {
    if (index === state.tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">
      {/* --- PAGE TITLE --- */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.25">Inventory check management</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">
          Inventory check management for administrator and manager
        </p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <TabNavigation
          tabs={['All checks', 'Pending', 'Completed', 'Cancelled']}
          activeTabIndex={state.tabIndex}
          onTabChange={actions.handleTabChange}
          getTabColor={getTabColor}
        />

        {/* Table section */}
        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterInventoryCheck
            onSearch={actions.handleSearch}
            onActionClick={actions.handleOpenCreateModal}
          />

          {state.loading ? (
            <div className="py-10 text-center text-wms-muted text-[13px]">Loading data...</div>
          ) : (
            <>
              <InventoryCheckTable
                heads={[
                  'Check Code',
                  'Date Created',
                  'Status',
                  'Created By',
                  'Lines Count',
                  'Notes',
                  'Actions',
                ]}
                data={state.checks}
                onViewDetail={actions.handleOpenDetailModal}
              />

              {/* Pagination */}
              <Pagination meta={state.meta} onPageChange={actions.setCurrentPage} />
            </>
          )}
        </div>
      </div>

      {state.isDetailModalOpen && (
        <InventoryCheckDetailModal
          onClose={() => actions.setIsDetailModalOpen(false)}
          onConfirmSuccess={actions.handleConfirmSuccess}
        />
      )}

      {state.isModalOpen && (
        <CreateCheckModal
          onClose={() => actions.setIsModalOpen(false)}
          onSuccess={actions.handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default InventoryCheckFeature;

