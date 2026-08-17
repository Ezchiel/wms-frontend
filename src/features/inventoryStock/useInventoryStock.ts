import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchInventoryStocks } from './inventoryStockThunks';
import { fetchStorageLocations } from '../storageLocation/storageLocationThunks';


export const useInventoryStock = () => {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { stocks, meta, loading: isStockLoading } = useAppSelector((state) => state.inventoryStocks);
  const { storageLocations, loading: isLocLoading } = useAppSelector(
    (state) => state.storageLocations
  );

  // Local State
  const [tabIndex, setTabIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Fetch data on page or size change
  useEffect(() => {
    dispatch(fetchInventoryStocks({ page: currentPage, size: pageSize }));
    dispatch(fetchStorageLocations({ size: 1000 }));
  }, [dispatch, currentPage, pageSize]);

  const handleRefresh = () => {
    dispatch(fetchInventoryStocks({ page: currentPage, size: pageSize }));
    dispatch(fetchStorageLocations({ size: 1000 }));
  };

  // Derived Data
  const isLoading = isStockLoading || isLocLoading;

  return {
    state: {
      stocks,
      storageLocations,
      meta,
      currentPage,
      tabIndex,
      isLoading,
    },
    actions: {
      setTabIndex,
      setCurrentPage,
      handleRefresh,
    },
  };
};
