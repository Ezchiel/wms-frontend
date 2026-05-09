import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchReceipts } from '../inventoryReceipt/inventoryReceiptThunks';
import type { InventoryReceipt } from '../inventoryReceipt/inventoryReceiptTypes';

export const useTasks = () => {
  const dispatch = useAppDispatch();

  const { receipts, loading } = useAppSelector((state) => state.inventoryReceipts);

  // Derived data
  const receivingReceipts = receipts.filter(
    (receipt: InventoryReceipt) =>
      receipt.status !== 'EXPECTED' && receipt.status !== 'PUTAWAY_PENDING'
  );

  useEffect(() => {
    dispatch(fetchReceipts());
  }, [dispatch]);

  return {
    state: {
      receivingReceipts,
      loading,
    },
  };
};
