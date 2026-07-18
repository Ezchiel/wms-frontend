import React from 'react';
import Pagination from '../../components/Pagination';
import TabNavigation from '../../components/TabNavigation';
import AddPartnerModal from './components/AddPartnerModal';
import FilterPartner from './components/FilterPartner';
import PartnerTable from './components/PartnerTable';
import { usePartnerManagement } from './usePartner';
import { StatCard } from '../../components/StatCard';
import { Handshake, Truck, Users, RefreshCw } from 'lucide-react';

export const PartnerManagementFeature: React.FC = () => {
  const { state, actions } = usePartnerManagement();

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
          label="Total partners"
          value={state.meta?.totalElements || state.partners.length}
          icon={Handshake}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          hint="Suppliers & Customers"
        />
        <StatCard
          label="Suppliers"
          value={state.partners.filter((p) => p.type === 'SUPPLIER').length}
          icon={Truck}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          hint="Suppliers in this page"
        />
        <StatCard
          label="Customers"
          value={state.partners.filter((p) => p.type === 'CUSTOMER').length}
          icon={Users}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          hint="Customers in this page"
        />
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <div className='flex justify-between'>
          <TabNavigation
            tabs={['All partners', 'Suppliers', 'Customers']}
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
