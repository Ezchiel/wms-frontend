import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchInventoryChecks } from './inventoryCheckThunks';
import { setSelectedCheck } from './inventoryCheckSlice';
import type { InventoryCheck, CheckStatus } from './inventoryCheckTypes';

const TAB_STATUS_MAP: Record<number, CheckStatus | ''> = {
  0: '',
  1: 'PENDING',
  2: 'COMPLETED',
  3: 'CANCELLED',
};

export const useInventoryCheck = () => {
  const dispatch = useAppDispatch();
  const { checks, loading, meta } = useAppSelector((state) => state.inventoryCheck);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    dispatch(
      fetchInventoryChecks({
        keyword: searchKeyword,
        status: TAB_STATUS_MAP[tabIndex],
        page: currentPage,
        size: pageSize,
        sortBy: 'id',
        sortDir: 'desc',
      })
    );
  }, [dispatch, currentPage, pageSize, searchKeyword, tabIndex]);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    setCurrentPage(1);
    setSearchKeyword('');
  };

  const handleSearch = (keyword: string) => {
    setCurrentPage(1);
    setSearchKeyword(keyword);
  };

  const handleOpenCreateModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenDetailModal = (check: InventoryCheck) => {
    dispatch(setSelectedCheck(check));
    setIsDetailModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    setCurrentPage(1);
    dispatch(
      fetchInventoryChecks({
        keyword: searchKeyword,
        status: TAB_STATUS_MAP[tabIndex],
        page: 1,
        size: pageSize,
        sortBy: 'id',
        sortDir: 'desc',
      })
    );
  };

  const handleConfirmSuccess = () => {
    dispatch(
      fetchInventoryChecks({
        keyword: searchKeyword,
        status: TAB_STATUS_MAP[tabIndex],
        page: currentPage,
        size: pageSize,
        sortBy: 'id',
        sortDir: 'desc',
      })
    );
  };

  return {
    state: {
      checks,
      loading,
      meta,
      tabIndex,
      isModalOpen,
      isDetailModalOpen,
      currentPage,
    },
    actions: {
      setTabIndex,
      handleTabChange,
      setCurrentPage,
      handleSearch,
      handleOpenCreateModal,
      handleOpenDetailModal,
      setIsModalOpen,
      setIsDetailModalOpen,
      handleCreateSuccess,
      handleConfirmSuccess,
    },
  };
};

