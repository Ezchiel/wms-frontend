import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchInventoryChecks, confirmInventoryCheck } from './inventoryCheckThunks';
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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedCheck, setSelectedCheck] = useState<InventoryCheck | null>(null);

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

  const handleRefresh = () => {
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

  const handleOpenDetailModal = (check: InventoryCheck) => {
    setSelectedCheck(check);
    setIsDetailModalOpen(true);
  };

  const handleConfirm = async (id: number) => {
    const result = await dispatch(confirmInventoryCheck(id));
    if (confirmInventoryCheck.fulfilled.match(result)) {
      // Update selectedCheck với data mới nhất từ server
      setSelectedCheck(result.payload.data);
      handleConfirmSuccess();
    }
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
      isDetailModalOpen,
      currentPage,
      selectedCheck,
    },
    actions: {
      setTabIndex,
      handleTabChange,
      setCurrentPage,
      handleSearch,
      handleRefresh,
      handleOpenDetailModal,
      setIsDetailModalOpen,
      setSelectedCheck,
      handleConfirmSuccess,
      handleConfirm,
    },
  };
};