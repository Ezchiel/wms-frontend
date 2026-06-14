import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAllProducts } from '../products/productThunks';
import { fetchAllProductGroups } from '../productGroups/productGroupThunks';
import {
  fetchStockTrend,
  fetchStockByGroup,
  fetchLocationUtilization,
  fetchInventoryMovement,
  fetchExpiringStock,
} from './reportsThunks';

export const useReports = () => {
  const dispatch = useAppDispatch();

  // Tab Index (0 to 4)
  const [activeTab, setActiveTab] = useState(0);

  // Date defaults: 30 days ago to today
  const getThirtyDaysAgo = () => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  };
  const getToday = () => new Date().toISOString().split('T')[0];

  // Tab 0: Stock Trend Filters
  const [trendFilters, setTrendFilters] = useState<{
    from: string;
    to: string;
    groupBy: 'day' | 'week' | 'month';
    productId?: number;
  }>({
    from: getThirtyDaysAgo(),
    to: getToday(),
    groupBy: 'day',
    productId: undefined,
  });

  // Tab 3: Inventory Movement Filters
  const [movementFilters, setMovementFilters] = useState<{
    from: string;
    to: string;
    productId?: number;
    groupId?: number;
  }>({
    from: getThirtyDaysAgo(),
    to: getToday(),
    productId: undefined,
    groupId: undefined,
  });

  // Tab 4: Expiring Stock Filters
  const [withinDays, setWithinDays] = useState(30);

  // Redux States
  const reportsState = useAppSelector((state) => state.reports);
  const { products } = useAppSelector((state) => state.products);
  const { productGroups } = useAppSelector((state) => state.productGroups);

  // Fetch dropdown lists (Products, Product Groups) on mount
  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllProductGroups());
  }, [dispatch]);

  // Lazy Fetching based on Active Tab and Filters
  useEffect(() => {
    if (activeTab === 0) {
      dispatch(fetchStockTrend(trendFilters));
    } else if (activeTab === 1) {
      dispatch(fetchStockByGroup());
    } else if (activeTab === 2) {
      dispatch(fetchLocationUtilization());
    } else if (activeTab === 3) {
      dispatch(fetchInventoryMovement(movementFilters));
    } else if (activeTab === 4) {
      dispatch(fetchExpiringStock({ withinDays }));
    }
  }, [dispatch, activeTab, trendFilters, movementFilters, withinDays]);

  return {
    state: {
      activeTab,
      reportsState,
      products,
      productGroups,
      trendFilters,
      movementFilters,
      withinDays,
    },
    actions: {
      setActiveTab,
      setTrendFilters,
      setMovementFilters,
      setWithinDays,
      refreshActiveTab: () => {
        if (activeTab === 0) {
          dispatch(fetchStockTrend(trendFilters));
        } else if (activeTab === 1) {
          dispatch(fetchStockByGroup());
        } else if (activeTab === 2) {
          dispatch(fetchLocationUtilization());
        } else if (activeTab === 3) {
          dispatch(fetchInventoryMovement(movementFilters));
        } else if (activeTab === 4) {
          dispatch(fetchExpiringStock({ withinDays }));
        }
      },
    },
  };
};
