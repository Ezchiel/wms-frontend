import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAllPartners } from '../partners/partnerThunks';
import { fetchAllProducts } from '../products/productThunks';
import { fetchAvailableLocations } from '../storageLocation/storageLocationThunks';
import { confirmReceipt, createReceipt, fetchReceipts } from './inventoryReceiptThunks';
import {
  TAB_STATUS_MAP,
  type InventoryReceipt,
  type InventoryReceiptPayload,
} from './inventoryReceiptTypes';

export const useInventoryReceipt = () => {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { receipts, loading, meta } = useAppSelector((state) => state.inventoryReceipts);
  const { products } = useAppSelector((state) => state.products);
  const { partners } = useAppSelector((state) => state.partners);

  // State for search and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Local State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedReceipt, setSelectedReceipt] = useState<InventoryReceipt | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    dispatch(
      fetchReceipts({
        keyword: searchKeyword,
        page: currentPage,
        size: pageSize,
        status: TAB_STATUS_MAP[tabIndex],
      })
    );
    dispatch(fetchAllProducts());
    dispatch(fetchAllPartners());
    dispatch(fetchAvailableLocations());
  }, [currentPage, dispatch, pageSize, searchKeyword, tabIndex]);

  // Tab change handler
  const handleTabChange = (index: number) => {
    setTabIndex(index);
    setCurrentPage(1);
    setSearchKeyword('');
  };

  // Search handler
  const handleSearch = (keyword: string) => {
    setCurrentPage(1);
    setSearchKeyword(keyword);
  };

  // Create receipt handler
  const handleCreateReceipt = async (data: InventoryReceiptPayload) => {
    try {
      await dispatch(createReceipt(data)).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create receipt:', error);
    }
  };

  // Confirm receipt handler
  const handleConfirm = (id: number) => {
    if (
      window.confirm(
        'Bạn có chắc chắn muốn xác nhận nhập kho cho phiếu này? Hệ thống sẽ tự động tăng tồn kho tương ứng.'
      )
    ) {
      dispatch(confirmReceipt(id));
      setIsDetailModalOpen(false);
      setSelectedReceipt(null);
    }
  };

  return {
    state: {
      loading,
      meta,
      products,
      partners,
      isModalOpen,
      tabIndex,
      selectedReceipt,
      isDetailModalOpen,
      receipts,
    },
    actions: {
      setCurrentPage,
      handleSearch,
      handleTabChange,
      setIsModalOpen,
      setSelectedReceipt,
      setIsDetailModalOpen,
      handleCreateReceipt,
      handleConfirm,
    },
  };
};
