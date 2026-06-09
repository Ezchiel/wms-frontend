import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAllPartners } from '../partners/partnerThunks';
import { fetchAllProducts } from '../products/productThunks';
import { fetchStorageLocations } from '../storageLocation/storageLocationThunks';
import {
  approveInventoryIssue,
  cancelInventoryIssue,
  confirmInventoryIssue,
  createInventoryIssue,
  fetchInventoryIssues,
} from './inventoryIssueThunks';
import { setSelectedIssue } from './inventoryIssueSlice';
import {
  TAB_STATUS_MAP,
  type CreateIssuePayload,
  type InventoryIssue,
} from './inventoryIssueTypes';

export const useInventoryIssue = () => {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { issues, selectedIssue, loading, actionLoading, error, meta } = useAppSelector(
    (state) => state.inventoryIssues
  );
  const { products } = useAppSelector((state) => state.products);
  const { partners } = useAppSelector((state) => state.partners);
  const { storageLocations } = useAppSelector((state) => state.storageLocations);

  // State for search and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [tabIndex, setTabIndex] = useState(0);

  // Modal Open states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch initial data & handle filtering / pagination
  useEffect(() => {
    dispatch(
      fetchInventoryIssues({
        keyword: searchKeyword,
        page: currentPage,
        size: pageSize,
        status: TAB_STATUS_MAP[tabIndex],
      })
    );
    dispatch(fetchAllProducts());
    dispatch(fetchAllPartners());
    dispatch(fetchStorageLocations({ size: 10000 }));
  }, [currentPage, dispatch, pageSize, searchKeyword, tabIndex]);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    setCurrentPage(1);
    setSearchKeyword('');
  };

  const handleSearch = (keyword: string) => {
    setCurrentPage(1);
    setSearchKeyword(keyword);
  };

  const handleOpenDetail = (issue: InventoryIssue) => {
    dispatch(setSelectedIssue(issue));
    setIsDetailModalOpen(true);
  };

  const handleCreate = async (payload: CreateIssuePayload) => {
    try {
      await dispatch(createInventoryIssue(payload)).unwrap();
      setIsModalOpen(false);
      // Refetch current list
      dispatch(
        fetchInventoryIssues({
          keyword: searchKeyword,
          page: currentPage,
          size: pageSize,
          status: TAB_STATUS_MAP[tabIndex],
        })
      );
    } catch (err: unknown) {
      alert(err || 'Failed to create inventory issue');
      throw err;
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await dispatch(approveInventoryIssue(id)).unwrap();
    } catch (err: unknown) {
      alert(err || 'Failed to approve inventory issue');
    }
  };

  const handleConfirm = async (id: number) => {
    if (
      window.confirm(
        'Bạn có chắc chắn muốn xác nhận xuất kho cho phiếu này? Hệ thống sẽ tự động giảm tồn kho tương ứng.'
      )
    ) {
      try {
        await dispatch(confirmInventoryIssue(id)).unwrap();
      } catch (err: unknown) {
        alert(err || 'Failed to confirm inventory issue');
      }
    }
  };

  const handleCancel = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn huỷ phiếu xuất kho này?')) {
      try {
        await dispatch(cancelInventoryIssue(id)).unwrap();
      } catch (err: unknown) {
        alert(err || 'Failed to cancel inventory issue');
      }
    }
  };

  return {
    state: {
      issues,
      selectedIssue,
      loading,
      actionLoading,
      error,
      meta,
      products,
      partners,
      storageLocations,
      tabIndex,
      currentPage,
      searchKeyword,
      isModalOpen,
      isDetailModalOpen,
    },
    actions: {
      setCurrentPage,
      handleTabChange,
      handleSearch,
      handleOpenDetail,
      handleCreate,
      handleApprove,
      handleConfirm,
      handleCancel,
      setIsModalOpen,
      setIsDetailModalOpen,
    },
  };
};
export default useInventoryIssue;
