import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchInventoryStocks } from './inventoryStockThunks';
import { fetchStorageLocations } from '../storageLocation/storageLocationThunks';


export const useInventoryStock = () => {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { stocks, loading: isStockLoading } = useAppSelector((state) => state.inventoryStocks);
  const { storageLocations, loading: isLocLoading } = useAppSelector(
    (state) => state.storageLocations
  );

  // Local State
  const [tabIndex, setTabIndex] = useState(0);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchInventoryStocks());
    dispatch(fetchStorageLocations({ size: 1000 }));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchInventoryStocks());
    dispatch(fetchStorageLocations({ size: 1000 }));
  };

  // Derived Data
  const isLoading = isStockLoading || isLocLoading;

  return {
    state: {
      stocks,
      storageLocations,
      tabIndex,
      isLoading,
    },
    actions: {
      setTabIndex,
      handleRefresh,
    },
  };
};
