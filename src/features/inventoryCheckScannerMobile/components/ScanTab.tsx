import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Flashlight,
  Keyboard,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  Upload,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import type { Product } from '../inventoryCheckScannerMobileTypes';

interface ScanTabProps {
  products: Product[];
  onRefreshProducts: () => void;
  onSetTab: (tab: string) => void;
  onRequestProductCount: (sku: string) => void;
  selectedProductFromInventory?: Product | null;
}

export default function ScanTab({
  products,
  onRefreshProducts,
  onSetTab,
  selectedProductFromInventory,
}: ScanTabProps) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [physicalCount, setPhysicalCount] = useState<number>(10);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [manualSkuInput, setManualSkuInput] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);

  // Image Upload Scan states
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [scanError, setScanError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Status updates
  const [confirmStatus, setConfirmStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [reportNote, setReportNote] = useState('');
  const [showReportPanel, setShowReportPanel] = useState(false);

  // Load a product when user selects from catalog
  useEffect(() => {
    if (selectedProductFromInventory) {
      handleLoadProduct(selectedProductFromInventory);
    } else {
      // Default to Dell screen as shown in sample
      const dell = products.find((p) => p.sku === 'DELL-U2723QE-001');
      if (dell) {
        handleLoadProduct(dell);
      }
    }
  }, [selectedProductFromInventory, products]);

  // Turn on/off camera stream
  const toggleCamera = async () => {
    if (cameraActive) {
      stopCamera();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        streamRef.current = stream;
        setCameraActive(true);
      } catch (err) {
        console.warn('Camera access denied or unavailable: ', err);
        alert(
          'Không thể truy cập camera. Hệ thống đã tự động chuyển sang Chế độ Mô phỏng Kiểm kho thông minh.'
        );
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleLoadProduct = (product: Product) => {
    setActiveProduct(product);
    setPhysicalCount(product.physicalQty !== null ? product.physicalQty : product.systemQty);
    setReportNote(product.note || '');
    setShowReportPanel(false);
  };

  // Preset triggers simulating physical barcode detection
  const triggerSampleScan = (sku: string) => {
    const match = products.find((p) => p.sku === sku);
    if (match) {
      handleLoadProduct(match);
      // Play a positive visual audio/vibe
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } else {
      alert(`Không tìm thấy mã SKU: ${sku}`);
    }
  };

  // Upload an image and send to server-side Gemini API
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningImage(true);
    setScanError('');

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).replace(/^data:image\/[a-z]+;base64,/, '');

      try {
        const res = await fetch('/api/scan-barcode-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64String }),
        });

        const data = await res.json();
        if (res.ok && data.sku) {
          const matchedProduct = products.find((p) => p.sku === data.sku.toUpperCase().trim());
          if (matchedProduct) {
            handleLoadProduct(matchedProduct);
            alert(`AI quét thành công!\nThiết bị: Tên: ${matchedProduct.name}\nSKU: ${data.sku}`);
          } else {
            // Let's create a dynamic temporary item with details predicted by Gemini!
            alert(
              `AI tìm thấy mã mới: ${data.sku}\nMô tả: ${data.detectedText || 'Sản phẩm SKU mới'}.\nHệ thống sẽ khởi tạo sản phẩm kiểm kho tạm thời.`
            );

            // Create a new product automatically
            const newRes = await fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: data.detectedText || `Sản phẩm SKU ${data.sku}`,
                sku: data.sku,
                systemQty: Math.floor(Math.random() * 20) + 5,
              }),
            });
            if (newRes.ok) {
              const newProd = await newRes.json();
              onRefreshProducts();
              handleLoadProduct(newProd);
            }
          }
        } else {
          setScanError(
            data.error ||
              'Không nhận dạng được mã vạch từ ảnh này. Vui lòng chọn ảnh chứa mã vạch rõ ràng.'
          );
        }
      } catch (err: any) {
        setScanError('Lỗi kết nối AI Scanner. Hãy thử lại hoặc nhập mã thủ công.');
      } finally {
        setIsScanningImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Manual entry submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSkuInput) return;

    const matched = products.find(
      (p) => p.sku.toUpperCase() === manualSkuInput.toUpperCase().trim()
    );
    if (matched) {
      handleLoadProduct(matched);
      setShowManualModal(false);
      setManualSkuInput('');
    } else {
      // Ask to create a new item
      const confirmed = window.confirm(
        `SKU này không có sẵn. Bạn có muốn khởi tạo sản phẩm mới có mã "${manualSkuInput.toUpperCase()}"?`
      );
      if (confirmed) {
        const defaultName = prompt('Nhập tên sản phẩm mới:', 'Sản phẩm tự tạo');
        const defaultQty = parseInt(
          prompt('Nhập số lượng tồn kho trên hệ thống:', '10') || '10',
          10
        );

        if (defaultName) {
          fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: defaultName,
              sku: manualSkuInput.toUpperCase(),
              systemQty: defaultQty,
            }),
          })
            .then((res) => res.json())
            .then((newP) => {
              onRefreshProducts();
              handleLoadProduct(newP);
              setShowManualModal(false);
              setManualSkuInput('');
            });
        }
      }
    }
  };

  // Save changes
  const handleConfirmCount = async () => {
    if (!activeProduct) return;
    setConfirmStatus('loading');

    const statusValue = physicalCount === activeProduct.systemQty ? 'matched' : 'mismatched';

    try {
      // Update inventory on backend
      await fetch(`/api/products/${activeProduct.sku}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          physicalQty: physicalCount,
          checked: true,
          status: statusValue,
          lastCheckedAt: new Date().toLocaleString('vi-VN'),
          note: reportNote || null,
        }),
      });

      // Insert scanning history
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: activeProduct.sku,
          productName: activeProduct.name,
          systemQty: activeProduct.systemQty,
          physicalQty: physicalCount,
          status: statusValue,
          note: reportNote || 'Kiểm kê hoàn tất bình thường',
          userEmail: 'hoangquocluat88@gmail.com',
        }),
      });

      onRefreshProducts();
      setConfirmStatus('success');

      setTimeout(() => {
        setConfirmStatus('idle');
        // Clear active product scan panel or keep active? Keep active with updated values
        handleLoadProduct({
          ...activeProduct,
          physicalQty: physicalCount,
          checked: true,
          status: statusValue,
        });
      }, 1500);
    } catch (err) {
      alert('Đã xảy ra lỗi khi lưu kết quả kiểm kê.');
      setConfirmStatus('idle');
    }
  };

  // Register an official report anomaly
  const handleReportIssue = async () => {
    if (!activeProduct) return;

    const noteText = reportNote.trim() || prompt('Nhập nguyên nhân/báo cáo lệch:');
    if (!noteText) return;

    try {
      // Update inventory status with "mismatched" or keep what it is
      await fetch(`/api/products/${activeProduct.sku}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          physicalQty: physicalCount,
          checked: true,
          status: 'reported',
          lastCheckedAt: new Date().toLocaleString('vi-VN'),
          note: noteText,
        }),
      });

      // Insert history and reports
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: activeProduct.sku,
          productName: activeProduct.name,
          systemQty: activeProduct.systemQty,
          physicalQty: physicalCount,
          status: 'reported',
          note: `Báo cáo lệch: ${noteText}`,
          userEmail: 'hoangquocluat88@gmail.com',
        }),
      });

      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: activeProduct.sku,
          productName: activeProduct.name,
          qtyDifference: physicalCount - activeProduct.systemQty,
          note: noteText,
          userEmail: 'hoangquocluat88@gmail.com',
        }),
      });

      onRefreshProducts();
      alert('Đã ghi nhận báo cáo lệch kho về sự cố thành công!');

      handleLoadProduct({
        ...activeProduct,
        physicalQty: physicalCount,
        checked: true,
        status: 'reported',
        note: noteText,
      });
    } catch (err) {
      alert('Lỗi khi gửi báo cáo.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Banner - Proactive interactive aids */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Mô phỏng Quét mã:</strong> Hãy nhấn trực tiếp vào các nút sản phẩm mẫu dưới đây
            để mô phỏng hành vi tít còi từ xa của máy quét! Hoặc tải lên ảnh chứa mã vạch để trải
            nghiệm AI tự động đọc mã.
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1 md:mt-0">
          <button
            onClick={() => triggerSampleScan('DELL-U2723QE-001')}
            className="px-2 py-1 bg-white hover:bg-neutral-100 border border-blue-300 rounded text-[10px] font-semibold text-blue-700 transition"
          >
            Dell 27"
          </button>
          <button
            onClick={() => triggerSampleScan('LOGI-MXM3S-002')}
            className="px-2 py-1 bg-white hover:bg-neutral-100 border border-blue-300 rounded text-[10px] font-semibold text-blue-700 transition"
          >
            MX Mouse 3S
          </button>
          <button
            onClick={() => triggerSampleScan('KEYC-K2PRO-003')}
            className="px-2 py-1 bg-white hover:bg-neutral-100 border border-blue-300 rounded text-[10px] font-semibold text-blue-700 transition"
          >
            Keychron K2
          </button>
          <button
            onClick={() => triggerSampleScan('SONY-WHXM5-004')}
            className="px-2 py-1 bg-white hover:bg-neutral-100 border border-blue-300 rounded text-[10px] font-semibold text-blue-700 transition"
          >
            Sony WH
          </button>
        </div>
      </div>

      {/* Viewfinder Section */}
      <section className="relative w-full aspect-4/5 max-h-115 md:max-h-125 rounded-2xl overflow-hidden bg-zinc-950 shadow-xl border border-zinc-800 flex flex-col items-center justify-center">
        {/* Scanner overlay effect */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none z-10"></div>

        {/* Focal scan box target */}
        <div className="absolute top-[25%] left-[12%] right-[12%] bottom-[35%] border-2 border-blue-500 rounded-xl z-20 pointer-events-none transition-all">
          {/* Neon focus corners */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white -translate-x-1 -translate-y-1 rounded-tl-sm"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white translate-x-1 -translate-y-1 rounded-tr-sm"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white -translate-x-1 translate-y-1 rounded-bl-sm"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white translate-x-1 translate-y-1 rounded-br-sm"></div>

          {/* Center scan line */}
          <div className="absolute left-0 w-full scan-line top-1/2 -translate-y-1/2"></div>
        </div>

        {/* Live camera stream feed */}
        {cameraActive ? (
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
        ) : (
          /* Simulated high-fidelity static render with original warehouse image */
          <img
            alt="Warehouse Shelf"
            className="w-full h-full object-cover transition-opacity duration-300"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDNbJQXCd0KoCVr22tJyEtBo2hiLZ0amTVUX9IUyswBkSrsQ_GLnia2dwSCjnlF4_Psb660CsTeOvq5EIzK6pabNEwWR8iATvsNS3IDuTLrV2VHz-298kxYR2qyerZyCWo4R7jmYi4yLvSehmzqzTDs5L_xj8lPq8EBoyfMaPaA7m-3O7PnIjSnoUQsa_606H73NQmpo9UApG4Vfwl-0who3DpEJP1mTNIr81vI4X7u5cDsq8ekjRT3e3jTQH_5mpQb4Z-iAwXSezV"
          />
        )}

        {/* Upload overlay indicator / Error */}
        {isScanningImage && (
          <div className="absolute inset-0 bg-black/80 z-40 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-white font-medium text-sm">
              Trình AI của Gemini đang phân tích mã vạch...
            </p>
            <p className="text-neutral-400 text-xs">Vui lòng chờ trong giây lát</p>
          </div>
        )}

        {scanError && (
          <div className="absolute top-4 left-4 right-4 bg-red-900/95 border border-red-500 rounded-xl p-3 z-40 text-xs text-white flex justify-between items-center shadow-lg">
            <span>{scanError}</span>
            <button
              onClick={() => setScanError('')}
              className="ml-2 font-bold px-1 text-red-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Overlay controls - Floating camera actions */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 z-30">
          {/* Flashlight toggle */}
          <button
            type="button"
            onClick={() => setFlashlightOn(!flashlightOn)}
            className={`p-3.5 rounded-full backdrop-blur-md transition-all active:scale-95 border ${
              flashlightOn
                ? 'bg-amber-500 border-amber-400 text-black shadow-lg shadow-amber-500/20'
                : 'bg-black/60 border-white/15 text-white hover:bg-black/80'
            }`}
            title="Đèn pin"
          >
            <Flashlight className="w-5 h-5" />
          </button>

          {/* Real Camera Access toggle */}
          <button
            type="button"
            onClick={toggleCamera}
            className={`px-5 py-3 rounded-full font-semibold text-xs flex items-center gap-2 border backdrop-blur-md transition-all active:scale-95 ${
              cameraActive
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-black/60 border-white/15 text-white hover:bg-black/80'
            }`}
          >
            <Camera className="w-4 h-4" />
            {cameraActive ? 'Tắt Camera' : 'Bật Camera Quét'}
          </button>

          {/* AI Upload scan */}
          <label className="p-3.5 rounded-full bg-black/60 border border-white/15 text-white hover:bg-black/80 backdrop-blur-md transition-all active:scale-95 cursor-pointer flex justify-center items-center">
            <Upload className="w-5 h-5" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>

          {/* Manual keyboard modal */}
          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="px-5 py-3 rounded-full bg-black/60 border border-white/15 text-white hover:bg-black/80 font-medium text-xs backdrop-blur-md active:scale-95 transition-all flex items-center gap-2"
          >
            <Keyboard className="w-4 h-4" />
            Nhập Mã SKU
          </button>
        </div>
      </section>

      {/* Product Detail Card (Appears after scan) */}
      {activeProduct && (
        <section className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1 flex-1">
              <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded mb-1 uppercase tracking-wider">
                {activeProduct.checked ? 'Đã Kiểm Kê Cơ Bản' : 'Đã Quét Thành Công'}
              </span>
              <h2 className="text-xl font-bold text-neutral-900 leading-tight">
                {activeProduct.name}
              </h2>
              <p className="text-sm font-medium text-neutral-500 flex items-center gap-1">
                <span className="font-semibold text-blue-600">SKU:</span> {activeProduct.sku}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] font-semibold text-neutral-400 block uppercase tracking-wider">
                Tồn Hệ Thống
              </span>
              <span className="text-3xl font-extrabold text-neutral-900 leading-tight">
                {activeProduct.systemQty}
              </span>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-4 space-y-4">
            <div>
              <label
                className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider mb-2"
                htmlFor="physical_qty"
              >
                Số Lượng Thực Tế Kiểm Kê (Physical Quantity)
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="w-14 h-14 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl border border-neutral-200 transition-colors active:scale-95"
                  onClick={() => setPhysicalCount((prev) => Math.max(0, prev - 1))}
                >
                  <Minus className="w-5 h-5" />
                </button>

                <input
                  className="flex-1 h-14 text-center text-xl font-extrabold bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-neutral-900"
                  id="physical_qty"
                  type="number"
                  value={physicalCount}
                  onChange={(e) => setPhysicalCount(parseInt(e.target.value) || 0)}
                  min="0"
                />

                <button
                  type="button"
                  className="w-14 h-14 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl border border-neutral-200 transition-colors active:scale-95"
                  onClick={() => setPhysicalCount((prev) => prev + 1)}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Note Panel for any discrepancies */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowReportPanel(!showReportPanel)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
              >
                {showReportPanel
                  ? 'Ẩn ghi chú báo cáo'
                  : '✍️ Thêm ghi chú hoặc báo cáo lỗi sản phẩm...'}
              </button>

              {showReportPanel && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <textarea
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    placeholder="Ví dụ: Vỏ hộp bị móp nhẹ, thừa 1 thiết bị so với danh sách đóng gói..."
                    className="w-full text-sm p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-18 text-neutral-800 placeholder-neutral-400"
                  />
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleReportIssue}
                className="bg-red-50 text-red-700 hover:bg-red-100 font-semibold text-sm h-13 rounded-xl flex items-center justify-center gap-2 border border-red-200 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                Yêu Cầu Báo Lệch
              </button>

              <button
                type="button"
                onClick={handleConfirmCount}
                disabled={confirmStatus !== 'idle'}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm h-13 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
                  confirmStatus !== 'idle' ? 'opacity-80 cursor-wait' : ''
                }`}
              >
                {confirmStatus === 'loading' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : confirmStatus === 'success' ? (
                  <CheckCircle className="w-4 h-4 animate-bounce" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {confirmStatus === 'success' ? 'Đã Xác Nhận ✔' : 'Xác Nhận Số Lượng'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Manual Entry Modal Dialog */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4 border border-neutral-100 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-lg text-neutral-900">Nhập Mã SKU Thủ Công</h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-neutral-400 hover:text-neutral-600 font-semibold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">
                  Mã SKU Sản Phẩm
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: DELL-U2723QE-001"
                  value={manualSkuInput}
                  onChange={(e) => setManualSkuInput(e.target.value)}
                  className="w-full h-12 px-4 bg-neutral-100 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono uppercase font-bold text-neutral-900"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-neutral-500 hover:bg-neutral-100 rounded-lg transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition shadow"
                >
                  Áp dụng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
