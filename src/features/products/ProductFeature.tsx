// src/store/slices/ProductManagementFeature.tsx
import React from 'react';
import Pagination from '../../components/Pagination';
import TabNavigation from '../../components/TabNavigation';
import AddProductModal from './components/AddProductModal';
import FilterProduct from './components/FilterProduct';
import ProductTable from './components/ProductTable';
import { useProductManagement } from './useProduct';

export const ProductManagementFeature: React.FC = () => {
  const { state, actions } = useProductManagement();

  const getTabColor = (index: number) => {
    if (index === state.tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">
      {/* --- PAGE TITLE --- */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.25">Product management</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">
          Product management for administrator and manager
        </p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <TabNavigation
          tabs={['All products']}
          activeTabIndex={state.tabIndex}
          onTabChange={actions.setTabIndex}
          getTabColor={getTabColor}
        />

        {/* Table section */}
        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterProduct
            onActionClick={actions.handleOpenAddModal}
            onSearch={actions.handleSearch}
          />

          {state.loading ? (
            <div className="py-10 text-center">Loading data...</div>
          ) : (
            <>
              <ProductTable
                heads={[
                  'Product code',
                  'Product name',
                  'Unit',
                  'Group',
                  'Min stock level',
                  'Actions',
                ]}
                data={state.products}
                onEdit={actions.handleOpenEditModal}
                onDelete={actions.handleDelete}
              />

              {/* Pagination */}
              <Pagination meta={state.meta} onPageChange={actions.setCurrentPage} />
            </>
          )}
        </div>
      </div>

      <AddProductModal
        key={state.editingProduct?.id || 'new_product'}
        isOpen={state.isModalOpen}
        groups={state.productGroups}
        initialData={state.editingProduct}
        onClose={() => {
          actions.setIsModalOpen(false);
          actions.setEditingProduct(null);
        }}
        onSave={actions.handleSave}
      />
    </div>
  );
};
