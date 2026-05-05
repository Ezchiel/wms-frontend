import React from 'react';
import Pagination from '../../components/Pagination';
import TabNavigation from '../../components/TabNavigation';
import AddProductGroupModal from './components/AddProductGroupModal';
import FilterProductGroup from './components/FilterProductGroup';
import ProductGroupTable from './components/ProductGroupTable';
import { useProductGroupManagement } from './useProductGroup';

export const ProductGroupManagementFeature: React.FC = () => {
  const { state, actions } = useProductGroupManagement();

  const getTabColor = (index: number) => {
    if (index === state.tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">
      {/* --- PAGE TITLE --- */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.25">Product group management</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">
          Product group management for administrator and manager
        </p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <TabNavigation
          tabs={['All groups']}
          activeTabIndex={state.tabIndex}
          onTabChange={actions.setTabIndex}
          getTabColor={getTabColor}
        />

        {/* Table section */}
        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterProductGroup
            onSearch={actions.handleSearch}
            onActionClick={actions.handleOpenAddModal}
          />

          {state.loading ? (
            <div className="py-10 text-center">Loading data...</div>
          ) : (
            <>
              <ProductGroupTable
                tableHeads={['Group code', 'Group name', 'Description', 'Actions']}
                data={state.productGroups}
                onEdit={actions.handleOpenEditModal}
                onDelete={actions.handleDelete}
              />

              {/* Pagination */}
              <Pagination meta={state.meta} onPageChange={actions.setCurrentPage} />
            </>
          )}
        </div>
      </div>

      <AddProductGroupModal
        key={state.editingGroup?.id || 'new'}
        isOpen={state.isAddModalOpen}
        initialData={state.editingGroup}
        onClose={() => {
          actions.setIsAddModalOpen(false);
          actions.setEditingGroup(null);
        }}
        onSave={actions.handleSave}
      />
    </div>
  );
};
