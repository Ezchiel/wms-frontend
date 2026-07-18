import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toast } from 'react-toastify';

// Thunks
import { fetchAllProducts } from '../products/productThunks';
import { fetchStorageLocations } from '../storageLocation/storageLocationThunks';
import { fetchInventoryChecks, createInventoryCheck } from '../inventoryCheck/inventoryCheckThunks';
import { fetchStocksByLocation } from '../inventoryStock/inventoryStockThunks';

// Types
import type { InventoryCheck } from '../inventoryCheck/inventoryCheckTypes';
import type { StorageLocation } from '../storageLocation/storageLocationTypes';

// Components
import StockTakeDashboard from './components/StockTakeDashboard';
import CreateStockTake, { type CreateCheckSetup } from './components/CreateStockTake';
import ActiveStockTake, { type CountingItem } from './components/ActiveStockTake';
import ReportModal from './components/ReportModal';

type View = 'list' | 'create' | 'counting';

export default function InventoryCheckMobileFeature() {
  const dispatch = useAppDispatch();

  const { products } = useAppSelector((s) => s.products);
  const { storageLocations } = useAppSelector((s) => s.storageLocations);
  const { checks, loading: checksLoading } = useAppSelector((s) => s.inventoryCheck);
  const { stocks, loading: stocksLoading } = useAppSelector((s) => s.inventoryStocks);

  const [view, setView] = useState<View>('list');
  const [pendingSetup, setPendingSetup] = useState<{
    location: StorageLocation;
    notes: string;
  } | null>(null);
  const [reportCheck, setReportCheck] = useState<InventoryCheck | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFetchChecks = useCallback((params: any) => {
    dispatch(fetchInventoryChecks({ page: 1, size: 50, sortBy: 'id', sortDir: 'desc', ...params }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchStorageLocations({ size: 1000 }));
    handleFetchChecks({});
  }, [dispatch, handleFetchChecks]);

  const handleSetupComplete = async (setup: CreateCheckSetup) => {
    const location = storageLocations.find((l) => l.id === setup.locationId);
    if (!location) {
      toast.error('Không tìm thấy thông tin vị trí đã chọn!');
      return;
    }

    // Fetch the items currently registered at this location
    try {
      await dispatch(fetchStocksByLocation(setup.locationId)).unwrap();
    } catch {
      // Non-fatal: if the location has no stocks the counting list will just be empty
      // and the employee can add extra items manually
    }

    setPendingSetup({ location, notes: setup.notes });
    setView('counting');
  };

  const handleFinalize = async (items: CountingItem[], notes: string) => {
    // Filter out items with null actualQuantity (treat as uncounted = skip)
    const details = items
      .filter((it) => it.actualQuantity !== null)
      .map((it) => ({
        productId: it.productId,
        locationId: it.locationId,
        batchNo: it.batchNo,
        actualQuantity: it.actualQuantity as number,
        reason: it.reason,
      }));

    if (details.length === 0) {
      toast.warning('Vui lòng nhập số lượng thực tế cho ít nhất một mặt hàng!');
      return;
    }

    setSubmitting(true);
    try {
      const result = await dispatch(
        createInventoryCheck({ notes, details })
      );

      if (createInventoryCheck.fulfilled.match(result)) {
        toast.success('Tạo phiếu kiểm kê thành công!');
        // Refresh list
        dispatch(fetchInventoryChecks({ page: 1, size: 50, sortBy: 'id', sortDir: 'desc' }));
        setPendingSetup(null);
        setView('list');
      } else {
        toast.error((result.payload as string) || 'Tạo phiếu kiểm kê thất bại!');
      }
    } catch {
      toast.error('Lỗi kết nối đến máy chủ!');
    } finally {
      setSubmitting(false);
    }
  };

  // Only block the whole UI if we're in "counting" view and still loading stocks
  const isTransitioning = view === 'counting' && stocksLoading;

  if (isTransitioning) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-wms-bg gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
        <p className="text-sm text-slate-500 font-semibold">Loading data...</p>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-wms-bg gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
        <p className="text-sm text-slate-500 font-semibold">Submitting...</p>
      </div>
    );
  }

  return (
    <>
      {/* LIST VIEW */}
      {view === 'list' && (
        <StockTakeDashboard
          checks={checks}
          loading={checksLoading}
          onCreateNewClick={() => setView('create')}
          onViewCheck={(check) => setReportCheck(check)}
          onFetchChecks={handleFetchChecks}
        />
      )}

      {/* CREATE VIEW – pick location & notes */}
      {view === 'create' && (
        <CreateStockTake
          locations={storageLocations}
          onCreate={handleSetupComplete}
          onBack={() => setView('list')}
        />
      )}

      {/* COUNTING VIEW – enter actual quantities */}
      {view === 'counting' && pendingSetup && (
        <ActiveStockTake
          stockItems={stocks}
          products={products}
          location={pendingSetup.location}
          notes={pendingSetup.notes}
          onFinalize={handleFinalize}
          onBack={() => {
            setPendingSetup(null);
            setView('create');
          }}
        />
      )}

      {/* REPORT MODAL – view a completed/pending check */}
      {reportCheck && (
        <ReportModal
          check={reportCheck}
          onClose={() => setReportCheck(null)}
        />
      )}
    </>
  );
}
