import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createUser, fetchUsers, fetchDeletedUsers, updateUser } from './userThunks';
import type { CreateUserPayload, FetchUsersParams, User } from './userTypes';
import { toast } from 'react-toastify';

export const useUserManagement = () => {
  const dispatch = useAppDispatch();
  const { users, meta, deletedUsers, deletedMeta, loading } = useAppSelector(
    (state) => state.users
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tabIndex, setTabIndex] = useState<number>(0);

  const [queryParams, setQueryParams] = useState<FetchUsersParams>({
    page: 1,
    size: 10,
    keyword: '',
    role: '',
  });

  useEffect(() => {
    if (tabIndex === 0) {
      dispatch(fetchUsers(queryParams));
    } else {
      dispatch(fetchDeletedUsers(queryParams));
    }
  }, [dispatch, queryParams, tabIndex]);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    setQueryParams({
      page: 1,
      size: 10,
      keyword: '',
      role: '',
    });
  };

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
    try {
      await dispatch(createUser(userData)).unwrap();
      setIsAddModalOpen(false);
      toast.success('Thêm người dùng thành công!');

      // Reload user list by resetting to page 1
      setQueryParams({
        page: 1,
        size: 10,
        keyword: '',
        role: '',
      });
    } catch (error) {
      console.error('Failed to save new user:', error);
      toast.error(typeof error === 'string' ? error : 'Có lỗi xảy ra khi thêm người dùng.');
    }
  };

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveEditUser = async (id: number, userData: CreateUserPayload) => {
    try {
      await dispatch(updateUser({ id, userData })).unwrap();
      setIsEditModalOpen(false);
      setSelectedUser(null);
      toast.success('Cập nhật người dùng thành công!');
      // Refresh current page
      if (tabIndex === 0) {
        dispatch(fetchUsers(queryParams));
      } else {
        dispatch(fetchDeletedUsers(queryParams));
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error(typeof error === 'string' ? error : 'Có lỗi xảy ra khi cập nhật người dùng.');
    }
  };

  return {
    state: {
      users,
      meta,
      deletedUsers,
      deletedMeta,
      loading,
      isAddModalOpen,
      isEditModalOpen,
      selectedUser,
      tabIndex,
      queryParams,
    },
    actions: {
      setTabIndex: handleTabChange,
      setIsAddModalOpen,
      setIsEditModalOpen,
      setSelectedUser,
      handleSearch,
      handlePageChange,
      handleSaveNewUser,
      handleOpenEditModal,
      handleSaveEditUser,
    },
  };
};
