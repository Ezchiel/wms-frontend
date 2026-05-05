import React from 'react';
import Pagination from '../../components/Pagination';
import TabNavigation from '../../components/TabNavigation';
import AddPartnerModal from './components/AddPartnerModal';
import FilterPartner from './components/FilterPartner';
import PartnerTable from './components/PartnerTable';
import { usePartnerManagement } from './usePartner';

export const PartnerManagementFeature: React.FC = () => {
  const { state, actions } = usePartnerManagement();

  const getTabColor = (index: number) => {
    if (index === state.tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">
      {/* --- PAGE TITLE --- */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.25">Partner management</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">Manage your suppliers and customers</p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <TabNavigation
          tabs={['All partners', 'Suppliers', 'Customers']}
          activeTabIndex={state.tabIndex}
          onTabChange={actions.handleTabChange}
          getTabColor={getTabColor}
        />

        {/* Table section */}
        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterPartner
            onActionClick={actions.handleOpenAddModal}
            onSearch={actions.handleSearch}
          />

          {state.loading ? (
            <div className="py-10 text-center">Loading data...</div>
          ) : (
            <>
              <PartnerTable
                heads={['Name', 'Type', 'Phone', 'Email', 'Tax Code', 'Address', 'Actions']}
                data={state.partners}
                onEdit={actions.handleOpenEditModal}
                onDelete={actions.handleDelete}
              />

              {/* Pagination */}
              <Pagination meta={state.meta} onPageChange={actions.setCurrentPage} />
            </>
          )}
        </div>
      </div>

      <AddPartnerModal
        key={state.editingPartner?.id || 'new_partner'}
        isOpen={state.isModalOpen}
        initialData={state.editingPartner}
        onClose={() => {
          actions.setIsModalOpen(false);
          actions.setEditingPartner(null);
        }}
        onSave={actions.handleSave}
      />
    </div>
  );
};
