import { useState, useEffect } from 'react';
import { type Product } from '../inventoryCheckMobileTypes';
import { ScanQrCode, X } from 'lucide-react';

interface ScannerSimulatorProps {
  onScan: (sku: string) => void;
  onClose: () => void;
  allowedZone?: string | null;
}

export default function ScannerSimulator({ onScan, onClose, allowedZone }: ScannerSimulatorProps) {
  const [successSku, setSuccessSku] = useState<string | null>(null);
  const [laserPosition, setLaserPosition] = useState(10);
  const [direction, setDirection] = useState(1);

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
        // Clean up
        audioCtx.close().catch(() => {});
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
          <X />
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
            <ScanQrCode size={50} />
            <p className="mt-2 text-sm text-zinc-300 font-medium">
              Place the barcode within the frame.
            </p>
            <p className="text-xs text-zinc-500 mt-1">Simulating camera scanning...</p>
          </div>
        )}
      </div>
    </div>
  );
}
