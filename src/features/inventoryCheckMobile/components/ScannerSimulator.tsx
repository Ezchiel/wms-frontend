import { useState, useEffect } from 'react';
import { MOCK_PRODUCTS, type Product } from '../inventoryCheckMobileTypes';

interface ScannerSimulatorProps {
  onScan: (sku: string) => void;
  onClose: () => void;
  allowedZone?: string | null;
}

export default function ScannerSimulator({ onScan, onClose, allowedZone }: ScannerSimulatorProps) {
  const [successSku, setSuccessSku] = useState<string | null>(null);
  const [laserPosition, setLaserPosition] = useState(10);
  const [direction, setDirection] = useState(1);

  // Filter products that belong to the allowed zone if any
  const availableProducts = MOCK_PRODUCTS.filter((p) => {
    if (!allowedZone) return true;
    return p.zone === allowedZone;
  });

  // Animated laser line effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLaserPosition((pos) => {
        if (pos >= 90) {
          setDirection(-1);
          return 89;
        } else if (pos <= 10) {
          setDirection(1);
          return 11;
        }
        return pos + direction * 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [direction]);

  // Audio web api beep effect helper
  const playBeep = () => {
    try {
      const audioCtx = new window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // 800Hz beep
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 100);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  };

  const handleSimulateScan = (product: Product) => {
    playBeep();
    setSuccessSku(product.sku);
    setTimeout(() => {
      onScan(product.sku);
      setSuccessSku(null);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-4 text-white">
      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/35 active:scale-90 transition-transform"
          id="close-scanner-btn"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Main scanner visor frame */}
      <div className="relative flex h-64 w-64 flex-col items-center justify-center rounded-3xl border-4 border-dashed border-blue-500 bg-zinc-900/60 shadow-2xl">
        {/* Red laser line */}
        <div
          className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] transition-all"
          style={{ top: `${laserPosition}%` }}
        />

        {/* Scan targets indicators */}
        <div className="absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-blue-400" />
        <div className="absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-blue-400" />
        <div className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-blue-400" />
        <div className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-blue-400" />

        {successSku ? (
          <div className="flex flex-col items-center justify-center space-y-2 animate-bounce">
            <span className="material-symbols-outlined text-5xl text-green-400">check_circle</span>
            <p className="font-mono text-sm tracking-wider text-green-300">SCAN SUCCESS</p>
            <p className="text-xs bg-green-500/10 px-2 py-0.5 rounded text-green-200 font-mono font-bold">
              {successSku}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-4">
            <span className="material-symbols-outlined text-4xl text-zinc-400 animate-pulse">
              qr_code_scanner
            </span>
            <p className="mt-2 text-sm text-zinc-300 font-medium">Đặt mã vạch vào khung hình</p>
            <p className="text-xs text-zinc-500 mt-1">Đang giả lập camera quét...</p>
          </div>
        )}
      </div>

      <div className="mt-6 text-center max-w-sm">
        <h3 className="text-base font-semibold">Giả lập máy quét Barcode</h3>
        <p className="text-xs text-zinc-400 mt-1">
          Tại thiết bị di động, camera sẽ quét trực tiếp. Ở đây bạn có thể nhấn chọn một sản phẩm
          bên dưới để giả lập hành động quét thành công:
        </p>

        {allowedZone && (
          <div className="mt-2 text-xs text-amber-300 bg-amber-500/10 px-3 py-1 rounded inline-block">
            Lọc theo: {allowedZone}
          </div>
        )}
      </div>

      {/* Product List Selector Simulation */}
      <div className="mt-4 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col max-h-56">
        <p className="text-xs text-zinc-400 font-semibold mb-2 uppercase tracking-wide">
          Click để &quot;Quét&quot; các sản phẩm có sẵn:
        </p>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {availableProducts.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-4">
              Không có sản phẩm thích hợp trong Zone này.
            </p>
          ) : (
            availableProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSimulateScan(p)}
                disabled={successSku !== null}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 hover:border-blue-500 transition-all text-left active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl">📦</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                    <p className="text-[10px] font-mono text-zinc-400">
                      SKU: <span className="text-blue-300">{p.sku}</span> | Khay: {p.zone} -{' '}
                      {p.rack}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-500/25 text-blue-300 px-2 py-0.5 rounded shrink-0 font-medium font-mono">
                  Quét nhanh
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
