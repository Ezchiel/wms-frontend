import React from 'react';
import TabNavigation from '../../components/TabNavigation';
import Pagination from '../../components/Pagination';
import FilterInventoryIssue from './components/FilterInventoryIssue';
import InventoryIssueTable from './components/InventoryIssueTable';
import AddIssueModal from './components/AddIssueModal';
import IssueDetailModal from './components/IssueDetailModal';
import { useInventoryIssue } from './useInventoryIssue';
import { RefreshCw } from 'lucide-react';

export const InventoryIssueFeature: React.FC = () => {
  const { state, actions } = useInventoryIssue();

  const getTabColor = (index: number) => {
    if (index === state.tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  const customers = state.partners.filter((p) => p.type === 'CUSTOMER');

  return (
    <div className="w-full pl-75 pr-10">

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <div className='flex justify-between'>
          <TabNavigation
            tabs={['All Issues', 'Draft', 'Approved', 'Picking', 'Completed', 'Cancelled']}
            activeTabIndex={state.tabIndex}
            onTabChange={actions.handleTabChange}
            getTabColor={getTabColor}
          />

          <div className='flex items-center'>
            <button
              onClick={actions.handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-800 rounded-xl shadow-xs transition-all text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${state.loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterInventoryIssue
            onActionClick={() => actions.setIsModalOpen(true)}
            onSearch={actions.handleSearch}
          />

          {state.loading ? (
            <div className="py-10 text-center text-wms-muted text-[13px]">Loading data...</div>
          ) : (
            <>
              <InventoryIssueTable
                heads={['Issue Code', 'Customer', 'Issue Date', 'Lines', 'Assigned To', 'Status', 'Actions']}
                data={state.issues}
                onViewDetail={actions.handleOpenDetail}
              />

              <Pagination meta={state.meta} onPageChange={actions.setCurrentPage} />
            </>
          )}
        </div>
      </div>

      {/* --- CREATE MODAL --- */}
      <AddIssueModal
        isOpen={state.isModalOpen}
        customers={customers}
        products={state.products}
        onClose={() => actions.setIsModalOpen(false)}
        onSave={actions.handleCreate}
      />

      {/* --- DETAIL MODAL --- */}
      <IssueDetailModal
        isOpen={state.isDetailModalOpen}
        issue={state.selectedIssue}
        actionLoading={state.actionLoading}
        onClose={() => {
          actions.setIsDetailModalOpen(false);
        }}
        onApprove={actions.handleApprove}
        onCancel={actions.handleCancel}
      />
    </div>
  );
};

export default InventoryIssueFeature;
