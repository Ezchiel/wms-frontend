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
  const [keyword, setKeyword] = useState('');
  const [sortFilter, setSortFilter] = useState({
    sort: 'createdAt_desc',
    filters: {
      taskType: 'receiving' as TabKey,
      assignedFilter: 'ALL',
      createdAtFrom: '',
      createdAtTo: '',
    },
  });

  const loadData = useCallback(
    (pageNum: number, kw: string, sf: typeof sortFilter) => {
      const statusMap: Record<TabKey, string> = {
        receiving: 'RECEIVING',
        putaway: 'PUTAWAY_PENDING',
      };

      const [sortBy, sortDir] = sf.sort.split('_');
      const assigned = sf.filters.assignedFilter === 'ALL' ? undefined : sf.filters.assignedFilter;
      const fromDate = sf.filters.createdAtFrom || undefined;
      const toDate = sf.filters.createdAtTo || undefined;
      const tab = sf.filters.taskType;

      dispatch(
        fetchReceiptsMobile({
          page: pageNum,
          size: 10,
          status: statusMap[tab],
          keyword: kw || undefined,
          sortBy,
          sortDir,
          assignedFilter: assigned as any,
          fromDate,
          toDate,
        })
      );
    },
    [dispatch]
  );

  // Search handler
  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword);
    dispatch(resetMobileList());
    loadData(1, newKeyword, sortFilter);
  };

  // Sort & Filter handler
  const handleSortFilter = (newSortFilter: typeof sortFilter) => {
    setSortFilter(newSortFilter);
    dispatch(resetMobileList());
    loadData(1, keyword, newSortFilter);
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

    const [sortBy, sortDir] = sortFilter.sort.split('_');
    const assigned = sortFilter.filters.assignedFilter === 'ALL' ? undefined : sortFilter.filters.assignedFilter;
    const fromDate = sortFilter.filters.createdAtFrom || undefined;
    const toDate = sortFilter.filters.createdAtTo || undefined;
    const tab = sortFilter.filters.taskType;

    dispatch(
      fetchReceiptsMobile({
        page: nextPage,
        size: 10,
        status: statusMap[tab],
        keyword: keyword || undefined,
        sortBy,
        sortDir,
        assignedFilter: assigned as any,
        fromDate,
        toDate,
      })
    );
  };

  useEffect(() => {
    dispatch(resetMobileList());
    loadData(1, keyword, sortFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadData]);

  return {
    state: { receipts, loading, meta, mobileHasMore, keyword, sortFilter },
    actions: { handleLoadMore, handleSearch, handleSortFilter },
  };
};
