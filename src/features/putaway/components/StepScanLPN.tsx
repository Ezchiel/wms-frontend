import React, { useState } from 'react';
import QRScanner from './QRScanner';

interface Props {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  error: string | null;
  onChange: (val: string) => void;
  onSubmit: (explicitLpn?: string) => void;
}

export const StepScanLPN: React.FC<Props> = ({ inputRef, value, error, onChange, onSubmit }) => {
  const [showCamera, setShowCamera] = useState(false);

  const handleAutoScan = (decodedText: string) => {
    onChange(decodedText);
    setShowCamera(false);

    onSubmit(decodedText);
  };

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={() => setShowCamera(!showCamera)}
        className="bg-blue-100 text-blue-600 p-3 rounded-lg flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-camera"></i>
        {showCamera ? 'Tắt Camera' : 'Mở Camera quét LPN'}
      </button>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-wms-border-color">
        {showCamera ? (
          <QRScanner onScanSuccess={handleAutoScan} />
        ) : (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            placeholder="Quét hoặc nhập mã LPN..."
            className="w-full py-2.5 px-3 border border-wms-border-color rounded-xl text-[13px] outline-none"
          />
        )}
        {error && <p className="mt-3 text-[12px] text-red-600 font-medium">{error}</p>}
      </div>
    </div>
  );
};
