import { useState } from 'react';
import {
  ScanQrCode,
  Package,
  CircleCheckBig,
  Boxes,
  Tag,
  Layers,
  BarChart3,
  X,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';

import { useAppDispatch } from '../../app/hooks';
import { fetchProductByLpn } from '../../features/products/productThunks';
import type { Product } from '../../features/products/productTypes';
import QrCameraScanner from '../../features/inventoryCheckMobile/components/QrCameraScanner';

// ─── Scanned result state ─────────────────────────────────────────────────────

interface ScannedResult {
  lpn: string;
  product: Product;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LPNScannerPage() {
  const dispatch = useAppDispatch();

  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScannedResult | null>(null);
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [lastScannedRaw, setLastScannedRaw] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ── Handler: QR scanned ──────────────────────────────────────────────────

  const handleScan = async (scannedText: string) => {
    console.log('[LPN Scan] Raw scanned value:', scannedText);
    setShowScanner(false);
    setIsLoading(true);
    setScanFeedback(null);
    setErrorMsg(null);
    setLastScannedRaw(scannedText);

    try {
      const product = await dispatch(fetchProductByLpn(scannedText)).unwrap();
      console.log('[LPN Scan] Product found:', product);

      setResult({ lpn: scannedText, product });
      setScanCount((prev) => prev + 1);
      setScanFeedback(`Quét thành công: ${product.productName}`);
      setTimeout(() => setScanFeedback(null), 4000);
    } catch (err) {
      console.error('[LPN Scan] Error:', err);
      const msg = typeof err === 'string' ? err : 'Không tìm thấy sản phẩm với mã LPN này!';
      setErrorMsg(msg);
      toast.warning(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans text-neutral-800">
      {/* ── Sticky Header ── */}
      <header className="bg-white border-b border-slate-100 flex items-center justify-between px-4 py-3.5 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-neutral-900 tracking-tight leading-none">
              Quét mã LPN
            </h1>
            <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wide">
              Logistics WMS
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowScanner(true)}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
          id="lpn-scan-trigger-btn"
        >
          <ScanQrCode className="w-4 h-4" />
          <span>Quét LPN</span>
        </button>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-5 pb-32 space-y-4">

        {/* Success feedback banner */}
        {scanFeedback && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 rounded-xl text-xs font-bold text-center animate-bounce flex items-center justify-center gap-2">
            <CircleCheckBig size={15} />
            <span>{scanFeedback}</span>
          </div>
        )}

        {/* Error banner */}
        {errorMsg && !isLoading && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold space-y-1">
            <p className="font-extrabold">⚠️ Lỗi tra cứu LPN</p>
            <p className="font-medium">{errorMsg}</p>
            {lastScannedRaw && (
              <p className="font-mono text-[10px] text-red-400 bg-red-100 px-2 py-1 rounded-lg break-all">
                Mã đã quét: {lastScannedRaw}
              </p>
            )}
          </div>
        )}

        {/* Debug: last scanned (shown while loading too) */}
        {lastScannedRaw && isLoading && (
          <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-[10px] font-mono text-blue-600 break-all">
            Đang tra: {lastScannedRaw}
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-xs text-slate-500 font-semibold">Đang tra cứu sản phẩm...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !result && (
          <div className="flex flex-col items-center justify-center py-20 space-y-5 text-center">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 border-2 border-dashed border-blue-200 flex items-center justify-center">
              <ScanQrCode className="w-10 h-10 text-blue-400" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-extrabold text-slate-700">Chưa có kết quả quét</p>
              <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[220px]">
                Nhấn nút <span className="font-bold text-blue-600">Quét LPN</span> ở góc phải để bắt đầu quét mã QR kiện hàng.
              </p>
            </div>
            <button
              onClick={() => setShowScanner(true)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              id="lpn-scan-empty-btn"
            >
              <ScanQrCode className="w-4 h-4" />
              Bắt đầu quét
            </button>
          </div>
        )}

        {/* Product Info Card */}
        {!isLoading && result && (
          <div className="space-y-3">
            {/* Scan count badge */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400">
                Thông tin kiện hàng
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                Đã quét {scanCount} lần
              </span>
            </div>

            {/* Main card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-4">
              {/* Product header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <Boxes className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-extrabold text-slate-800 leading-snug break-words">
                    {result.product.productName}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {result.product.productCode}
                  </p>
                </div>
                <button
                  onClick={() => setResult(null)}
                  className="shrink-0 p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                  id="clear-scan-result-btn"
                  title="Xoá kết quả"
                >
                  <X size={14} />
                </button>
              </div>

              {/* LPN barcode row */}
              <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100 gap-3">
                <ScanQrCode size={16} className="text-blue-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold block tracking-wide">
                    Mã LPN
                  </span>
                  <span className="text-xs font-black text-slate-800 font-mono">{result.lpn}</span>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Unit */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Tag size={11} />
                    <span className="text-[10px] uppercase font-extrabold tracking-wide">
                      Đơn vị tính
                    </span>
                  </div>
                  <p className="text-sm font-black text-slate-800">{result.product.unit}</p>
                </div>

                {/* Min stock */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <BarChart3 size={11} />
                    <span className="text-[10px] uppercase font-extrabold tracking-wide">
                      Tồn tối thiểu
                    </span>
                  </div>
                  <p className="text-sm font-black text-slate-800">
                    {result.product.minStockLevel}
                  </p>
                </div>
              </div>

              {/* Product group */}
              {result.product.productGroup && (
                <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100 gap-3">
                  <Layers size={14} className="text-purple-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold block tracking-wide">
                      Nhóm sản phẩm
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {result.product.productGroup.groupName}
                    </span>
                  </div>
                </div>
              )}

              {/* Description */}
              {result.product.description && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <span className="text-[10px] text-blue-400 uppercase font-extrabold block tracking-wide mb-1">
                    Ghi chú sản phẩm
                  </span>
                  <p className="text-xs text-blue-800 font-medium leading-relaxed">
                    {result.product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Re-scan button */}
            <button
              onClick={() => setShowScanner(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-dashed border-blue-200 rounded-2xl text-blue-600 text-xs font-bold hover:bg-blue-50 transition-colors"
              id="rescan-lpn-btn"
            >
              <ScanQrCode size={14} />
              Quét mã LPN khác
            </button>
          </div>
        )}
      </main>

      {/* ── QR Scanner Overlay ── */}
      {showScanner && (
        <QrCameraScanner onClose={() => setShowScanner(false)} onScan={handleScan} />
      )}
    </div>
  );
}
