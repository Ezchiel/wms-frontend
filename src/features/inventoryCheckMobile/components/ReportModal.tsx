import { MapPin, X } from 'lucide-react';
import type { InventoryCheck } from '../../inventoryCheck/inventoryCheckTypes';

interface ReportModalProps {
  check: InventoryCheck;
  onClose: () => void;
}

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: 'Chờ xác nhận', bg: 'bg-amber-100', text: 'text-amber-700' },
  COMPLETED: { label: 'Hoàn thành', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  CANCELLED: { label: 'Đã huỷ', bg: 'bg-red-100', text: 'text-red-600' },
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

export default function ReportModal({ check, onClose }: ReportModalProps) {
  const totalItems = check.details.length;
  const matchedItems = check.details.filter((d) => d.variance === 0);
  const discrepantItems = check.details.filter((d) => d.variance !== 0);
  const totalVariance = check.details.reduce((sum, d) => sum + Math.abs(d.variance), 0);
  const accuracyPercent =
    totalItems > 0 ? Math.round((matchedItems.length / totalItems) * 100) : 100;

  const statusCfg = STATUS_LABELS[check.status] ?? STATUS_LABELS['PENDING'];

  return (
    <div className="fixed mb-22 inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 pt-5 pb-4 shrink-0">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1 flex-1 min-w-0">
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block">
                Kết quả kiểm kê
              </span>
              <h2 className="text-lg font-black tracking-tight truncate">{check.checkCode}</h2>
              <p className="text-[10px] text-slate-300 truncate">
                {formatDate(check.checkDate)} · Tạo bởi{' '}
                <strong className="text-white">{check.createdBy || 'N/A'}</strong>
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                id="report-modal-close-btn"
              >
                <X size={18} />
              </button>
              <span
                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${statusCfg.bg} ${statusCfg.text}`}
              >
                {statusCfg.label}
              </span>
            </div>
          </div>

          {/* KPI summary row */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Tổng</p>
              <p className="text-lg font-black text-white">{totalItems}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-emerald-400 uppercase font-bold">Khớp</p>
              <p className="text-lg font-black text-emerald-300">{matchedItems.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-rose-400 uppercase font-bold">Lệch</p>
              <p className="text-lg font-black text-rose-300">{discrepantItems.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Độ CX</p>
              <p className="text-lg font-black text-white">{accuracyPercent}%</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {check.notes && (
          <div className="px-5 py-3 bg-blue-50 border-b border-blue-100 shrink-0">
            <p className="text-[11px] text-blue-700 font-medium">
              <span className="font-bold">Ghi chú:</span> {check.notes}
            </p>
          </div>
        )}

        {/* Total variance highlight */}
        {totalVariance > 0 && (
          <div className="px-5 py-2.5 bg-rose-50 border-b border-rose-100 shrink-0 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-rose-500">warning</span>
            <p className="text-[11px] text-rose-700 font-semibold">
              Tổng sai lệch:{' '}
              <strong className="font-black text-rose-800">{totalVariance} đơn vị</strong>
            </p>
          </div>
        )}

        {/* Details list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {check.details.length === 0 ? (
            <div className="py-12 flex flex-col items-center text-slate-400 gap-2">
              <span className="material-symbols-outlined text-4xl">inbox</span>
              <p className="text-xs font-semibold">Không có chi tiết kiểm kê</p>
            </div>
          ) : (
            check.details.map((detail) => {
              const isMatched = detail.variance === 0;
              const diff = detail.variance;
              return (
                <div
                  key={detail.id}
                  className={`rounded-2xl p-4 border ${isMatched
                    ? 'bg-emerald-50/30 border-emerald-100'
                    : 'bg-rose-50/30 border-rose-200'
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-extrabold text-slate-800 leading-snug break-words">
                        {detail.productName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin size={11} className="text-blue-500" />
                        <span className="text-[10px] font-mono text-slate-500">
                          {detail.locationBarcode || `Vị trí #${detail.locationId}`}
                        </span>
                        {detail.batchNo && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-[10px] text-slate-400">Lô: {detail.batchNo}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      {isMatched ? (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          🟢 Khớp
                        </span>
                      ) : (
                        <span className="text-[9px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          🚨 {diff > 0 ? `+${diff}` : diff}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-3 p-2.5 bg-white rounded-xl border border-slate-100">
                    <div className="flex-1 text-center">
                      <p className="text-[9px] uppercase font-bold text-slate-400">Hệ thống</p>
                      <p className="text-sm font-black text-slate-700">{detail.systemQuantity}</p>
                    </div>
                    <div className="w-px bg-slate-100" />
                    <div className="flex-1 text-center">
                      <p className="text-[9px] uppercase font-bold text-slate-400">Thực tế</p>
                      <p
                        className={`text-sm font-black ${isMatched ? 'text-emerald-600' : 'text-rose-600'}`}
                      >
                        {detail.actualQuantity}
                      </p>
                    </div>
                  </div>

                  {!isMatched && detail.reason && (
                    <p className="mt-2 text-[10px] text-slate-500 italic">
                      Lý do: {detail.reason}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0 flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-3 shrink-0 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            id="report-print-btn"
          >
            <span className="material-symbols-outlined block text-sm">print</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 min-w-0 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm transition-colors"
            id="report-close-btn"
          >
            Đóng báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}
