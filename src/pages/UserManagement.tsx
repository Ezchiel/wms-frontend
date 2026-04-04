import React, { useEffect, useState } from 'react';
import DataTable from '../components/features/DataTable';
import FilterTable from '../components/features/FilterTable';
import Pagination from '../components/features/Pagination';
import TabNavigation from '../components/features/TabNavigation';
import AddUserModal from '../components/features/userManagement/AddUserModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { CreateUserPayload, FetchUsersParams } from '../store/slices/userSlices';
import { createUser, fetchUsers } from '../store/slices/userSlices';

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, meta, loading } = useAppSelector((state) => state.users);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [queryParams, setQueryParams] = useState<FetchUsersParams>({
    page: 1,
    size: 10,
    keyword: '',
    role: '',
  });

  const tabs = ['All users', 'Deleted'];
  const tableHeads = ['User name', 'Full name', 'Role', 'Email', 'Status', 'Action'];
  const [tabIndex, setTabIndex] = useState<number>(0);

  useEffect(() => {
    dispatch(fetchUsers(queryParams));
  }, [dispatch, queryParams]);

  const handleSearch = (filters: { keyword?: string; role?: string }) => {
    setQueryParams((prev) => ({
      ...prev,
      ...filters,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleSaveNewUser = async (userData: CreateUserPayload) => {
    await dispatch(createUser(userData)).unwrap();

    setIsAddModalOpen(false);

    alert('Thêm người dùng thành công!');

    // Reload user list
    setQueryParams((prev) => ({ ...prev, page: 1 }));
    dispatch(fetchUsers({ ...queryParams, page: 1 }));
  };

  const handleTabChange = (newIndex: number) => {
    setTabIndex(newIndex);
  };

  const getTabColor = (index: number) => {
    if (index === tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="px-10 ml-65">
      {/* --- PAGE TITLE --- */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.25">User management</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">
          User management for administrator and manager
        </p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col">
        <TabNavigation
          tabs={tabs}
          getTabColor={getTabColor}
          onTabChange={handleTabChange}
          activeTabIndex={tabIndex}
        />
        {/* Table section */}
        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
          {tabIndex === 0 ? (
            <>
              <FilterTable
                onSearch={handleSearch}
                actionButtonText="Add new user"
                actionButtonIcon="fa-solid fa-user-plus"
                onActionClick={() => setIsAddModalOpen(true)}
              />

              {loading ? (
                <div className="py-10 text-center">Đang tải dữ liệu...</div>
              ) : (
                <DataTable tableHeads={tableHeads} users={users} />
              )}

              <Pagination meta={meta} onPageChange={handlePageChange} />
            </>
          ) : (
            <>
              <FilterTable
                onSearch={handleSearch}
                actionButtonText="Restore user"
                actionButtonIcon="fa-solid fa-trash-can-arrow-up"
                onActionClick={() => console.log('Mở modal restore')}
              />

              <div className="py-10 text-center">Đang tải dữ liệu...</div>

              <Pagination meta={meta} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewUser}
      />
    </div>
  );
};

export default UserManagement;
