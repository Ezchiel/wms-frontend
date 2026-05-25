import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { confirmInventoryCheck } from '../inventoryCheckThunks';
import { clearSelectedCheck } from '../inventoryCheckSlice';
import type { CheckStatus } from '../inventoryCheckTypes';

interface Props {
  onClose: () => void;
  onConfirmSuccess: () => void;
}

const STATUS_CONFIG: Record<CheckStatus, { label: string; className: string; icon: string }> = {
  PENDING: {
    label: 'Chờ xác nhận',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'fa-clock',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'fa-circle-check',
  },
  CANCELLED: {
    label: 'Đã huỷ',
    className: 'bg-red-50 text-red-600 border-red-200',
    icon: 'fa-circle-xmark',
  },
};

const formatDate = (isoStr: string) => {
  try {
    return new Date(isoStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoStr;
  }
};

export default function InventoryCheckDetailModal({ onClose, onConfirmSuccess }: Props) {
  const dispatch = useAppDispatch();
  const { selectedCheck, actionLoading } = useAppSelector((state) => state.inventoryCheck);
  const [confirmError, setConfirmError] = useState('');

  if (!selectedCheck) return null;

  const statusCfg = STATUS_CONFIG[selectedCheck.status];
  const totalItems = selectedCheck.details.length;
  const discrepantItems = selectedCheck.details.filter((d) => d.variance !== 0);
  const matchedItems = selectedCheck.details.filter((d) => d.variance === 0);
  const totalVariance = selectedCheck.details.reduce((sum, d) => sum + Math.abs(d.variance), 0);

  const handleConfirm = async () => {
    setConfirmError('');
    const result = await dispatch(confirmInventoryCheck(selectedCheck.id));
    if (confirmInventoryCheck.fulfilled.match(result)) {
      onConfirmSuccess();
    } else {
      setConfirmError((result.payload as string) || 'Xác nhận thất bại');
    }
  };

  const handleClose = () => {
    dispatch(clearSelectedCheck());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-wms-border-color shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-wms-primary/10 flex items-center justify-center">
              <i className="fa-solid fa-clipboard-check text-wms-primary"></i>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-[18px] font-bold text-wms-text-main">
                  {selectedCheck.checkCode}
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-semibold border ${statusCfg.className}`}
                >
                  <i className={`fa-solid ${statusCfg.icon} text-[10px]`}></i>
                  {statusCfg.label}
                </span>
              </div>
              <p className="text-[13px] text-wms-muted mt-0.5">
                {formatDate(selectedCheck.checkDate)} · Tạo bởi {selectedCheck.createdBy || 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-wms-bg text-wms-muted transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-wms-bg border-b border-wms-border-color shrink-0">
          <div className="text-center">
            <p className="text-[11px] text-wms-muted uppercase font-semibold tracking-wider mb-1">
              Tổng dòng
            </p>
            <p className="text-xl font-bold text-wms-text-main">{totalItems}</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-emerald-600 uppercase font-semibold tracking-wider mb-1">
              Khớp
            </p>
            <p className="text-xl font-bold text-emerald-700">{matchedItems.length}</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-red-500 uppercase font-semibold tracking-wider mb-1">
              Lệch
            </p>
            <p className="text-xl font-bold text-red-600">{discrepantItems.length}</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-wms-muted uppercase font-semibold tracking-wider mb-1">
              Tổng lệch
            </p>
            <p className="text-xl font-bold text-wms-text-main">{totalVariance}</p>
          </div>
        </div>

        {/* Notes */}
        {selectedCheck.notes && (
          <div className="px-6 py-3 bg-blue-50/50 border-b border-wms-border-color shrink-0">
            <p className="text-[13px] text-wms-text-main">
              <span className="font-semibold text-wms-muted">Ghi chú:</span> {selectedCheck.notes}
            </p>
          </div>
        )}

        {/* Details Table */}
        <div className="flex-1 overflow-y-auto">
          {selectedCheck.details.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-wms-muted gap-2">
              <i className="fa-regular fa-folder-open text-3xl"></i>
              <p className="text-sm">Không có dữ liệu chi tiết</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white border-b border-wms-border-color z-10">
                <tr>
                  {[
                    'Sản phẩm',
                    'Vị trí',
                    'Lô hàng',
                    'SL hệ thống',
                    'SL thực tế',
                    'Lệch',
                    'Lý do',
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-[12px] font-semibold text-wms-muted uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-wms-border-color">
                {selectedCheck.details.map((detail) => {
                  const isDiscrepant = detail.variance !== 0;
                  return (
                    <tr
                      key={detail.id}
                      className={`transition-colors ${isDiscrepant ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-wms-bg/50'}`}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-wms-text-main">{detail.productName}</p>
                        <p className="text-[11px] text-wms-muted">ID: {detail.productId}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[12px] bg-wms-bg px-2 py-0.5 rounded border border-wms-border-color text-wms-text-main">
                          {detail.locationBarcode || detail.locationId}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-wms-muted text-[13px]">
                        {detail.batchNo || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-semibold text-wms-text-main">
                        {detail.systemQuantity}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-semibold text-wms-text-main">
                        {detail.actualQuantity}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`font-mono font-bold text-[13px] ${
                            detail.variance === 0
                              ? 'text-emerald-600'
                              : detail.variance > 0
                                ? 'text-blue-600'
                                : 'text-red-600'
                          }`}
                        >
                          {detail.variance > 0
                            ? `+${detail.variance}`
                            : detail.variance === 0
                              ? '✓'
                              : detail.variance}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-wms-muted text-[13px]">
                        {detail.reason || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-wms-border-color shrink-0 flex items-center justify-between gap-3">
          {confirmError && (
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <i className="fa-solid fa-circle-exclamation"></i>
              {confirmError}
            </p>
          )}
          <div className="flex gap-3 ml-auto">
            <button
              onClick={handleClose}
              className="px-4 py-2.5 text-sm font-medium text-wms-muted border border-wms-border-color rounded-lg hover:bg-wms-bg transition-colors cursor-pointer"
            >
              Đóng
            </button>
            {selectedCheck.status === 'PENDING' && (
              <button
                onClick={handleConfirm}
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
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-circle-check text-[13px]"></i>
                    Xác nhận phiếu
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
