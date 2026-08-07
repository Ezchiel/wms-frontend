import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearTransactions } from './stockCardSlice';
import {
  fetchStockCardByProduct,
  fetchStockCardByProductAndLocation,
} from './stockCardThunks';

export const useStockCard = (initialProductId?: number) => {
  const dispatch = useAppDispatch();

  const { transactions, loading, error } = useAppSelector((state) => state.stockCard);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    initialProductId ?? null
  );
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  // Fetch whenever product or location selection changes
  useEffect(() => {
    if (!selectedProductId) {
      dispatch(clearTransactions());
      return;
    }

    if (selectedLocationId) {
      dispatch(
        fetchStockCardByProductAndLocation({
          productId: selectedProductId,
          locationId: selectedLocationId,
        })
      );
    } else {
      dispatch(fetchStockCardByProduct(selectedProductId));
    }
  }, [dispatch, selectedProductId, selectedLocationId]);

  const handleRefresh = useCallback(() => {
    if (!selectedProductId) return;
    if (selectedLocationId) {
      dispatch(
        fetchStockCardByProductAndLocation({
          productId: selectedProductId,
          locationId: selectedLocationId,
        })
      );
    } else {
      dispatch(fetchStockCardByProduct(selectedProductId));
    }
  }, [dispatch, selectedProductId, selectedLocationId]);

  const handleSelectProduct = useCallback((productId: number | null) => {
    setSelectedProductId(productId);
    setSelectedLocationId(null); // reset location when product changes
  }, []);

  return {
    state: {
      transactions,
      loading,
      error,
      selectedProductId,
      selectedLocationId,
    },
    actions: {
      setSelectedProductId: handleSelectProduct,
      setSelectedLocationId,
      handleRefresh,
    },
  };
};
