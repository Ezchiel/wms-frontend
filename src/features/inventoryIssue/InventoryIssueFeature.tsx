import React from 'react';
import TabNavigation from '../../components/TabNavigation';
import Pagination from '../../components/Pagination';
import FilterInventoryIssue from './components/FilterInventoryIssue';
import InventoryIssueTable from './components/InventoryIssueTable';
import AddIssueModal from './components/AddIssueModal';
import IssueDetailModal from './components/IssueDetailModal';
import { useInventoryIssue } from './useInventoryIssue';

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
      {/* --- PAGE TITLE --- */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.25">Inventory Issue</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">
          Inventory issue management for Admin and Manager
        </p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <TabNavigation
          tabs={['All Issues', 'Draft', 'Approved', 'Picking', 'Completed', 'Cancelled']}
          activeTabIndex={state.tabIndex}
          onTabChange={actions.handleTabChange}
          getTabColor={getTabColor}
        />

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
