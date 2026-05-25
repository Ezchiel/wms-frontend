import React, { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createInventoryCheck } from '../inventoryCheckThunks';
import type { CreateCheckDetailPayload } from '../inventoryCheckTypes';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

// Separate the UI key from the API payload
interface DetailRow {
  uiKey: number;
  productId: number;
  locationId: number;
  batchNo: string;
  actualQuantity: number;
  reason: string;
}

const emptyRow = (key: number): DetailRow => ({
  uiKey: key,
  productId: 0,
  locationId: 0,
  batchNo: '',
  actualQuantity: 0,
  reason: '',
});

export default function CreateCheckModal({ onClose, onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const { actionLoading, error } = useAppSelector((state) => state.inventoryCheck);
  const [notes, setNotes] = useState('');
  const keyCounter = useRef(1);
  const [details, setDetails] = useState<DetailRow[]>(() => [emptyRow(0)]);
  const [validationError, setValidationError] = useState('');

  const handleAddRow = () => {
    keyCounter.current += 1;
    setDetails((prev) => [...prev, emptyRow(keyCounter.current)]);
  };

  const handleRemoveRow = (uiKey: number) => {
    setDetails((prev) => prev.filter((r) => r.uiKey !== uiKey));
  };

  const handleRowChange = (uiKey: number, field: keyof CreateCheckDetailPayload, value: string) => {
    setDetails((prev) =>
      prev.map((r) => {
        if (r.uiKey !== uiKey) return r;
        const isNumeric =
          field === 'productId' || field === 'locationId' || field === 'actualQuantity';
        return { ...r, [field]: isNumeric ? Number(value) : value };
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    for (const row of details) {
      if (!row.productId || row.productId <= 0) {
        setValidationError('Vui lòng nhập ID sản phẩm hợp lệ cho tất cả các dòng.');
        return;
      }
      if (!row.locationId || row.locationId <= 0) {
        setValidationError('Vui lòng nhập ID vị trí hợp lệ cho tất cả các dòng.');
        return;
      }
    }

    const payload = {
      notes,
      details: details.map(
        (row): CreateCheckDetailPayload => ({
          productId: row.productId,
          locationId: row.locationId,
          batchNo: row.batchNo,
          actualQuantity: row.actualQuantity,
          reason: row.reason,
        })
      ),
    };

    const result = await dispatch(createInventoryCheck(payload));
    if (createInventoryCheck.fulfilled.match(result)) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-wms-border-color shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-wms-primary/10 flex items-center justify-center">
              <i className="fa-solid fa-plus text-wms-primary"></i>
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-wms-text-main">Tạo phiếu kiểm kê</h2>
              <p className="text-[13px] text-wms-muted">Nhập thông tin kiểm tra tồn kho</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-wms-bg text-wms-muted transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Error */}
            {(validationError || error) && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                {validationError || error}
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-[13px] font-semibold text-wms-text-main mb-1.5">
                Ghi chú
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú cho phiếu kiểm kê..."
                rows={2}
                className="w-full px-3.5 py-2.5 text-sm border border-wms-border-color rounded-lg outline-none focus:border-wms-primary focus:ring-1 focus:ring-wms-primary/20 text-wms-text-main placeholder:text-wms-muted resize-none"
              />
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[13px] font-semibold text-wms-text-main">
                  Chi tiết kiểm kê
                  <span className="ml-2 text-[11px] font-normal text-wms-muted">
                    ({details.length} dòng)
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-wms-primary border border-wms-primary/30 rounded-lg hover:bg-wms-primary/5 transition-colors cursor-pointer"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i>
                  Thêm dòng
                </button>
              </div>

              <div className="border border-wms-border-color rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-wms-bg">
                    <tr>
                      {[
                        'ID sản phẩm *',
                        'ID vị trí *',
                        'Số lô',
                        'SL thực tế *',
                        'Lý do lệch',
                        '',
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2.5 text-left text-[11px] font-semibold text-wms-muted uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-wms-border-color">
                    {details.map((row) => (
                      <tr key={row.uiKey}>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min="1"
                            required
                            value={row.productId || ''}
                            onChange={(e) =>
                              handleRowChange(row.uiKey, 'productId', e.target.value)
                            }
                            placeholder="ID"
                            className="w-20 px-2 py-1.5 text-[13px] border border-wms-border-color rounded-lg outline-none focus:border-wms-primary text-wms-text-main"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min="1"
                            required
                            value={row.locationId || ''}
                            onChange={(e) =>
                              handleRowChange(row.uiKey, 'locationId', e.target.value)
                            }
                            placeholder="ID"
                            className="w-20 px-2 py-1.5 text-[13px] border border-wms-border-color rounded-lg outline-none focus:border-wms-primary text-wms-text-main"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={row.batchNo}
                            onChange={(e) => handleRowChange(row.uiKey, 'batchNo', e.target.value)}
                            placeholder="Số lô..."
                            className="w-28 px-2 py-1.5 text-[13px] border border-wms-border-color rounded-lg outline-none focus:border-wms-primary text-wms-text-main"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            required
                            value={row.actualQuantity}
                            onChange={(e) =>
                              handleRowChange(row.uiKey, 'actualQuantity', e.target.value)
                            }
                            className="w-20 px-2 py-1.5 text-[13px] border border-wms-border-color rounded-lg outline-none focus:border-wms-primary text-wms-text-main"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={row.reason}
                            onChange={(e) => handleRowChange(row.uiKey, 'reason', e.target.value)}
                            placeholder="Lý do (nếu lệch)..."
                            className="w-36 px-2 py-1.5 text-[13px] border border-wms-border-color rounded-lg outline-none focus:border-wms-primary text-wms-text-main"
                          />
                        </td>
                        <td className="px-2 py-2 text-center">
                          {details.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(row.uiKey)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer mx-auto"
                            >
                              <i className="fa-solid fa-trash text-[11px]"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-wms-border-color shrink-0 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-wms-muted border border-wms-border-color rounded-lg hover:bg-wms-bg transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-wms-primary hover:bg-wms-primary-hover text-white text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang tạo...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-plus text-[13px]"></i>
                  Tạo phiếu
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
