import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createUser, fetchUsers } from './userThunks';
import type { CreateUserPayload, FetchUsersParams } from './userTypes';

export const useUserManagement = () => {
  const dispatch = useAppDispatch();
  const { users, meta, loading } = useAppSelector((state) => state.users);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState<number>(0);

  const [queryParams, setQueryParams] = useState<FetchUsersParams>({
    page: 1,
    size: 10,
    keyword: '',
    role: '',
  });

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
    try {
      await dispatch(createUser(userData)).unwrap();
      setIsAddModalOpen(false);
      alert('Thêm người dùng thành công!');

      // Reload user list by resetting to page 1
      const newParams = { ...queryParams, page: 1 };
      setQueryParams(newParams);
      dispatch(fetchUsers(newParams));
    } catch (error) {
      console.error('Failed to save new user:', error);
      alert('Có lỗi xảy ra khi thêm người dùng.');
    }
  };

  return {
    state: {
      users,
      meta,
      loading,
      isAddModalOpen,
      tabIndex,
    },
    actions: {
      setTabIndex,
      setIsAddModalOpen,
      handleSearch,
      handlePageChange,
      handleSaveNewUser,
    },
  };
};
