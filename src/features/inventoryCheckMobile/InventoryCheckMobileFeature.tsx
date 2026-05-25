import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAllProducts } from '../products/productThunks';
import { fetchStorageLocations } from '../storageLocation/storageLocationThunks';
import CreateStockTake, { type CheckRequestDTO } from './components/CreateStockTake';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';

export default function InventoryCheckMobileFeature() {
  const dispatch = useAppDispatch();
  const [view, setView] = useState<'list' | 'create'>('list');

  // Redux
  const { products, loading: productsLoading } = useAppSelector((state) => state.products);
  const { storageLocations, loading: locationsLoading } = useAppSelector(
    (state) => state.storageLocations
  );

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchStorageLocations({ size: 1000 }));
  }, [dispatch]);

  const handleCreateInventory = async (payload: CheckRequestDTO) => {
    try {
      console.log('Payload gửi lên Backend:', payload);
      // toast.success('Tạo phiếu kiểm kê thành công!');
      // setView('list');
      <Navigate to="/mobile/inventory-check-scanner-mobile" />;
    } catch (error: unknown) {
      let errorMessage = 'Không thể tạo phiếu kiểm kê';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast.error(errorMessage);
    }
  };

  if (productsLoading || locationsLoading) {
    return <div className="flex items-center justify-center h-screen">Đang tải dữ liệu...</div>;
  }

  return (
    <>
      {view === 'create' ? (
        <CreateStockTake
          locations={storageLocations}
          products={products}
          onCreate={handleCreateInventory}
          onBack={() => setView('list')}
        />
      ) : (
        <div className="p-4">
          <h1 className="text-xl font-bold">Inventory check list</h1>
          <button
            onClick={() => setView('create')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Create new check
          </button>
          {/* Render danh sách phiếu ở đây */}
        </div>
      )}
    </>
  );
}
