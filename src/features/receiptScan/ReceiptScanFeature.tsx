import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAllPartners } from '../partners/partnerThunks';
import { scanReceiptImage, createDraftReceipt } from '../inventoryReceipt/inventoryReceiptThunks';
import type { Partner } from '../partners/partnerTypes';
import type { OcrReceiptResult, InventoryReceiptPayload } from '../inventoryReceipt/inventoryReceiptTypes';
import { toast } from 'react-toastify';
import {
  Camera,
  Loader2,
  FileText,
  CheckCircle,
  ReceiptText,
  AlertTriangle,
  Send,
  Sparkles,
} from 'lucide-react';
import PageHeader from '../../layouts/MobileLayout/PageHeader';

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
          const result = await dispatch(
            scanReceiptImage({ imageBase64: base64, mimeType: 'image/jpeg' })
          ).unwrap();

          setOcrResult(result);
        } catch (err: any) {
          toast.error(err || 'Phân tích ảnh thất bại!');
        } finally {
          setOcrLoading(false);
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

    const detailsPayload = ocrResult.items.map((item) => ({
      productId: item.matchedProductId || 0,
      productNameRaw: item.productNameRaw || '',
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
    <div className="bg-wms-bg min-h-screen flex flex-col font-sans text-wms-text-main pb-20">
      {/* Shared Page Header */}
      <PageHeader
        title="Scan receipt"
        subtitle="AI-powered delivery note recognition"
        backTo="/mobile/tasks"
      />

      <main className="flex-1 max-w-md mx-auto w-full px-5 py-5 space-y-4">

        {/* ── State 1: Success ── */}
        {successCode && (
          <div className="bg-white border border-wms-border-color rounded-3xl p-6 shadow-sm text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-wms-text-main">Sent to desktop!</h2>
              <p className="text-xs text-wms-muted max-w-[250px] mx-auto leading-relaxed">
                The draft receipt has been converted to <strong>DRAFT</strong> status. The warehouse keeper on the desktop has received a notification to approve.
              </p>
            </div>

            <div className="py-3 px-4 bg-wms-bg border border-wms-border-color rounded-2xl font-mono text-[14px] font-bold text-wms-text-main break-all select-all flex items-center justify-center gap-2">
              <ReceiptText className="text-wms-muted w-4 h-4" />
              <span>{successCode}</span>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-wms-primary hover:bg-wms-primary-hover active:scale-95 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Scan another receipt
              </button>
              <button
                onClick={() => navigate('/mobile/tasks')}
                className="w-full bg-white border border-wms-border-color text-wms-text-main font-semibold text-xs py-3 rounded-xl active:scale-95 transition-all cursor-pointer hover:bg-wms-bg"
              >
                Back to tasks
              </button>
            </div>
          </div>
        )}

        {/* ── State 2: Processing / Loading ── */}
        {(compressing || ocrLoading) && (
          <div className="bg-white border border-wms-border-color rounded-3xl p-10 shadow-sm text-center space-y-6 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-wms-primary/10 flex items-center justify-center rounded-2xl border border-wms-primary/20">
              <Sparkles className="text-wms-primary w-7 h-7 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-[15px] font-bold text-wms-text-main">
                {compressing ? 'Optimizing image...' : 'AI is reading receipt...'}
              </h2>
              <p className="text-[11px] text-wms-muted max-w-[220px] mx-auto leading-relaxed">
                Gemini Vision is reading the list of goods, quantity and supplier information. Please wait a few seconds.
              </p>
            </div>
            <div className="w-48 bg-wms-bg rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-wms-primary h-full rounded-full animate-pulse"
                style={{ width: '70%' }}
              />
            </div>
          </div>
        )}

        {/* ── State 3: Empty / Upload Prompt ── */}
        {!ocrResult && !successCode && !ocrLoading && !compressing && (
          <div className="bg-white border border-wms-border-color rounded-3xl p-8 shadow-sm text-center space-y-6 min-h-[320px] flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-wms-bg border-2 border-dashed border-wms-border-color rounded-3xl flex items-center justify-center">
              <FileText className="text-wms-muted w-8 h-8 opacity-60" />
            </div>
            <div className="space-y-2">
              <h2 className="text-[15px] font-bold text-wms-text-main">No receipt image yet</h2>
              <p className="text-xs text-wms-muted max-w-[240px] mx-auto leading-relaxed">
                Please press the button below to open the Camera to take a photo of the delivery note or select a photo from the gallery.
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-wms-primary hover:bg-wms-primary-hover active:scale-95 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Start scanning
            </button>
          </div>
        )}

        {/* ── State 4: OCR Result Review ── */}
        {ocrResult && !ocrLoading && !compressing && (
          <div className="space-y-4">
            {/* Warning Message Banner */}
            {ocrResult.warningMessage && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-800 font-medium flex items-start gap-2.5">
                <AlertTriangle className="mt-0.5 shrink-0 text-amber-500 w-[14px] h-[14px]" />
                <p>{ocrResult.warningMessage}</p>
              </div>
            )}

            {/* OCR Info Card */}
            <div className="bg-white border border-wms-border-color rounded-2xl p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-wms-border-color pb-3">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-wms-muted">AI Scan Result</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ocrResult.overallConfidence >= 0.7
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                  }`}>
                  Confidence: {Math.round(ocrResult.overallConfidence * 100)}%
                </span>
              </div>

              {/* Supplier Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-wms-muted uppercase tracking-wide">Supplier</label>
                {ocrResult.supplierNameRaw && (
                  <div className="text-[11px] text-wms-muted italic">
                    AI Raw: "{ocrResult.supplierNameRaw}"
                  </div>
                )}

                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
                  className={`w-full py-2 px-3 border rounded-xl outline-none text-xs focus:ring-2 focus:ring-wms-primary/20 focus:border-wms-primary transition-all font-semibold ${selectedSupplierId === 0
                      ? 'border-red-300 bg-red-50/20 text-red-600'
                      : 'border-wms-border-color bg-white text-wms-text-main'
                    }`}
                >
                  <option value={0}>-- Select Supplier --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {selectedSupplierId === 0 && (
                  <p className="text-[10px] text-red-500 font-medium">Please select supplier or AI cannot match automatically.</p>
                )}
              </div>

              {/* Notes */}
              {ocrResult.notes && (
                <div className="p-2.5 bg-wms-bg rounded-xl border border-wms-border-color text-[11px] text-wms-muted leading-normal">
                  <span className="font-bold text-wms-text-main block mb-0.5">AI Notes:</span>
                  {ocrResult.notes}
                </div>
              )}

              {/* Items summary */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-wms-muted uppercase tracking-wide">
                    List of goods ({ocrResult.items.length})
                  </label>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {ocrResult.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-wms-bg rounded-xl border border-wms-border-color flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-wms-text-main truncate leading-snug">
                          {item.matchedProductName || item.productNameRaw}
                        </p>
                        <p className="text-[10px] text-wms-muted font-medium mt-0.5">
                          {item.matchedProductId ? 'Matched product' : 'Product not matched'}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-wms-primary bg-wms-primary/10 border border-wms-primary/20 px-2 py-0.5 rounded-lg text-[10px]">
                          Quantity: {item.quantity || 1}
                        </span>
                        {item.unitPrice ? (
                          <p className="text-[9px] text-wms-muted mt-0.5">
                            đ{item.unitPrice.toLocaleString()}
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
                className="flex-1 bg-white border border-wms-border-color text-wms-text-main font-semibold text-xs py-3.5 rounded-xl active:scale-95 transition-all disabled:opacity-50 cursor-pointer hover:bg-wms-bg"
              >
                Retake photo
              </button>
              <button
                onClick={handleSubmitDraft}
                disabled={submitting}
                className="flex-1 bg-wms-primary hover:bg-wms-primary-hover active:scale-95 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send to computer
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
