import React, { useState } from 'react';
import { MapPin, QrCode, AlertTriangle } from 'lucide-react';
import QrCameraScanner from '../../inventoryCheckMobile/components/QrCameraScanner';

interface Props {
  suggestedCode: string;
  shelfInput: string;
  shelfRef: React.RefObject<HTMLInputElement | null>;
  shelfError: string | null;
  apiError: string | null;
  conflictError: string | null;
  confirming: boolean;
  onInputChange: (val: string) => void;
  onConfirm: (scannedCode?: string) => void;
}

export const StepScanShelf: React.FC<Props> = ({
  suggestedCode,
  shelfInput,
  shelfRef,
  shelfError,
  apiError,
  conflictError,
  onInputChange,
  onConfirm,
}) => {
  const [showScanner, setShowScanner] = useState(false);

  const handleShelfScan = (decodedText: string) => {
    const cleanCode = decodedText.toUpperCase().trim();
    setShowScanner(false);
    onInputChange(cleanCode);
    onConfirm(cleanCode);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Vị trí chỉ định */}
      <div className="flex items-center gap-3 p-4 bg-wms-primary/5 border border-wms-primary/20 rounded-2xl">
        <div className="w-11 h-11 rounded-xl bg-wms-primary/10 flex items-center justify-center shrink-0">
          <MapPin className="text-wms-primary w-[18px] h-[18px]" />
        </div>
        <div>
          <p className="text-[11px] text-wms-muted font-bold uppercase">Cần quét kệ</p>
          <p className="text-[20px] font-black text-wms-primary">{suggestedCode}</p>
        </div>
      </div>

      {/* Scan button */}
      <button
        onClick={() => setShowScanner(true)}
        className="bg-wms-primary hover:bg-wms-primary-hover active:scale-95 text-white font-extrabold text-sm px-4 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <QrCode className="w-[18px] h-[18px]" />
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
              onClick={() => onConfirm()}
              className="mt-3 w-full py-2.5 bg-wms-primary text-white font-bold rounded-xl text-[13px] hover:bg-wms-primary-hover active:scale-95 transition-all"
            >
              Xác nhận
            </button>
          )}
        </div>
      </div>

      {(shelfError || apiError) && !conflictError && (
        <p className="text-center text-[13px] text-red-600 font-bold px-4">
          {shelfError || apiError}
        </p>
      )}

      {/* Lỗi 409: vị trí đang bị sản phẩm khác chiếm — hiển thị nổi bật dạng cảnh báo */}
      {conflictError && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-300 rounded-2xl">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="text-amber-600 w-[16px] h-[16px]" />
          </div>
          <div className="flex-1">
            <p className="text-[12px] font-extrabold text-amber-800 uppercase tracking-wide mb-1">
              Vị trí không phù hợp
            </p>
            <p className="text-[13px] text-amber-700 font-medium leading-snug">
              {conflictError}
            </p>
            <p className="text-[11px] text-amber-600 mt-1.5 font-semibold">
              Vui lòng quét mã kệ khác.
            </p>
          </div>
        </div>
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