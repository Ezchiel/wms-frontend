import React, { useState } from 'react';
import QrCameraScanner from '../../inventoryCheckMobile/components/QrCameraScanner';

interface Props {
  suggestedCode: string;
  shelfInput: string;
  shelfRef: React.RefObject<HTMLInputElement | null>;
  shelfError: string | null;
  apiError: string | null;
  confirming: boolean;
  onInputChange: (val: string) => void;
  onConfirm: () => void;
}

export const StepScanShelf: React.FC<Props> = ({
  suggestedCode,
  shelfInput,
  shelfRef,
  shelfError,
  apiError,
  onInputChange,
  onConfirm,
}) => {
  const [showScanner, setShowScanner] = useState(false);

  const handleShelfScan = (decodedText: string) => {
    const cleanCode = decodedText.toUpperCase().trim();
    setShowScanner(false);
    onInputChange(cleanCode);

    // Auto-confirm if code matches
    if (cleanCode === suggestedCode.toUpperCase()) {
      // Use a short timeout to allow state to settle before confirming
      setTimeout(() => onConfirm(), 50);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Vị trí chỉ định */}
      <div className="flex items-center gap-3 p-4 bg-wms-primary/5 border border-wms-primary/20 rounded-2xl">
        <div className="w-11 h-11 rounded-xl bg-wms-primary/10 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-location-dot text-wms-primary text-[18px]" />
        </div>
        <div>
          <p className="text-[11px] text-wms-muted font-bold uppercase">Cần quét kệ</p>
          <p className="text-[20px] font-black text-wms-primary">{suggestedCode}</p>
        </div>
      </div>

      {/* Scan button */}
      <button
        onClick={() => setShowScanner(true)}
        className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-sm px-4 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-qrcode text-[18px]"></i>
        Quét mã QR kệ
      </button>

      {/* Manual input fallback */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-wms-border-color">
        <div className="p-4">
          <p className="text-[11px] font-bold text-wms-muted uppercase tracking-wider mb-2">
            Hoặc nhập thủ công
          </p>
          <input
            ref={shelfRef}
            value={shelfInput}
            onChange={(e) => onInputChange(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && onConfirm()}
            placeholder="Nhập mã kệ..."
            className="w-full py-2.5 px-3 border border-wms-border-color rounded-xl font-bold text-[13px] outline-none focus:border-wms-primary transition-colors"
          />
          {shelfInput && (
            <button
              onClick={onConfirm}
              className="mt-3 w-full py-2.5 bg-wms-primary text-white font-bold rounded-xl text-[13px] hover:bg-wms-primary-hover active:scale-95 transition-all"
            >
              Xác nhận
            </button>
          )}
        </div>
      </div>

      {(shelfError || apiError) && (
        <p className="text-center text-[13px] text-red-600 font-bold px-4">
          {shelfError || apiError}
        </p>
      )}

      {/* QrCameraScanner overlay */}
      {showScanner && (
        <QrCameraScanner
          onClose={() => setShowScanner(false)}
          onScan={handleShelfScan}
        />
      )}
    </div>
  );
};