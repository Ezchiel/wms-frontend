import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchReceipts } from '../inventoryReceipt/inventoryReceiptThunks';
import type { InventoryReceipt } from '../inventoryReceipt/inventoryReceiptTypes';
import type { TabKey } from './tasksTypes';

export const useTasks = () => {
  const dispatch = useAppDispatch();

  const { receipts, loading } = useAppSelector((state) => state.inventoryReceipts);

  const [activeTab, setActiveTab] = useState<TabKey>('receiving');

  const receivingReceipts = receipts.filter((r: InventoryReceipt) => r.status === 'RECEIVING');

  const putawayReceipts = receipts.filter((r: InventoryReceipt) => r.status === 'PUTAWAY_PENDING');

  useEffect(() => {
    dispatch(fetchReceipts());
  }, [dispatch]);

  return {
    state: {
      receivingReceipts,
      putawayReceipts,
      loading,
      activeTab,
    },
    actions: {
      setActiveTab,
    },
  };
};
