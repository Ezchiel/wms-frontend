import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, RefreshCw, CameraOff, Keyboard, Loader2 } from 'lucide-react';

interface QrCameraScannerProps {
  onScan: (value: string) => void;
  onClose: () => void;
}

const SCANNER_ELEMENT_ID = 'qr-reader';

export default function QrCameraScanner({ onScan, onClose }: QrCameraScannerProps) {
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied' | 'error'>('pending');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [manualValue, setManualValue] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);

  // Refs to track scanner lifecycle — avoids stale closures & race conditions
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScannerRunning = useRef(false);
  const isUnmounted = useRef(false);

  // ── Audio beep ──────────────────────────────────────────────────────────
  const playBeep = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      setTimeout(() => { osc.stop(); ctx.close().catch(() => { }); }, 100);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  };

  // ── Stop scanner safely ─────────────────────────────────────────────────
  const stopScanner = useCallback(async () => {
    if (scannerRef.current && isScannerRunning.current) {
      isScannerRunning.current = false;
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.warn('stopScanner error (ignored):', err);
      }
      try {
        scannerRef.current.clear();
      } catch (_) { }
      scannerRef.current = null;
    }
  }, []);

  // ── Start scanner ───────────────────────────────────────────────────────
  const startScanner = useCallback(async (facing: 'environment' | 'user') => {
    if (isUnmounted.current) return;

    // Stop any running instance first
    await stopScanner();

    if (isUnmounted.current) return;

    setIsInitializing(true);

    // Wait for the #qr-reader div to be in the DOM
    // Use a polling approach — more reliable than a fixed timeout
    const waitForElement = (): Promise<void> =>
      new Promise((resolve, reject) => {
        let attempts = 0;
        const check = () => {
          if (isUnmounted.current) { reject(new Error('unmounted')); return; }
          const el = document.getElementById(SCANNER_ELEMENT_ID);
          if (el) { resolve(); return; }
          attempts++;
          if (attempts > 30) { reject(new Error('element not found')); return; }
          setTimeout(check, 100);
        };
        check();
      });

    try {
      await waitForElement();
    } catch (err) {
      if (!isUnmounted.current) {
        console.error('QR reader element never appeared:', err);
        setPermissionStatus('error');
        setIsInitializing(false);
      }
      return;
    }

    if (isUnmounted.current) return;

    const html5QrCode = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = html5QrCode;

    try {
      await html5QrCode.start(
        { facingMode: facing },
        {
          fps: 10,
          qrbox: (width: number, height: number) => {
            const size = Math.min(width, height) * 0.7;
            return { width: size, height: size };
          },
        },
        (decodedText: string) => {
          if (!isUnmounted.current) {
            playBeep();
            isScannerRunning.current = false;
            html5QrCode
              .stop()
              .catch(() => { })
              .finally(() => {
                scannerRef.current = null;
                onScan(decodedText);
              });
          }
        },
        () => {
          // Ignore per-frame errors — normal when no QR in frame
        }
      );

      if (!isUnmounted.current) {
        isScannerRunning.current = true;
        setIsInitializing(false);
      } else {
        // Component unmounted while we were starting — clean up
        isScannerRunning.current = true; // so stopScanner works
        await stopScanner();
      }
    } catch (err) {
      console.error('Html5Qrcode start error:', err);
      scannerRef.current = null;
      if (!isUnmounted.current) {
        setIsInitializing(false);
        setPermissionStatus('error');
      }
    }
  }, [onScan, stopScanner]);

  // ── Step 1: Check camera permission ────────────────────────────────────
  useEffect(() => {
    isUnmounted.current = false;

    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionStatus('error');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        stream.getTracks().forEach((t) => t.stop());
        if (!isUnmounted.current) {
          setPermissionStatus('granted');
        }
      })
      .catch((err) => {
        console.warn('Camera permission denied:', err);
        if (!isUnmounted.current) {
          setPermissionStatus('denied');
        }
      });

    return () => {
      isUnmounted.current = true;
    };
  }, []);

  // ── Step 2: Start scanner once permission granted ───────────────────────
  useEffect(() => {
    if (permissionStatus !== 'granted') return;

    startScanner(facingMode);

    return () => {
      // Cleanup on facingMode change or unmount
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionStatus, facingMode]);

  // ── Global unmount cleanup ──────────────────────────────────────────────
  useEffect(() => {
    return () => {
      isUnmounted.current = true;
      stopScanner();
    };
  }, [stopScanner]);

  // ── Manual input ────────────────────────────────────────────────────────
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualValue.trim()) return;
    playBeep();
    onScan(manualValue.trim());
  };

  const toggleCamera = () => {
    if (isInitializing) return;
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-zinc-950/95 p-4 text-white font-sans backdrop-blur-md">
      <style>{`
        @keyframes laser {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
        .scanner-laser {
          animation: laser 2.5s infinite linear;
        }
        #${SCANNER_ELEMENT_ID} video {
          object-fit: cover !important;
          border-radius: 1rem !important;
        }
        /* Hide the default html5-qrcode UI chrome */
        #${SCANNER_ELEMENT_ID} > img,
        #${SCANNER_ELEMENT_ID} > div[style*="display: none"],
        #${SCANNER_ELEMENT_ID} > div > select {
          display: none !important;
        }
      `}</style>

      {/* Header */}
      <div className="flex w-full max-w-md items-center justify-between py-2">
        <h2 className="text-base font-extrabold tracking-wide text-zinc-200">Quét mã QR / Barcode</h2>
        <div className="flex gap-2">
          {permissionStatus === 'granted' && !isInitializing && (
            <button
              onClick={toggleCamera}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 active:scale-90 transition-transform"
              title="Đổi camera"
              id="scanner-toggle-camera-btn"
            >
              <RefreshCw size={20} />
            </button>
          )}
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 active:scale-90 transition-transform"
            id="close-scanner-btn"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Scanner viewport */}
      <div className="relative flex flex-1 flex-col items-center justify-center w-full max-w-md my-4">
        {permissionStatus === 'pending' ? (
          <div className="flex flex-col items-center justify-center space-y-3 p-8 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-sm font-medium text-zinc-400">Đang xin quyền camera...</p>
          </div>
        ) : permissionStatus === 'granted' ? (
          <div className="relative w-[285px] h-[285px] rounded-3xl overflow-hidden border-2 border-zinc-800 bg-zinc-900 shadow-2xl">
            {/* The html5-qrcode mount point — always in DOM when granted */}
            <div id={SCANNER_ELEMENT_ID} className="w-full h-full" />

            {/* Loading overlay — shown on top while initialising */}
            {isInitializing && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-900/90 rounded-3xl gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-xs font-semibold text-zinc-400">Đang khởi động camera...</p>
              </div>
            )}

            {/* Corner targets */}
            {!isInitializing && (
              <>
                <div className="absolute top-4 left-4 h-6 w-6 border-t-4 border-l-4 border-blue-500 rounded-tl-md pointer-events-none z-10" />
                <div className="absolute top-4 right-4 h-6 w-6 border-t-4 border-r-4 border-blue-500 rounded-tr-md pointer-events-none z-10" />
                <div className="absolute bottom-4 left-4 h-6 w-6 border-b-4 border-l-4 border-blue-500 rounded-bl-md pointer-events-none z-10" />
                <div className="absolute bottom-4 right-4 h-6 w-6 border-b-4 border-r-4 border-blue-500 rounded-br-md pointer-events-none z-10" />
                <div className="scanner-laser absolute left-4 right-4 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] z-10 pointer-events-none" />
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-zinc-300 font-bold bg-black/60 px-3 py-1 rounded-full z-10 pointer-events-none tracking-wide">
                  Đang quét...
                </p>
              </>
            )}
          </div>
        ) : permissionStatus === 'denied' ? (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-xs bg-zinc-900/60 rounded-3xl border border-zinc-800">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
              <CameraOff size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-zinc-200">Không có quyền camera</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Vui lòng cấp quyền truy cập camera trong cài đặt trình duyệt (hoặc ấn vào ổ khóa trên thanh địa chỉ) để thực hiện quét mã.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-xs bg-zinc-900/60 rounded-3xl border border-zinc-800">
            <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
              <CameraOff size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-zinc-200">Không tìm thấy Camera hoặc lỗi SSL</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Trình duyệt không hỗ trợ hoặc kết nối hiện tại không phải HTTPS (Camera yêu cầu môi trường bảo mật).
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Manual input fallback */}
      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800/80 rounded-3xl p-5 mb-26 shadow-xl">
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-300">
            <Keyboard size={16} className="text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Nhập mã thủ công</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualValue}
              onChange={(e) => setManualValue(e.target.value)}
              placeholder="Nhập barcode vị trí hoặc LPN sản phẩm..."
              className="flex-1 bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              id="manual-scanner-input"
            />
            <button
              type="submit"
              disabled={!manualValue.trim()}
              className="bg-blue-600 disabled:bg-zinc-800 hover:bg-blue-700 disabled:text-zinc-500 text-white font-extrabold text-xs px-5 rounded-xl transition-colors active:scale-95"
              id="manual-scanner-submit-btn"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}