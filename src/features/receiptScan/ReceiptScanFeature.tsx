import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAllPartners } from '../partners/partnerThunks';
import { scanReceiptImage, createDraftReceipt } from '../inventoryReceipt/inventoryReceiptThunks';
import type { Partner } from '../partners/partnerTypes';
import type { OcrReceiptResult, InventoryReceiptPayload } from '../inventoryReceipt/inventoryReceiptTypes';
import { toast } from 'react-toastify';

export const ReceiptScanFeature: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redux Selectors
  const { partners } = useAppSelector((state) => state.partners);
  const suppliers = partners.filter((p: Partner) => p.type === 'SUPPLIER');

  // Component States
  const [compressing, setCompressing] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<OcrReceiptResult | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  // Load suppliers
  useEffect(() => {
    dispatch(fetchAllPartners());
  }, [dispatch]);

  // Handle auto-select supplier from OCR match
  useEffect(() => {
    if (ocrResult?.matchedPartnerId) {
      setSelectedSupplierId(ocrResult.matchedPartnerId);
    } else {
      setSelectedSupplierId(0);
    }
  }, [ocrResult]);

  // Client-side image compression
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      setCompressing(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              setCompressing(false);
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.7
          );
        };
      };
    });
  };

  // Handle selected file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setOcrResult(null);
      setSuccessCode(null);
      
      // Compress
      const compressedFile = await compressImage(file);
      
      // Convert to Base64
      setOcrLoading(true);
      const base64Reader = new FileReader();
      base64Reader.readAsDataURL(compressedFile);
      base64Reader.onloadend = async () => {
        const dataUrl = base64Reader.result as string;
        const base64 = dataUrl.split(',')[1];
        
        try {
          const result = await dispatch(scanReceiptImage({
            imageBase64: base64,
            mimeType: 'image/jpeg'
          })).unwrap();
          
          setOcrResult(result);
        } catch (err: any) {
          toast.error(err || 'Phân tích ảnh thất bại!');
        } finally {
          setOcrLoading(false);
          // Clear input so we can upload same file
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi xử lý ảnh.');
      setOcrLoading(false);
    }
  };

  // Submit draft to backend
  const handleSubmitDraft = async () => {
    if (!ocrResult) return;
    if (selectedSupplierId === 0) {
      toast.warn('Vui lòng chọn Nhà cung cấp!');
      return;
    }

    // Map ocr items to payload details
    const detailsPayload = ocrResult.items.map((item) => ({
      productId: item.matchedProductId || 0, // 0 means pending matching on desktop
      productNameRaw: item.productNameRaw || '', // Gửi kèm tên OCR thô để Manager biết
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
      batchNo: item.batchNo || '',
      expiryDate: item.expiryDate && item.expiryDate.trim() !== '' ? item.expiryDate : null,
      serialNumber: item.serialNumber || '',
    }));

    const payload: InventoryReceiptPayload = {
      supplierId: selectedSupplierId,
      notes: ocrResult.notes || 'Tạo tự động từ OCR trên điện thoại',
      details: detailsPayload,
    };

    try {
      setSubmitting(true);
      const response = await dispatch(createDraftReceipt(payload)).unwrap();
      setSuccessCode(response.receiptCode);
      toast.success('Gửi phiếu nháp thành công!');
      setOcrResult(null);
    } catch (err: any) {
      toast.error(err || 'Gửi phiếu nháp thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setOcrResult(null);
    setSuccessCode(null);
    setSelectedSupplierId(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-800 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 flex items-center justify-between px-4 py-3.5 sticky top-0 z-40 shadow-sm">
        <button 
          onClick={() => navigate('/mobile/tasks')} 
          className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-arrow-left text-[18px]"></i>
        </button>
        <h1 className="font-extrabold text-sm text-slate-900 tracking-tight">Quét phiếu nhập</h1>
        <div className="w-8"></div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-5 space-y-4">
        {/* State 1: Success State */}
        {successCode && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md text-center space-y-5 animate-[fadeIn_0.3s_ease-out]">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <i className="fa-solid fa-circle-check text-[32px]"></i>
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-slate-800">Đã gửi lên máy tính!</h2>
              <p className="text-xs text-slate-400 max-w-[250px] mx-auto leading-relaxed">
                Phiếu nháp đã được chuyển sang trạng thái <strong>DRAFT</strong>. Thủ kho trên máy tính đã nhận được thông báo để phê duyệt.
              </p>
            </div>

            <div className="py-3 px-4 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-[14px] font-bold text-slate-600 break-all select-all flex items-center justify-center gap-2">
              <i className="fa-solid fa-receipt text-slate-400"></i>
              <span>{successCode}</span>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-camera"></i>
                Quét tiếp phiếu khác
              </button>
              <button
                onClick={() => navigate('/mobile/tasks')}
                className="w-full bg-white border border-slate-200 text-slate-600 font-semibold text-xs py-3 rounded-xl active:scale-95 transition-all"
              >
                Quay về trang tác vụ
              </button>
            </div>
          </div>
        )}

        {/* State 2: Scanning / Loading State */}
        {(compressing || ocrLoading) && (
          <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-md text-center space-y-6 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-blue-50 flex items-center justify-center rounded-2xl border border-blue-100">
              <i className="fa-solid fa-wand-magic-sparkles text-blue-500 text-[26px] animate-pulse"></i>
            </div>
            <div className="space-y-2">
              <h2 className="text-[15px] font-bold text-slate-800">
                {compressing ? 'Đang nén tối ưu ảnh...' : 'Đang nhận dạng phiếu (AI)...'}
              </h2>
              <p className="text-[11px] text-slate-400 max-w-[220px] mx-auto leading-relaxed">
                Gemini Vision đang đọc danh sách hàng hoá, số lượng và thông tin nhà cung cấp. Vui lòng chờ vài giây.
              </p>
            </div>
            <div className="w-48 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full animate-[pulse_1s_infinite]" 
                style={{ width: '70%' }}
              ></div>
            </div>
          </div>
        )}

        {/* State 3: Empty State (Upload prompt) */}
        {!ocrResult && !successCode && !ocrLoading && !compressing && (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm text-center space-y-6 min-h-[320px] flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-blue-50/50 border border-dashed border-blue-200 rounded-3xl flex items-center justify-center shadow-xs">
              <i className="fa-solid fa-file-invoice text-blue-500 text-[32px]"></i>
            </div>
            <div className="space-y-2">
              <h2 className="text-[15px] font-bold text-slate-700">Chưa có ảnh phiếu nhập</h2>
              <p className="text-xs text-slate-400 max-w-[240px] mx-auto leading-relaxed">
                Hãy nhấn nút bên dưới để mở Camera chụp ảnh phiếu giao hàng hoặc chọn ảnh từ thư viện.
              </p>
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-camera"></i>
              Bắt đầu chụp ảnh
            </button>
          </div>
        )}

        {/* State 4: OCR Result Review */}
        {ocrResult && !ocrLoading && !compressing && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            {/* Warning Message Banner */}
            {ocrResult.warningMessage && (
              <div className="p-3.5 bg-amber-50 border border-amber-200/60 rounded-2xl text-[11px] text-amber-800 font-medium flex items-start gap-2.5">
                <i className="fa-solid fa-circle-exclamation mt-0.5 shrink-0 text-amber-500 text-[14px]"></i>
                <p>{ocrResult.warningMessage}</p>
              </div>
            )}

            {/* OCR Info Card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400">Kết quả quét AI</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  ocrResult.overallConfidence >= 0.7 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  Độ tin cậy: {Math.round(ocrResult.overallConfidence * 100)}%
                </span>
              </div>

              {/* Raw vs Matched Supplier */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Nhà cung cấp</label>
                {ocrResult.supplierNameRaw && (
                  <div className="text-[11px] text-slate-500 italic">
                    AI đọc thô: "{ocrResult.supplierNameRaw}"
                  </div>
                )}

                {/* Dropdown to check or manually select supplier */}
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
                  className={`w-full py-2 px-3 border rounded-xl outline-none text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-semibold ${
                    selectedSupplierId === 0 
                      ? 'border-red-300 bg-red-50/20 text-red-600' 
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <option value={0}>-- Chọn Nhà Cung Cấp --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {selectedSupplierId === 0 && (
                  <p className="text-[10px] text-red-500 font-medium">⚠️ Chưa chọn nhà cung cấp hoặc AI không khớp được tự động.</p>
                )}
              </div>

              {/* Notes */}
              {ocrResult.notes && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-normal">
                  <span className="font-bold text-slate-600 block mb-0.5">Ghi chú AI:</span>
                  {ocrResult.notes}
                </div>
              )}

              {/* Items summary */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    Danh sách hàng hoá ({ocrResult.items.length})
                  </label>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {ocrResult.items.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-700 truncate leading-snug">
                          {item.matchedProductName || item.productNameRaw}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {item.matchedProductId ? 'Khớp mã sản phẩm' : '⚠️ Chưa khớp sản phẩm'}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-lg text-[10px]">
                          SL: {item.quantity || 1}
                        </span>
                        {item.unitPrice ? (
                          <p className="text-[9px] text-slate-400 mt-0.5">
                            đ{(item.unitPrice).toLocaleString()}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                disabled={submitting}
                className="flex-1 bg-white border border-slate-200 text-slate-600 font-semibold text-xs py-3.5 rounded-xl active:scale-95 transition-all disabled:opacity-50"
              >
                Chụp lại ảnh
              </button>
              <button
                onClick={handleSubmitDraft}
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <i className="fa-solid fa-spinner animate-spin"></i>
                ) : (
                  <i className="fa-solid fa-paper-plane"></i>
                )}
                Gửi lên máy tính
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ReceiptScanFeature;
