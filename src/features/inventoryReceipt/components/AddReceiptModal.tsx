import React, { useEffect, useRef, useState } from 'react';
import type { Partner } from '../../partners/partnerTypes';
import type { Product } from '../../products/productTypes';
import type {
  InventoryReceiptPayload,
  OcrReceiptItemResult,
  OcrReceiptResult,
  ReceiptDetailPayload,
} from '../inventoryReceiptTypes';

interface Props {
  isOpen: boolean;
  suppliers: Partner[];
  products: Product[];
  onClose: () => void;
  onSave: (data: InventoryReceiptPayload) => Promise<void>;
  // OCR props
  ocrLoading: boolean;
  ocrResult: OcrReceiptResult | null;
  ocrError: string | null;
  onScanImage: (file: File) => Promise<void>;
  onClearOcr: () => void;
}

// --- Confidence badge helper ---
const getConfidenceBadge = (score: number) => {
  if (score >= 0.8) return { label: 'Khớp tốt', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  if (score >= 0.5) return { label: 'Có thể khớp', cls: 'bg-amber-100 text-amber-700 border-amber-200' };
  if (score > 0)   return { label: 'Khớp yếu', cls: 'bg-red-100 text-red-700 border-red-200' };
  return { label: 'Chưa khớp', cls: 'bg-gray-100 text-gray-500 border-gray-200' };
};

const AddReceiptModal: React.FC<Props> = ({
  isOpen,
  suppliers,
  products,
  onClose,
  onSave,
  ocrLoading,
  ocrResult,
  ocrError,
  onScanImage,
  onClearOcr,
}) => {
  const initialFormState: InventoryReceiptPayload = {
    supplierId: 0,
    notes: '',
    details: [],
  };

  const [formData, setFormData] = useState<InventoryReceiptPayload>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ocrApplied, setOcrApplied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Khi có kết quả OCR mới, tự động đổ vào form
  useEffect(() => {
    if (!ocrResult || ocrApplied) return;

    // Điền supplier nếu match tốt (confidence ≥ 0.5)
    const newSupplierId =
      ocrResult.matchedPartnerId && ocrResult.partnerMatchConfidence >= 0.5
        ? ocrResult.matchedPartnerId
        : 0;

    // Đổ các dòng hàng vào bảng chi tiết
    const newDetails: ReceiptDetailPayload[] = (ocrResult.items || []).map(
      (item: OcrReceiptItemResult) => ({
        productId: item.matchedProductId && item.productMatchConfidence >= 0.5
          ? item.matchedProductId
          : 0,
        quantity: item.quantity ?? 1,
        unitPrice: item.unitPrice ?? 0,
        batchNo: item.batchNo ?? '',
        expiryDate: item.expiryDate ?? '',
        serialNumber: item.serialNumber ?? '',
      })
    );

    setFormData({
      supplierId: newSupplierId,
      notes: ocrResult.notes ?? '',
      details: newDetails,
    });
    setOcrApplied(true);
  }, [ocrResult, ocrApplied]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData(initialFormState);
    setOcrApplied(false);
    onClearOcr();
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOcrApplied(false); // reset để useEffect có thể trigger lại khi có kết quả mới
    await onScanImage(file);
    // Reset input để có thể chọn lại cùng file
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetOcr = () => {
    setFormData(initialFormState);
    setOcrApplied(false);
    onClearOcr();
  };

  const addDetailRow = () => {
    const newDetail: ReceiptDetailPayload = {
      productId: 0,
      quantity: 1,
      unitPrice: 0,
      batchNo: '',
      expiryDate: '',
      serialNumber: '',
    };
    setFormData({ ...formData, details: [...formData.details, newDetail] });
  };

  const removeDetailRow = (index: number) => {
    const newDetails = formData.details.filter((_, i) => i !== index);
    setFormData({ ...formData, details: newDetails });
  };

  const updateDetail = (index: number, field: keyof ReceiptDetailPayload, value: unknown) => {
    const newDetails = [...formData.details];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setFormData({ ...formData, details: newDetails });
  };

  const handleSubmit = async () => {
    if (formData.supplierId === 0 || formData.details.length === 0) {
      alert('Vui lòng chọn nhà cung cấp và ít nhất một sản phẩm!');
      return;
    }
    const hasUnselectedProduct = formData.details.some((d) => d.productId === 0);
    if (hasUnselectedProduct) {
      alert('Vui lòng chọn sản phẩm cho tất cả các dòng hàng!');
      return;
    }
    try {
      setIsSubmitting(true);
      await onSave(formData);
      setFormData(initialFormState);
      setOcrApplied(false);
    } catch (error) {
      console.error('Failed to save receipt:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lấy thông tin OCR item tương ứng với từng dòng hàng
  const getOcrItemInfo = (index: number): OcrReceiptItemResult | null => {
    if (!ocrResult?.items) return null;
    return ocrResult.items[index] ?? null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-white w-full max-w-6xl rounded-xl shadow-lg flex flex-col overflow-hidden max-h-[92vh]">

        {/* ===== HEADER ===== */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-solid border-wms-border-color sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-[16px] font-semibold text-wms-text-main">Create Inventory Receipt</h2>
            {ocrResult && (
              <p className="text-[11px] text-emerald-600 mt-0.5 flex items-center gap-1">
                <i className="fa-solid fa-wand-magic-sparkles text-[10px]" />
                Dữ liệu đã được điền từ AI (confidence:{' '}
                <strong>{Math.round((ocrResult.overallConfidence ?? 0) * 100)}%</strong>)
                <button
                  onClick={handleResetOcr}
                  className="ml-2 text-red-400 hover:text-red-600 cursor-pointer underline text-[10px]"
                >
                  Xoá & nhập tay
                </button>
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting || ocrLoading}
            className="text-wms-muted hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
          >
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>

        {/* ===== OCR LOADING OVERLAY ===== */}
        {ocrLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/85 backdrop-blur-sm rounded-xl">
            <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-xl border border-blue-100 max-w-xs text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <i className="fa-solid fa-wand-magic-sparkles text-blue-500 text-xl animate-pulse" />
              </div>
              <div>
                <p className="font-semibold text-[14px] text-wms-text-main">Đang phân tích ảnh...</p>
                <p className="text-[12px] text-wms-muted mt-1">Gemini AI đang đọc phiếu giao hàng của bạn</p>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full animate-[loading_1.5s_ease-in-out_infinite]"
                  style={{ animation: 'pulse 1.5s ease-in-out infinite', width: '60%' }} />
              </div>
            </div>
          </div>
        )}

        {/* ===== BODY ===== */}
        <div className="p-6 overflow-y-auto flex-1 relative">

          {/* --- OCR Error Banner --- */}
          {ocrError && (
            <div className="mb-4 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-700">
              <i className="fa-solid fa-circle-exclamation mt-0.5 shrink-0" />
              <div>
                <strong>Không thể phân tích ảnh:</strong> {ocrError}
                <button onClick={onClearOcr} className="ml-3 underline text-red-500 hover:text-red-700 cursor-pointer">
                  Đóng
                </button>
              </div>
            </div>
          )}

          {/* --- OCR Warning Banner --- */}
          {ocrResult?.warningMessage && (
            <div className="mb-4 flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-[13px] text-amber-800">
              <i className="fa-solid fa-triangle-exclamation mt-0.5 shrink-0" />
              <span>{ocrResult.warningMessage}</span>
            </div>
          )}

          {/* --- OCR Supplier match info --- */}
          {ocrResult && ocrResult.supplierNameRaw && (
            <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg text-[12px] text-blue-700 flex flex-wrap items-center gap-2">
              <i className="fa-solid fa-robot" />
              <span>AI nhận dạng nhà cung cấp: <strong>"{ocrResult.supplierNameRaw}"</strong></span>
              {ocrResult.matchedPartnerId ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 text-[11px] font-medium">
                  <i className="fa-solid fa-check text-[9px]" />
                  Khớp: {ocrResult.matchedPartnerName} ({Math.round(ocrResult.partnerMatchConfidence * 100)}%)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full border border-gray-200 text-[11px]">
                  Chưa tìm thấy — chọn tay bên dưới
                </span>
              )}
            </div>
          )}

          {/* --- Top Info Section --- */}
          <div className="grid grid-cols-2 gap-5 mb-8">
            <div className="flex flex-col gap-1.5 text-[13px]">
              <label className="font-medium text-wms-text-main text-[13px]">
                Supplier <span className="text-red-500">*</span>
              </label>
              <select
                className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main focus:border-wms-primary"
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: Number(e.target.value) })}
              >
                <option value={0}>-- Select Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-[13px]">
              <label className="font-medium text-wms-text-main text-[13px]">Notes</label>
              <input
                type="text"
                className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary"
                placeholder="Nhập ghi chú cho phiếu nhập..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {/* --- Details Table Section --- */}
          <div className="border border-solid border-wms-border-color rounded-lg overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-gray-50 border-b border-wms-border-color">
                <tr>
                  <th className="p-3 text-left w-1/4">Product</th>
                  <th className="p-3 text-left w-25">Qty</th>
                  <th className="p-3 text-left">Unit Price</th>
                  <th className="p-3 text-left">Batch No</th>
                  <th className="p-3 text-left">Serial No</th>
                  <th className="p-3 text-left">Expiry Date</th>
                  <th className="p-3 text-center w-12.5" />
                </tr>
              </thead>
              <tbody>
                {formData.details.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-wms-muted text-[12px]">
                      {ocrResult
                        ? 'AI không tìm thấy dòng hàng nào. Thêm thủ công bên dưới.'
                        : 'Chưa có hàng hoá. Thêm thủ công hoặc quét ảnh phiếu bằng AI.'}
                    </td>
                  </tr>
                )}
                {formData.details.map((item, index) => {
                  const ocrItem = getOcrItemInfo(index);
                  const confidence = ocrItem?.productMatchConfidence ?? 0;
                  const badge = getConfidenceBadge(confidence);
                  const hasOcrData = !!ocrResult;

                  return (
                    <tr
                      key={index}
                      className="border-b border-wms-border-color last:border-0 hover:bg-gray-50/50"
                    >
                      {/* Product */}
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          <select
                            className={`w-full py-1.5 px-2 border rounded outline-none focus:border-wms-primary text-[12px] ${
                              item.productId === 0 && hasOcrData
                                ? 'border-amber-300 bg-amber-50'
                                : 'border-wms-border-color'
                            }`}
                            value={item.productId}
                            onChange={(e) => updateDetail(index, 'productId', Number(e.target.value))}
                          >
                            <option value={0}>Select product</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.productName}
                              </option>
                            ))}
                          </select>

                          {/* OCR info dưới dropdown */}
                          {ocrItem && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] text-wms-muted italic truncate max-w-[140px]" title={ocrItem.productNameRaw}>
                                AI: "{ocrItem.productNameRaw}"
                              </span>
                              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border text-[9px] font-semibold ${badge.cls}`}>
                                {badge.label} {confidence > 0 ? `${Math.round(confidence * 100)}%` : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="p-3">
                        <input
                          type="number"
                          min="1"
                          className="w-full py-1.5 px-2 border border-wms-border-color rounded outline-none"
                          value={item.quantity}
                          onChange={(e) => updateDetail(index, 'quantity', Number(e.target.value))}
                        />
                      </td>

                      {/* Unit price */}
                      <td className="p-3">
                        <input
                          type="number"
                          className="w-full py-1.5 px-2 border border-wms-border-color rounded outline-none"
                          value={item.unitPrice}
                          onChange={(e) => updateDetail(index, 'unitPrice', Number(e.target.value))}
                        />
                      </td>

                      {/* Batch no */}
                      <td className="p-3">
                        <input
                          type="text"
                          className="w-full py-1.5 px-2 border border-wms-border-color rounded outline-none placeholder:text-[11px]"
                          placeholder="Batch#"
                          value={item.batchNo}
                          onChange={(e) => updateDetail(index, 'batchNo', e.target.value)}
                        />
                      </td>

                      {/* Serial number */}
                      <td className="p-3">
                        <input
                          type="text"
                          className="w-full py-1.5 px-2 border border-wms-border-color rounded outline-none placeholder:text-[11px]"
                          placeholder="S/N"
                          value={item.serialNumber || ''}
                          onChange={(e) => updateDetail(index, 'serialNumber', e.target.value)}
                        />
                      </td>

                      {/* Expiry date */}
                      <td className="p-3">
                        <input
                          type="date"
                          className="w-full py-1.5 px-2 border border-wms-border-color rounded outline-none"
                          value={item.expiryDate}
                          onChange={(e) => updateDetail(index, 'expiryDate', e.target.value)}
                        />
                      </td>

                      {/* Delete row */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => removeDetailRow(index)}
                          className="text-red-400 hover:text-red-600 cursor-pointer"
                        >
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Table footer actions */}
            <div className="p-3 bg-gray-50/30 flex items-center justify-between">
              <button
                onClick={addDetailRow}
                className="text-[12px] font-medium text-wms-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <i className="fa-solid fa-plus text-[10px]" /> Add product
              </button>

              {/* Nút quét ảnh AI */}
              <label className={`flex items-center gap-2 text-[12px] font-medium cursor-pointer px-3 py-1.5 rounded-md border transition-all select-none
                ${ocrLoading
                  ? 'opacity-60 cursor-not-allowed border-blue-200 bg-blue-50 text-blue-400'
                  : 'border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                <i className={`fa-solid fa-wand-magic-sparkles text-[11px] ${ocrLoading ? 'animate-pulse' : ''}`} />
                {ocrLoading ? 'Đang phân tích...' : 'Quét ảnh phiếu (AI)'}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  disabled={ocrLoading}
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-solid border-wms-border-color bg-gray-50/50 sticky bottom-0 z-10">
          <button
            onClick={handleClose}
            disabled={isSubmitting || ocrLoading}
            className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-white border border-solid border-wms-border-color text-wms-text-main hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || ocrLoading}
            className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-wms-primary border border-solid border-wms-primary text-white hover:opacity-90 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin" /> : null}
            Save Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReceiptModal;
