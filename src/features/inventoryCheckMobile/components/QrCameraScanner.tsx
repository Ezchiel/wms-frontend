import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, RefreshCw, CameraOff, Keyboard, Loader2 } from 'lucide-react';


interface QrCameraScannerProps {
  onScan: (value: string) => void;
  onClose: () => void;
}

export default function QrCameraScanner({ onScan, onClose }: QrCameraScannerProps) {
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied' | 'error'>('pending');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [manualValue, setManualValue] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Audio Web API beep helper
  const playBeep = () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) {
        console.warn('Browser does not support AudioContext');
        return;
      }

      const audioCtx = new AudioContextClass();
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
        audioCtx.close().catch(() => { });
      }, 100);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  };

  // 1. Request/Verify Camera Permission
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionStatus('error');
      setIsInitializing(false);
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        // Stop the temporary stream right away
        stream.getTracks().forEach((track) => track.stop());
        setPermissionStatus('granted');
      })
      .catch((err) => {
        console.warn('Camera permission check failed:', err);
        setPermissionStatus('denied');
        setIsInitializing(false);
      });
  }, []);

  // 2. Initialize and Start/Stop Scanner
  useEffect(() => {
    if (permissionStatus !== 'granted') return;

    let isMounted = true;
    setIsInitializing(true);

    // Give react time to mount the #qr-reader div
    const timer = setTimeout(() => {
      if (!isMounted) return;

      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      html5QrCode
        .start(
          { facingMode: facingMode },
          {
            fps: 10,
            qrbox: (width, height) => {
              const size = Math.min(width, height) * 0.7;
              return { width: size, height: size };
            },
          },
          (decodedText) => {
            if (isMounted) {
              playBeep();
              // Stop scanning and trigger callback
              html5QrCode
                .stop()
                .then(() => {
                  onScan(decodedText);
                })
                .catch((err) => {
                  console.error('Failed to stop camera after success scan:', err);
                  onScan(decodedText);
                });
            }
          },
          () => {
            // Quietly ignore scan failures (common when QR is not in camera field of view)
          }
        )
        .then(() => {
          if (isMounted) {
            setIsInitializing(false);
          }
        })
        .catch((err) => {
          console.error('Html5Qrcode start error:', err);
          if (isMounted) {
            setIsInitializing(false);
            // Fallback to error/denied state if start failed
            setPermissionStatus('error');
          }
        });
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((err) => {
          console.warn('Cleanup stop error:', err);
        });
      }
    };
  }, [permissionStatus, facingMode]);

  // Handle Manual Input Submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualValue.trim()) return;

    playBeep();
    onScan(manualValue.trim());
  };

  // Toggle Camera Facing Mode
  const toggleCamera = () => {
    if (isInitializing) return;
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

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
        /* Override html5-qrcode standard styling dynamically */
        #qr-reader video {
          object-fit: cover !important;
          border-radius: 1rem !important;
        }
      `}</style>

      {/* Header Bar */}
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
              <RefreshCw size={20} className={isInitializing ? 'animate-spin' : ''} />
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

      {/* Main scanner viewport */}
      <div className="relative flex flex-1 flex-col items-center justify-center w-full max-w-md my-4">
        {permissionStatus === 'pending' || isInitializing ? (
          <div className="flex flex-col items-center justify-center space-y-3 p-8 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-sm font-medium text-zinc-400">Đang chuẩn bị camera...</p>
          </div>
        ) : permissionStatus === 'granted' ? (
          <div className="relative w-[285px] h-[285px] rounded-3xl overflow-hidden border-2 border-zinc-800 bg-zinc-900 shadow-2xl">
            {/* The html5-qrcode element */}
            <div id="qr-reader" className="w-full h-full" />

            {/* Target overlay corners */}
            <div className="absolute top-4 left-4 h-6 w-6 border-t-4 border-l-4 border-blue-500 rounded-tl-md pointer-events-none z-10" />
            <div className="absolute top-4 right-4 h-6 w-6 border-t-4 border-r-4 border-blue-500 rounded-tr-md pointer-events-none z-10" />
            <div className="absolute bottom-4 left-4 h-6 w-6 border-b-4 border-l-4 border-blue-500 rounded-bl-md pointer-events-none z-10" />
            <div className="absolute bottom-4 right-4 h-6 w-6 border-b-4 border-r-4 border-blue-500 rounded-br-md pointer-events-none z-10" />

            {/* Scanning red laser line */}
            <div className="scanner-laser absolute left-4 right-4 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] z-10 pointer-events-none" />

            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-zinc-300 font-bold bg-black/60 px-3 py-1 rounded-full z-10 pointer-events-none tracking-wide">
              Đang quét...
            </p>
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

      {/* Manual Input Fallback (At bottom) */}
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
              className="bg-blue-600 disabled:bg-zinc-800 hover:bg-blue-700 disabled:text-zinc-500 text-white font-extrabold text-xs px-5 rounded-xl transition-colors active:scale-95 transition-transform"
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
