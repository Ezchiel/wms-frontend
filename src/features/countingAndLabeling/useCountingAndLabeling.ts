import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { countAndLabel, fetchReceipts } from '../inventoryReceipt/inventoryReceiptThunks';
import type { ItemState } from './countingAndLabelingTypes';

export const useCountingAndLabeling = () => {
  const { receiptId } = useParams<{ receiptId: string }>();
  const [printData, setPrintData] = useState<{
    lpnCode: string;
    productName: string;
    qty: number;
  } | null>(null);
  const dispatch = useAppDispatch();

  const { receipts, loading } = useAppSelector((s) => s.inventoryReceipts);

  // Fetch receipts if store is empty (e.g. user navigated directly via URL)
  useEffect(() => {
    if (receipts.length === 0) {
      dispatch(fetchReceipts());
    }
  }, [dispatch, receipts.length]);

  const receipt = receipts.find((r) => r.id === Number(receiptId)) ?? null;

  const generateInitialStates = (r: typeof receipt) => {
    if (!r || !r.details) return {};
    const init: Record<number, ItemState> = {};
    r.details.forEach((d) => {
      init[d.id] = {
        detailId: d.id,
        countedQty: 0,
        batchNo: d.batchNo ?? '',
        expiryDate: d.expiryDate ?? '',
        serialNumber: d.serialNumber ?? '',
        isPrinted: false,
        isSubmitting: false,
        error: null,
        lpnCode: null,
      };
    });
    return init;
  };

  const [itemStates, setItemStates] = useState<Record<number, ItemState>>(() =>
    generateInitialStates(receipt)
  );

  const [prevReceiptId, setPrevReceiptId] = useState(receiptId);

  if (receiptId !== prevReceiptId) {
    setPrevReceiptId(receiptId);
    setItemStates(generateInitialStates(receipt));
  }

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleQtyChange = (detailId: number, delta: number) => {
    setItemStates((prev) => ({
      ...prev,
      [detailId]: {
        ...prev[detailId],
        countedQty: Math.max(0, prev[detailId].countedQty + delta),
        error: null,
      },
    }));
  };

  const handleFieldChange = (
    detailId: number,
    field: 'batchNo' | 'expiryDate' | 'serialNumber',
    value: string
  ) => {
    setItemStates((prev) => ({
      ...prev,
      [detailId]: { ...prev[detailId], [field]: value, error: null },
    }));
  };

  const handlePrint = async (detailId: number) => {
    if (!receipt) return;
    const cur = itemStates[detailId];
    if (!cur || cur.countedQty <= 0) return;

    setItemStates((prev) => ({
      ...prev,
      [detailId]: { ...prev[detailId], isSubmitting: true, error: null },
    }));

    try {
      const result = await dispatch(
        countAndLabel({
          receiptId: receipt.id,
          detailId,
          countedQuantity: cur.countedQty,
          batchNo: cur.batchNo || undefined,
          expiryDate: cur.expiryDate || undefined,
          serialNumber: cur.serialNumber || undefined,
        })
      ).unwrap();

      setItemStates((prev) => ({
        ...prev,
        [detailId]: {
          ...prev[detailId],
          isSubmitting: false,
          isPrinted: true,
          lpnCode: result.lpnCode,
          error: null,
        },
      }));

      const itemDetail = receipt.details.find((d) => d.id === detailId);

      setPrintData({
        lpnCode: result.lpnCode,
        productName: itemDetail?.productName || 'N/A',
        qty: cur.countedQty,
      });
    } catch (err: unknown) {
      const msg = typeof err === 'string' ? err : 'Có lỗi xảy ra. Vui lòng thử lại.';
      setItemStates((prev) => ({
        ...prev,
        [detailId]: { ...prev[detailId], isSubmitting: false, error: msg },
      }));
    }
  };

  // ── Derived ──────────────────────────────────────────────────────────────

  const details = receipt?.details ?? [];
  const printedCount = Object.values(itemStates).filter((s) => s.isPrinted).length;
  const totalCount = details.length;
  const allDone = totalCount > 0 && printedCount === totalCount;

  return {
    state: {
      receiptId,
      receipts,
      loading,
      receipt,
      itemStates,
      details,
      printedCount,
      totalCount,
      allDone,
      printData,
    },
    actions: {
      setItemStates,
      handleQtyChange,
      handleFieldChange,
      handlePrint,
      setPrintData,
    },
  };
};
