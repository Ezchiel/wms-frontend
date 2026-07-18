import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import QrCameraScanner from '../../inventoryCheckMobile/components/QrCameraScanner';

interface Props {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  error: string | null;
  onChange: (val: string) => void;
  onSubmit: (explicitLpn?: string) => void;
}

export const StepScanLPN: React.FC<Props> = ({ inputRef, value, error, onChange, onSubmit }) => {
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = (decodedText: string) => {
    setShowScanner(false);
    onChange(decodedText);
    onSubmit(decodedText);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Scanner trigger button */}
      <button
        onClick={() => setShowScanner(true)}
        className="bg-wms-primary hover:bg-wms-primary-hover active:scale-95 text-white font-extrabold text-sm px-4 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <QrCode className="w-[18px] h-[18px]" />
        Mở Camera quét LPN
      </button>

      {/* Manual input */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-wms-border-color">
        <p className="text-[11px] font-bold text-wms-muted uppercase tracking-wider mb-2">
          Hoặc nhập thủ công
        </p>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder="Quét hoặc nhập mã LPN..."
          className="w-full py-2.5 px-3 border border-wms-border-color rounded-xl text-[13px] outline-none focus:border-wms-primary transition-colors"
        />
        {value && (
          <button
            onClick={() => onSubmit()}
            className="mt-3 w-full py-2.5 bg-wms-primary text-white font-bold rounded-xl text-[13px] hover:bg-wms-primary-hover active:scale-95 transition-all"
          >
            Tìm kiếm
          </button>
        )}
        {error && <p className="mt-3 text-[12px] text-red-600 font-medium">{error}</p>}
      </div>

      {/* QrCameraScanner overlay */}
      {showScanner && (
        <QrCameraScanner
          onClose={() => setShowScanner(false)}
          onScan={handleScan}
        />
      )}
    </div>
  );
};