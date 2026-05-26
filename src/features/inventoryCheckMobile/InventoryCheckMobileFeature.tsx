import { useEffect, useState } from 'react';
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

// ─── View states ──────────────────────────────────────────────────────────────
type View = 'list' | 'create' | 'counting';

export default function InventoryCheckMobileFeature() {
  const dispatch = useAppDispatch();

  // ── Redux state ────────────────────────────────────────────────────────────
  const { products } = useAppSelector((s) => s.products);
  const { storageLocations } = useAppSelector((s) => s.storageLocations);
  const { checks, loading: checksLoading } = useAppSelector((s) => s.inventoryCheck);
  const { stocks, loading: stocksLoading } = useAppSelector((s) => s.inventoryStocks);

  // ── Local UI state ─────────────────────────────────────────────────────────
  const [view, setView] = useState<View>('list');
  /** The location the employee chose while on the "create" screen */
  const [pendingSetup, setPendingSetup] = useState<{
    location: StorageLocation;
    notes: string;
  } | null>(null);
  /** Check opened in the report modal */
  const [reportCheck, setReportCheck] = useState<InventoryCheck | null>(null);
  /** Submission in progress */
  const [submitting, setSubmitting] = useState(false);

  // ── Load master data on mount ──────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchStorageLocations({ size: 1000 }));
    dispatch(fetchInventoryChecks({ page: 1, size: 50, sortBy: 'id', sortDir: 'desc' }));
  }, [dispatch]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  /**
   * Called by CreateStockTake when the operator picks a location and taps
   * "Start checking". We load the stocks at that location and then transition
   * to the counting view.
   */
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

  /**
   * Called by ActiveStockTake when the operator finalises the count.
   * Builds the CreateCheckPayload and dispatches createInventoryCheck.
   */
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

  // ─── Global loading state ─────────────────────────────────────────────────
  // Only block the whole UI if we're in "counting" view and still loading stocks
  const isTransitioning = view === 'counting' && stocksLoading;

  if (isTransitioning) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
        <p className="text-sm text-slate-500 font-semibold">Đang tải dữ liệu kho...</p>
      </div>
    );
  }

  // ─── Submission overlay ───────────────────────────────────────────────────
  if (submitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
        <p className="text-sm text-slate-500 font-semibold">Đang nộp phiếu kiểm kê...</p>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* LIST VIEW */}
      {view === 'list' && (
        <StockTakeDashboard
          checks={checks}
          loading={checksLoading}
          onCreateNewClick={() => setView('create')}
          onViewCheck={(check) => setReportCheck(check)}
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
