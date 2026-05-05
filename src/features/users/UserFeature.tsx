import React from 'react';
import Pagination from '../../components/Pagination';
import TabNavigation from '../../components/TabNavigation';
import AddUserModal from './components/AddUserModal';
import DataTable from './components/DataTable';
import FilterTable from './components/FilterTable';
import { useUserManagement } from './useUser';

export const UserManagementFeature: React.FC = () => {
  const { state, actions } = useUserManagement();

  const getTabColor = (index: number) => {
    if (index === state.tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">
      {/* --- PAGE TITLE --- */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.25">User management</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">
          User management for administrator and manager
        </p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <TabNavigation
          tabs={['All users', 'Deleted']}
          getTabColor={getTabColor}
          onTabChange={actions.setTabIndex}
          activeTabIndex={state.tabIndex}
        />

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
                <div className="py-10 text-center">Đang tải dữ liệu...</div>
              ) : (
                <DataTable
                  tableHeads={['User name', 'Full name', 'Role', 'Email', 'Status', 'Action']}
                  users={state.users}
                />
              )}

              <Pagination meta={state.meta} onPageChange={actions.handlePageChange} />
            </>
          ) : (
            // Tab: Deleted
            <>
              <FilterTable
                onSearch={actions.handleSearch}
                actionButtonText="Restore user"
                actionButtonIcon="fa-solid fa-trash-can-arrow-up"
                onActionClick={() => console.log('Mở modal restore')}
              />

              <div className="py-10 text-center">Đang tải dữ liệu...</div>

              <Pagination meta={state.meta} onPageChange={actions.handlePageChange} />
            </>
          )}
        </div>
      </div>

      <AddUserModal
        isOpen={state.isAddModalOpen}
        onClose={() => actions.setIsAddModalOpen(false)}
        onSave={actions.handleSaveNewUser}
      />
    </div>
  );
};
