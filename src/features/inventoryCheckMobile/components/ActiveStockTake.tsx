import { useState, useRef } from 'react';
import {
  type StockTakeSheet,
  type StockTakeItem,
  MOCK_PRODUCTS,
} from '../inventoryCheckMobileTypes';
import ScannerSimulator from './ScannerSimulator';

interface ActiveStockTakeProps {
  sheet: StockTakeSheet;
  onSaveDraft: (updatedSheet: StockTakeSheet) => void;
  onFinalize: (finalizedSheet: StockTakeSheet) => void;
  onCancel: () => void;
}

export default function ActiveStockTake({
  sheet,
  onSaveDraft,
  onFinalize,
  onCancel,
}: ActiveStockTakeProps) {
  const [items, setItems] = useState<StockTakeItem[]>([...sheet.items]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'matched' | 'discrepant'>('all');
  const [searchSkuPattern, setSearchSkuPattern] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [scannedFeedback, setScannedFeedback] = useState<string | null>(null);

  // References for items to allow scroll stimulation on scanning
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleQtyChange = (productId: string, newValue: number | null) => {
    setItems((curr) =>
      curr.map((item) => {
        if (item.productId === productId) {
          // Keep quantity at minimum 0 if not null
          const val = newValue === null ? null : Math.max(0, newValue);
          return { ...item, actualQty: val };
        }
        return item;
      })
    );
  };

  const handleShortcutAdjust = (productId: string, increment: number) => {
    setItems((curr) =>
      curr.map((item) => {
        if (item.productId === productId) {
          const currentVal = item.actualQty ?? 0;
          const val = Math.max(0, currentVal + increment);
          return { ...item, actualQty: val };
        }
        return item;
      })
    );
  };

  const handleQuickMarkMatch = (productId: string) => {
    setItems((curr) =>
      curr.map((item) => {
        if (item.productId === productId) {
          return { ...item, actualQty: item.expectedQty };
        }
        return item;
      })
    );
  };

  const handleQuickSetZero = (productId: string) => {
    setItems((curr) =>
      curr.map((item) => {
        if (item.productId === productId) {
          return { ...item, actualQty: 0 };
        }
        return item;
      })
    );
  };

  // Helper scan barcode trigger
  const handleScannerScan = (scannedSku: string) => {
    // Search item in active sheet matching the scanned sku
    const itemIdx = items.findIndex((i) => i.sku.toLowerCase() === scannedSku.toLowerCase());
    if (itemIdx !== -1) {
      const targetItem = items[itemIdx];
      // Auto increment count by 1 or set to 1 if null
      const current = targetItem.actualQty ?? 0;
      handleQtyChange(targetItem.productId, current + 1);

      setScannedFeedback(`Đã quét SKU: ${targetItem.sku} (+1)`);
      setShowScanner(false);

      // Scroll to that element smoothly
      setTimeout(() => {
        itemRefs.current[targetItem.productId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

        // Remove feedback after a few seconds
        setTimeout(() => setScannedFeedback(null), 3000);
      }, 300);
    } else {
      alert(
        `Sản phẩm với SKU [${scannedSku}] không tồn tại trong danh sách kiểm kê của phiếu này.`
      );
      setShowScanner(false);
    }
  };

  const handleFinalizeClick = () => {
    // Check if all quantities have been entered
    const uncounted = items.filter((item) => item.actualQty === null);

    if (uncounted.length > 0) {
      if (!window.confirm(`Còn ${uncounted.length} mặt hàng chưa nhập số lượng. Vẫn tiếp tục?`)) {
        return;
      }
    }

    // Call callback props to send data to the API
    onFinalize({
      ...sheet,
      items: items,
      completedAt: new Date().toISOString(),
    });
  };

  const handleSaveDraftClick = () => {
    const updatedSheet: StockTakeSheet = {
      ...sheet,
      items,
      status: 'in_progress',
    };
    onSaveDraft(updatedSheet);
  };

  // Filtering logic
  const filteredItems = items.filter((item) => {
    // Tab status checks:
    const isPending = item.actualQty === null;
    const isMatched = item.actualQty !== null && item.actualQty === item.expectedQty;
    const isDiscrepant = item.actualQty !== null && item.actualQty !== item.expectedQty;

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'pending' && isPending) ||
      (activeTab === 'matched' && isMatched) ||
      (activeTab === 'discrepant' && isDiscrepant);

    // Search bar check:
    const matchesSearch =
      item.name.toLowerCase().includes(searchSkuPattern.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchSkuPattern.toLowerCase()) ||
      item.shelf.toLowerCase().includes(searchSkuPattern.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Calculate quick stats for active sheet view
  const totalCount = items.length;
  const pendingCount = items.filter((i) => i.actualQty === null).length;
  const matchedCount = items.filter(
    (i) => i.actualQty !== null && i.actualQty === i.expectedQty
  ).length;
  const discrepantCount = items.filter(
    (i) => i.actualQty !== null && i.actualQty !== i.expectedQty
  ).length;

  return (
    <div className="bg-brand-bg min-h-screen flex flex-col font-sans">
      {/* Dynamic top bar header */}
      <header className="bg-white border-b border-slate-100 flex items-center justify-between px-4 py-3.5 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraftClick} // saving draft on back button
            className="transition-colors duration-200 active:opacity-75 p-1.5 rounded-full hover:bg-slate-50 border border-slate-100/60"
            title="Lưu nháp và quay lại"
            id="active-back-btn"
          >
            <span className="material-symbols-outlined text-blue-600 block">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans antialiased font-extrabold text-sm text-slate-800">
                {sheet.code}
              </h1>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                Đang kiểm kho
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Vị trí: {sheet.zone || 'Nhiều nơi'} {sheet.rack ? `• ${sheet.rack}` : ''}
            </p>
          </div>
        </div>

        {/* Scan Barcode overlay trigger button */}
        <button
          onClick={() => setShowScanner(true)}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center gap-1.5"
          id="scanner-active-trigger-btn"
        >
          <span className="material-symbols-outlined text-sm font-bold block">camera_alt</span>
          <span>Quét kiểm</span>
        </button>
      </header>

      {/* Main interactive items container */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-4 space-y-4 pb-40">
        {/* Scanned alert banner notification */}
        {scannedFeedback && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 rounded-xl text-xs font-bold text-center animate-bounce flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>{scannedFeedback}</span>
          </div>
        )}

        {/* Status filters scroll row */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 text-[10px] font-extrabold rounded-lg text-center transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            id="active-tab-all"
          >
            Tất cả ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 text-[10px] font-extrabold rounded-lg text-center transition-all ${
              activeTab === 'pending'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-500 hover:text-teal-700'
            }`}
            id="active-tab-pending"
          >
            Chưa đếm ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('matched')}
            className={`py-2 text-[10px] font-extrabold rounded-lg text-center transition-all ${
              activeTab === 'matched'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-emerald-700'
            }`}
            id="active-tab-matched"
          >
            Đúng khớp ({matchedCount})
          </button>
          <button
            onClick={() => setActiveTab('discrepant')}
            className={`py-2 text-[10px] font-extrabold rounded-lg text-center transition-all ${
              activeTab === 'discrepant'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-500 hover:text-rose-700'
            }`}
            id="active-tab-discrepant"
          >
            Lệch ({discrepantCount})
          </button>
        </div>

        {/* Filter lookup input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            filter_alt
          </span>
          <input
            type="text"
            value={searchSkuPattern}
            onChange={(e) => setSearchSkuPattern(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-100 placeholder-slate-400"
            placeholder="Lọc nhanh danh sách (Tên, SKU, Khay kệ)..."
            id="local-filter-input"
          />
          {searchSkuPattern && (
            <button
              onClick={() => setSearchSkuPattern('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
            >
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          )}
        </div>

        {/* List of active product items to execute check */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-100 rounded-2xl">
              <span className="material-symbols-outlined text-3xl text-slate-300">search_off</span>
              <p className="text-xs text-slate-400 font-bold mt-1.5">Không khớp mặt hàng nào</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Vui lòng thay đổi tab hoặc nhập từ khóa.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              // Retrieve image thumbnail from main list
              const actualProd = MOCK_PRODUCTS.find((p) => p.id === item.productId);
              const imgUrl =
                actualProd?.image ||
                'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=100';

              const isPending = item.actualQty === null;
              const isMatched = item.actualQty !== null && item.actualQty === item.expectedQty;
              const diff = item.actualQty !== null ? item.actualQty - item.expectedQty : 0;

              return (
                <div
                  key={item.productId}
                  ref={(el) => {
                    itemRefs.current[item.productId] = el;
                  }}
                  className={`bg-white border rounded-2xl p-3.5 space-y-3.5 transition-all shadow-xs ${
                    isPending
                      ? 'border-slate-100'
                      : isMatched
                        ? 'border-emerald-200 bg-emerald-50/10'
                        : 'border-rose-200 bg-rose-50/10'
                  }`}
                  id={`item-check-row-${item.sku}`}
                >
                  {/* Top info block */}
                  <div className="flex items-start gap-3">
                    <img
                      src={imgUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-xl shrink-0 border border-slate-100"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-extrabold text-slate-800 leading-snug wrap-break-word">
                        {item.name}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        SKU: <span className="text-slate-600 font-extrabold">{item.sku}</span>
                      </p>

                      {/* Location metadata breadcrumb */}
                      <div className="mt-1 text-[9px] text-slate-400 items-center gap-1 font-semibold bg-slate-50 px-2 py-0.5 rounded-md inline-flex border border-slate-100/50">
                        <span className="material-symbols-outlined text-[10px] text-blue-500">
                          grid_on
                        </span>
                        <span>
                          {item.zone} • {item.rack} • {item.shelf}
                        </span>
                      </div>
                    </div>

                    {/* Quick status indicator chip */}
                    <div className="shrink-0">
                      {isPending ? (
                        <span className="text-[9px] bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded-md">
                          Chờ Đếm
                        </span>
                      ) : isMatched ? (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          🟢 Khớp
                        </span>
                      ) : (
                        <span className="text-[9px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          🚨 Lệch {diff > 0 ? `+${diff}` : diff}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock tracking comparison widgets */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs border border-slate-100/50 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold">
                        Số Hệ Thống
                      </span>
                      <span className="font-extrabold text-slate-700 mt-0.5">
                        {item.expectedQty}{' '}
                        <span className="text-[10px] font-normal text-slate-400">{item.unit}</span>
                      </span>
                    </div>

                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold">
                        Sai lệch thực tế
                      </span>
                      <span
                        className={`font-mono font-black mt-0.5 ${isPending ? 'text-slate-400 font-normal italic text-[10px]' : isMatched ? 'text-emerald-600' : 'text-rose-600'}`}
                      >
                        {isPending
                          ? 'Chưa rõ'
                          : diff === 0
                            ? 'Hoàn toàn khớp'
                            : `${diff > 0 ? '+' : ''}${diff} ${item.unit}`}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Counting buttons row */}
                  <div className="flex items-center gap-2 pt-1">
                    {/* Decrease decrementors */}
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleShortcutAdjust(item.productId, -10)}
                        className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold active:scale-95 transition-all border border-slate-200/50"
                        title="Bỏ 10"
                      >
                        -10
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShortcutAdjust(item.productId, -1)}
                        className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-black active:scale-90 transition-all border border-slate-200/50"
                        title="Bỏ 1"
                      >
                        -
                      </button>
                    </div>

                    {/* Central main state inputs */}
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        min="0"
                        value={item.actualQty ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                          handleQtyChange(item.productId, val);
                        }}
                        placeholder="Số lượng đếm"
                        className="w-full text-center bg-white border border-slate-200 py-2.5 rounded-xl text-sm font-black text-slate-800 outline-none focus:ring-1 focus:ring-blue-100"
                        id={`quantity-input-${item.sku}`}
                      />
                      {!isPending && (
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.productId, null)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                          title="Xóa kết quả đếm"
                          id={`clear-item-${item.sku}`}
                        >
                          <span className="material-symbols-outlined text-sm block">backspace</span>
                        </button>
                      )}
                    </div>

                    {/* Increase incrementors & smart buttons */}
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleShortcutAdjust(item.productId, 1)}
                        className="w-10 h-10 flex items-center justify-center bg-blue-50 hover:bg-md hover:bg-blue-100 text-blue-600 rounded-xl font-bold active:scale-90 transition-all border border-blue-100"
                        title="Thêm 1"
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShortcutAdjust(item.productId, 10)}
                        className="w-10 h-10 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-extrabold active:scale-95 transition-all border border-blue-100"
                        title="Thêm 10"
                      >
                        +10
                      </button>
                    </div>
                  </div>

                  {/* Tiny Helper utilities under count input */}
                  {isPending && (
                    <div className="flex gap-2 justify-end text-[10px]">
                      <button
                        type="button"
                        onClick={() => handleQuickMarkMatch(item.productId)}
                        className="text-blue-600 hover:underline font-semibold"
                        id={`quick-match-${item.sku}`}
                      >
                        Khớp hệ thống ({item.expectedQty})
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => handleQuickSetZero(item.productId)}
                        className="text-amber-600 hover:underline font-semibold"
                        id={`quick-zero-${item.sku}`}
                      >
                        Báo hết hàng (0)
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Floating Action footer control bars */}
      <footer className="fixed bottom-0 left-0 w-full z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 pb-6 pt-3.5 shadow-[0_-4px_22px_rgba(0,0,0,0.04)]">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {/* Draft Save button */}
          <button
            onClick={handleSaveDraftClick}
            className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
            id="draft-save-btn"
          >
            <span className="material-symbols-outlined text-sm block">save_as</span>
            <span>Lưu Tạm Nháp</span>
          </button>

          {/* Complete checking button */}
          <button
            onClick={handleFinalizeClick}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-xs transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 flex items-center justify-center gap-1.5 active:scale-95"
            id="finalize-sheet-btn"
          >
            <span className="material-symbols-outlined text-sm block font-bold">check_circle</span>
            <span>Chốt Phiếu Kiểm</span>
          </button>
        </div>
      </footer>

      {/* Simulated Scanner camera overlay triggers */}
      {showScanner && (
        <ScannerSimulator
          onClose={() => setShowScanner(false)}
          onScan={handleScannerScan}
          allowedZone={sheet.zone !== 'Tất cả khu vực' ? sheet.zone : null}
        />
      )}
    </div>
  );
}
