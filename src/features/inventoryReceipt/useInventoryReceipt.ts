import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAllPartners } from '../partners/partnerThunks';
import { fetchAllProducts } from '../products/productThunks';
import { fetchAvailableLocations } from '../storageLocation/storageLocationThunks';
import { confirmReceipt, createReceipt, fetchReceipts } from './inventoryReceiptThunks';
import type { InventoryReceipt, InventoryReceiptPayload } from './inventoryReceiptTypes';

export const useInventoryReceipt = () => {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { receipts, loading } = useAppSelector((state) => state.inventoryReceipts);
  const { products } = useAppSelector((state) => state.products);
  const { partners } = useAppSelector((state) => state.partners);

  // Local State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedReceipt, setSelectedReceipt] = useState<InventoryReceipt | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchReceipts());
    dispatch(fetchAllProducts());
    dispatch(fetchAllPartners());
    dispatch(fetchAvailableLocations());
  }, [dispatch]);

  // Handlers
  const handleCreateReceipt = async (data: InventoryReceiptPayload) => {
    try {
      await dispatch(createReceipt(data)).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create receipt:', error);
    }
  };

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

  // Derived Data
  const filteredData = receipts.filter((item: InventoryReceipt) => {
    if (tabIndex === 0) return true;
    if (tabIndex === 1) return item.status === 'EXPECTED';
    if (tabIndex === 2) return item.status === 'RECEIVING';
    if (tabIndex === 3) return item.status === 'PUTAWAY_PENDING';
    return true;
  });

  return {
    state: {
      loading,
      products,
      partners,
      isModalOpen,
      tabIndex,
      selectedReceipt,
      isDetailModalOpen,
      filteredData,
    },
    actions: {
      setIsModalOpen,
      setTabIndex,
      setSelectedReceipt,
      setIsDetailModalOpen,
      handleCreateReceipt,
      handleConfirm,
    },
  };
};
