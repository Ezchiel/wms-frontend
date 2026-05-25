import { type StockTakeSheet, MOCK_PRODUCTS } from '../inventoryCheckMobileTypes';

interface ReportModalProps {
  sheet: StockTakeSheet;
  onClose: () => void;
}

export default function ReportModal({ sheet, onClose }: ReportModalProps) {
  const totalItems = sheet.items.length;
  const matcheditems = sheet.items.filter((item) => item.actualQty === item.expectedQty);

  const accuracyPercent = totalItems > 0 ? Math.round((matcheditems.length / totalItems) * 100) : 0;

  const formatDate = (isoStr: string | null) => {
    if (!isoStr) return '';
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString('vi-VN', {
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-md my-8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn">
        <div className="bg-slate-900 text-white p-5 shrink-0 relative">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1 flex-1 min-w-0">
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">
                Kết quả báo cáo
              </span>
              <h2 className="text-lg font-black tracking-tight truncate">{sheet.code}</h2>
              <p className="text-[10px] text-slate-300 truncate">
                Thực hiện: {formatDate(sheet.completedAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 shrink-0 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
            >
              <span className="material-symbols-outlined block text-sm">close</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-white/10 text-[11px] text-slate-300 font-medium">
            <span className="flex items-center min-w-0">
              Hình thức:{' '}
              <strong className="text-white ml-1 truncate">
                {sheet.type === 'position'
                  ? 'Theo Vị trí'
                  : sheet.type === 'product'
                    ? 'Theo Sản phẩm'
                    : 'Toàn kho'}
              </strong>
            </span>
            {sheet.zone && (
              <span className="flex items-center min-w-0 max-w-30">
                Khu vực: <strong className="text-white ml-1 truncate">{sheet.zone}</strong>
              </span>
            )}
            {sheet.rack && (
              <span className="flex items-center min-w-0 max-w-30">
                Dãy: <strong className="text-white ml-1 truncate">{sheet.rack}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 hide-scrollbar">
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
            <div className="relative shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-slate-100 shadow-xs">
              <span className="text-xs font-black text-slate-800">{accuracyPercent}%</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-extrabold text-slate-800 truncate">
                Độ chính xác tồn kho
              </h3>
            </div>
          </div>

          {sheet.notes && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
              <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-1">Ghi chú</h4>
              {/* SỬA LỖI Ở ĐÂY: break-words whitespace-normal */}
              <p className="text-xs font-medium text-slate-700 wrap-break-word whitespace-normal leading-relaxed">
                {sheet.notes}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0 flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-3 shrink-0 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
          >
            <span className="material-symbols-outlined block text-sm">print</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 min-w-0 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm truncate"
          >
            Đóng báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}
