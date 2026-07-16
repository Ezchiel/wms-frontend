// src/store/slices/ProductManagementFeature.tsx
import React from 'react';
import Pagination from '../../components/Pagination';
import TabNavigation from '../../components/TabNavigation';
import AddProductModal from './components/AddProductModal';
import FilterProduct from './components/FilterProduct';
import ProductTable from './components/ProductTable';
import { useProductManagement } from './useProduct';
import { StatCard } from '../../components/StatCard';
import { Package, AlertTriangle, Layers, RefreshCw } from 'lucide-react';

export const ProductManagementFeature: React.FC = () => {
  const { state, actions } = useProductManagement();

  const getTabColor = (index: number) => {
    if (index === state.tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          label="Tổng số sản phẩm"
          value={state.meta?.totalElements || state.products.length}
          icon={Package}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          hint="Sản phẩm lưu trong hệ thống"
        />
        <StatCard
          label="Dưới tồn tối thiểu"
          value={state.lowStockAlerts.length}
          icon={AlertTriangle}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          hint="Cần nhập thêm hàng"
        />
        <StatCard
          label="Nhóm sản phẩm"
          value={state.productGroups.length}
          icon={Layers}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          hint="Các nhóm phân loại hàng"
        />
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <div className='flex justify-between'>
          <TabNavigation
            tabs={['All products']}
            activeTabIndex={state.tabIndex}
            onTabChange={actions.setTabIndex}
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
