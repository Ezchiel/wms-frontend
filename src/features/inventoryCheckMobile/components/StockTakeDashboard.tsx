import { useState } from 'react';
import { type StockTakeSheet } from '../inventoryCheckMobileTypes';

interface StockTakeDashboardProps {
  sheets: StockTakeSheet[];
  onCreateNewClick: () => void;
  onSelectSheet: (sheet: StockTakeSheet) => void;
  onCancelSheet: (sheetId: string) => void;
  onPopulateMockData: () => void;
}

export default function StockTakeDashboard({
  sheets,
  onCreateNewClick,
  onSelectSheet,
  onCancelSheet,
  onPopulateMockData,
}: StockTakeDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const totalSheets = sheets.length;
  const inProgressSheets = sheets.filter((s) => s.status === 'in_progress').length;
  const completedSheets = sheets.filter((s) => s.status === 'completed').length;

  let discrepantCompletedCount = 0;
  sheets.forEach((sheet) => {
    if (sheet.status === 'completed') {
      const hasDiscrepancy = sheet.items.some(
        (item) => item.actualQty !== null && item.actualQty !== item.expectedQty
      );
      if (hasDiscrepancy) {
        discrepantCompletedCount++;
      }
    }
  });

  const filteredSheets = sheets.filter((s) => {
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchesSearch =
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.notes && s.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.zone && s.zone.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const formatDate = (isoStr: string) => {
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'position':
        return {
          label: 'Theo Vị trí',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          icon: 'location_on',
        };
      case 'product':
        return {
          label: 'Theo Sản phẩm',
          bg: 'bg-amber-50 text-amber-700 border-amber-100',
          icon: 'inventory_2',
        };
      default:
        return {
          label: 'Toàn bộ kho',
          bg: 'bg-purple-50 text-purple-700 border-purple-100',
          icon: 'select_all',
        };
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen font-sans">
      <div className="bg-white border-b border-slate-100 px-4 py-5 shadow-xs sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* <div className=" h-10 shrink-0 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <span className="material-symbols-outlined font-light ">warehouse</span>
            </div> */}
            <div className="flex-1 min-w-0">
              <h1 className="m-2 text-base font-bold text-slate-800 leading-none truncate">
                Hệ thống Kiểm kê Kho
              </h1>
              <span className="m-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1 inline-block truncate">
                Quản lý kho thông minh
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onCreateNewClick}
              className="flex p-2 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100/70 hover:text-blue-700 active:scale-90 transition-all font-semibold"
            >
              <span className="material-symbols-outlined text-xl">add</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-5 space-y-5 pb-32">
        <div className="grid grid-cols-2 gap-3" id="kpi-panel">
          {/* Card 1 */}
          <div className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-xs">
            <div className="space-y-0.5 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                Tổng số phiếu
              </p>
              <p className="text-2xl font-black text-slate-800 font-mono">{totalSheets}</p>
            </div>
          </div>
          {/* Card 2 */}
          <div className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-xs">
            <div className="space-y-0.5 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                Đang thực hiện
              </p>
              <p className="text-2xl font-black text-blue-600 font-mono">{inProgressSheets}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredSheets.map((sheet) => {
            const typeConfig = getTypeLabel(sheet.type);
            const isCompleted = sheet.status === 'completed';

            return (
              <div
                key={sheet.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-slate-800 truncate">
                        {sheet.code}
                      </h3>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
                      >
                        {isCompleted ? 'Hoàn thành' : 'Đang đếm'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      Tạo ngày: {formatDate(sheet.createdAt)}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 wrap-break-word">
                      Ghi chú: {sheet.notes || 'Không có ghi chú'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {!isCompleted ? (
                    <>
                      <button
                        onClick={() => onSelectSheet(sheet)}
                        className="flex-1 min-w-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 truncate"
                      >
                        <span className="material-symbols-outlined text-sm shrink-0">
                          edit_document
                        </span>
                        <span className="truncate">Tiếp tục kiểm</span>
                      </button>
                      <button
                        onClick={() => onCancelSheet(sheet.id)}
                        className="px-3.5 py-2.5 shrink-0 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-bold"
                      >
                        <span className="material-symbols-outlined text-sm block">delete</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onSelectSheet(sheet)}
                      className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm shrink-0">analytics</span>
                      <span className="truncate">Xem Báo Cáo</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
