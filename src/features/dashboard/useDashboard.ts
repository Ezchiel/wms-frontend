import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchTotalStock,
  fetchStockByZone,
  fetchStockByProduct,
  fetchLowStockAlerts,
} from './dashboardThunks';

export const useDashboard = () => {
  const dispatch = useAppDispatch();

  // Selector for dashboard state
  const {
    totalStock,
    stockByZone,
    stockByProduct,
    lowStockAlerts,
    loading,
    error,
  } = useAppSelector((state) => state.dashboard);

  // Fetch all dashboard data when component mounts
  useEffect(() => {
    dispatch(fetchTotalStock());
    dispatch(fetchStockByZone());
    dispatch(fetchStockByProduct());
    dispatch(fetchLowStockAlerts());
  }, [dispatch]);

  return {
    state: {
      totalStock,
      stockByZone,
      stockByProduct,
      lowStockAlerts,
      loading,
      error,
    },
    actions: {
      refresh: () => {
        dispatch(fetchTotalStock());
        dispatch(fetchStockByZone());
        dispatch(fetchStockByProduct());
        dispatch(fetchLowStockAlerts());
      },
    },
  };
};
