import React from 'react';
import Pagination from '../../components/Pagination';
import TabNavigation from '../../components/TabNavigation';
import AddUserModal from './components/AddUserModal';
import EditUserModal from './components/EditUserModal';
import DataTable from './components/DataTable';
import FilterTable from './components/FilterTable';
import { useUserManagement } from './useUser';
import { StatCard } from '../../components/StatCard';
import { Users, UserCheck, ShieldAlert, RefreshCw } from 'lucide-react';

export const UserManagementFeature: React.FC = () => {
  const { state, actions } = useUserManagement();

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
          label="Total users"
          value={state.meta?.totalElements || state.users.length}
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          hint="Total users in system"
        />
        <StatCard
          label="Active users"
          value={state.users.filter((u) => u.status === 'ACTIVE').length}
          icon={UserCheck}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          hint="Active users in this page"
        />
        <StatCard
          label="Admins & Managers"
          value={state.users.filter((u) => {
            const role = u.roleName?.toUpperCase();
            return role === 'ADMIN' || role === 'MANAGER';
          }).length}
          icon={ShieldAlert}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          hint="Admin & Manager in this page"
        />
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <div className='flex justify-between'>
          <TabNavigation
            tabs={['All users', 'Deleted']}
            getTabColor={getTabColor}
            onTabChange={actions.setTabIndex}
            activeTabIndex={state.tabIndex}
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
          {state.tabIndex === 0 ? (
            <>
              <FilterTable
                onSearch={actions.handleSearch}
                actionButtonText="Add new user"
                actionButtonIcon="fa-solid fa-user-plus"
                onActionClick={() => actions.setIsAddModalOpen(true)}
              />

              {state.loading ? (
                <div className="py-10 text-center text-wms-muted">Đang tải dữ liệu...</div>
              ) : (
                <DataTable
                  tableHeads={['User name', 'Full name', 'Role', 'Email', 'Status', 'Action']}
                  users={state.users}
                  onEdit={actions.handleOpenEditModal}
                />
              )}

              <Pagination meta={state.meta} onPageChange={actions.handlePageChange} />
            </>
          ) : (
            // Tab: Deleted
            <>
              <FilterTable
                onSearch={actions.handleSearch}
              />

              {state.loading ? (
                <div className="py-10 text-center text-wms-muted">Đang tải dữ liệu...</div>
              ) : (
                <DataTable
                  tableHeads={['User name', 'Full name', 'Role', 'Email', 'Status', 'Action']}
                  users={state.deletedUsers}
                />
              )}

              <Pagination meta={state.deletedMeta} onPageChange={actions.handlePageChange} />
            </>
          )}
        </div>
      </div>

      <AddUserModal
        isOpen={state.isAddModalOpen}
        onClose={() => actions.setIsAddModalOpen(false)}
        onSave={actions.handleSaveNewUser}
      />

      <EditUserModal
        isOpen={state.isEditModalOpen}
        onClose={() => actions.setIsEditModalOpen(false)}
        user={state.selectedUser}
        onSave={actions.handleSaveEditUser}
      />
    </div>
  );
};
