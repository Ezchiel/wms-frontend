import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetMobileList } from '../inventoryReceipt/inventoryReceiptSlice';
import type { TabKey } from './tasksTypes';
import { fetchReceiptsMobile } from '../inventoryReceipt/inventoryReceiptThunks';

export const useTasks = () => {
  const dispatch = useAppDispatch();

  // Redux selector
  const { receipts, loading, meta, mobileHasMore } = useAppSelector(
    (state) => state.inventoryReceipts
  );

  // Local state
  const [activeTab, setActiveTab] = useState<TabKey>('receiving');
  // const [page, setPage] = useState(1);

  const loadData = useCallback(
    (pageNum: number, tab: TabKey) => {
      const statusMap: Record<TabKey, string> = {
        receiving: 'RECEIVING',
        putaway: 'PUTAWAY_PENDING',
      };

      dispatch(
        fetchReceiptsMobile({
          page: pageNum,
          size: 10,
          status: statusMap[tab],
        })
      );
    },
    [dispatch]
  );

  // Tab change handler
  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    // setPage(1);
    dispatch(resetMobileList());
    loadData(1, tab);
  };

  // Load more handler
  const handleLoadMore = () => {
    if (loading || !mobileHasMore) return;

    const currentPage = meta?.page || 1;
    const nextPage = currentPage + 1;

    const statusMap: Record<TabKey, string> = {
      receiving: 'RECEIVING',
      putaway: 'PUTAWAY_PENDING',
    };

    dispatch(
      fetchReceiptsMobile({
        page: nextPage,
        size: 10,
        status: statusMap[activeTab],
      })
    );
  };

  useEffect(() => {
    loadData(1, activeTab);
  }, [activeTab, loadData]);

  return {
    state: { receipts, loading, activeTab, meta, mobileHasMore },
    actions: { handleTabChange, handleLoadMore },
  };
};
