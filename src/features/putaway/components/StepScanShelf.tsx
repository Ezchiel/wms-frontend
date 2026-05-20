import React, { useState } from 'react';
import QRScanner from './QRScanner';

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
  confirming,
  onInputChange,
  onConfirm,
}) => {
  const [useCamera, setUseCamera] = useState(true);

  const handleShelfScan = (decodedText: string) => {
    const cleanCode = decodedText.toUpperCase().trim();
    onInputChange(cleanCode); // Vẫn cập nhật để hiển thị UI

    // Kiểm tra nếu mã quét đúng với mã gợi ý thì tự động confirm luôn
    if (cleanCode === suggestedCode.toUpperCase()) {
      onConfirm();
    } else {
      // Nếu sai mã, tắt camera để hiện ô nhập tay cho user sửa
      setUseCamera(false);
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

      {/* Camera Scanner */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-wms-border-color">
        {useCamera ? (
          <div className="p-2">
            <QRScanner onScanSuccess={handleShelfScan} />
            <button
              onClick={() => setUseCamera(false)}
              className="w-full py-2 text-[12px] text-wms-muted font-medium italic"
            >
              Dùng nhập tay nếu không quét được
            </button>
          </div>
        ) : (
          <div className="p-4">
            <input
              ref={shelfRef}
              value={shelfInput}
              onChange={(e) => onInputChange(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && onConfirm()}
              placeholder="Nhập mã kệ..."
              className="w-full py-2.5 px-3 border border-wms-border-color rounded-xl font-bold"
            />
            <button
              onClick={() => setUseCamera(true)}
              className="mt-2 text-wms-primary text-[12px] font-bold"
            >
              Mở lại Camera
            </button>
          </div>
        )}
      </div>

      {(shelfError || apiError) && (
        <p className="text-center text-[13px] text-red-600 font-bold px-4">
          {shelfError || apiError}
        </p>
      )}
    </div>
  );
};
