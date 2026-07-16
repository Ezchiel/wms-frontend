import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchNotifications } from './notificationThunks';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error, lastFetched } = useAppSelector((state) => state.notifications);
  const { user } = useAppSelector((state) => state.auth);

  const isAdminOrManager = user && (user.role === 'ADMIN' || user.role === 'MANAGER');

  const refetch = () => {
    if (isAdminOrManager) {
      dispatch(fetchNotifications());
    }
  };

  useEffect(() => {
    if (isAdminOrManager) {
      dispatch(fetchNotifications());

      const intervalId = setInterval(() => {
        dispatch(fetchNotifications());
      }, 60000); // 60s polling

      return () => clearInterval(intervalId);
    }
  }, [dispatch, user]);

  return {
    items,
    loading,
    error,
    lastFetched,
    refetch,
  };
};
