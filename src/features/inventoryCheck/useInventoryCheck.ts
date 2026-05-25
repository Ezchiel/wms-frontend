import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchChecks, confirmCheck } from './inventoryCheckThunks';
import type { InventoryCheck } from './inventoryCheckTypes';

export const useInventoryCheck = () => {
  const dispatch = useAppDispatch();
  const { checks, loading, meta } = useAppSelector((state) => state.inventoryChecks);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<InventoryCheck | null>(null);

  useEffect(() => {
    dispatch(fetchChecks({ keyword: searchKeyword, page: currentPage, size: 10 }));
  }, [dispatch, currentPage, searchKeyword]);

  const handleConfirm = async (id: number) => {
    if (window.confirm('Xác nhận hoàn tất kiểm kê? Kho sẽ được cập nhật theo số lượng thực tế.')) {
      await dispatch(confirmCheck(id));
      setIsDetailModalOpen(false);
    }
  };

  return {
    state: { checks, loading, meta, isModalOpen, isDetailModalOpen, selectedCheck, currentPage },
    actions: {
      setSearchKeyword,
      setCurrentPage,
      setIsModalOpen,
      setIsDetailModalOpen,
      setSelectedCheck,
      handleConfirm,
    },
  };
};
