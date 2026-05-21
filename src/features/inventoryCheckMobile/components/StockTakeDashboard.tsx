import { useState } from 'react';
import { type StockTakeSheet } from '../inventoryCheckMobileTypes';

interface StockTakeDashboardProps {
  sheets: StockTakeSheet[];
  onCreateNewClick: () => void;
  onSelectSheet: (sheet: StockTakeSheet) => void;
  onCancelSheet: (sheetId: string) => void;
  onPopulateMockData: () => void; // populate mock completed items
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

  // Calculate statistics for KPIs
  const totalSheets = sheets.length;
  const inProgressSheets = sheets.filter((s) => s.status === 'in_progress').length;
  const completedSheets = sheets.filter((s) => s.status === 'completed').length;

  // Calculate total discrepant items within completed sheets
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

  // Filter sheets
  const filteredSheets = sheets.filter((s) => {
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchesSearch =
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.notes && s.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.zone && s.zone.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Helper date renderer
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
          label: 'Theo Bản sản phẩm',
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
    <div className="bg-[#f9f9ff] min-h-screen font-sans">
      {/* Premium Admin Dashboard Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-5 shadow-xs sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo box */}
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <span className="material-symbols-outlined font-light text-2xl">warehouse</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 leading-none">
                Hệ thống Kiểm kê Kho
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1 inline-block">
                Quản lý kho thông minh
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCreateNewClick}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100/70 hover:text-blue-700 active:scale-90 transition-all font-semibold"
              title="Tạo phiếu kiểm mới"
              id="top-add-sheet-btn"
            >
              <span className="material-symbols-outlined text-xl">add</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-5 space-y-5 pb-32">
        {/* KPI Stats Panel - Bento Grid */}
        <div className="grid grid-cols-2 gap-3" id="kpi-panel">
          {/* Card 1: Total */}
          <div className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Tổng số phiếu
              </p>
              <p className="text-2xl font-black text-slate-800 font-mono">{totalSheets}</p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
              <span className="material-symbols-outlined text-lg">receipt_long</span>
            </div>
          </div>

          {/* Card 2: In progress */}
          <div className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Đang thực hiện
              </p>
              <p className="text-2xl font-black text-blue-600 font-mono">{inProgressSheets}</p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0">
              <span className="material-symbols-outlined text-lg">sync</span>
            </div>
          </div>

          {/* Card 3: Completed */}
          <div className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Đã hoàn thành
              </p>
              <p className="text-2xl font-black text-green-600 font-mono">{completedSheets}</p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-500 shrink-0">
              <span className="material-symbols-outlined text-lg">task_alt</span>
            </div>
          </div>

          {/* Card 4: Discrepancy warning count */}
          <div className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Số phiếu bị lệch
              </p>
              <p className="text-2xl font-black text-red-500 font-mono">
                {discrepantCompletedCount}
              </p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shrink-0">
              <span className="material-symbols-outlined text-lg">warning</span>
            </div>
          </div>
        </div>

        {/* Quick actions row */}
        <div className="flex gap-2">
          <button
            onClick={onCreateNewClick}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
            id="create-new-sheet-trigger-btn"
          >
            <span className="material-symbols-outlined text-lg font-bold">add_box</span>
            <span>Tạo Phiếu Kiểm Kê Mới</span>
          </button>

          {sheets.length === 0 && (
            <button
              onClick={onPopulateMockData}
              className="px-4 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 transition-colors"
              title="Điền mẫu có sẵn để trải nghiệm đầy đủ tính năng"
              id="populate-mock-data-btn"
            >
              Nạp mẫu
            </button>
          )}
        </div>

        {/* Filters and search container */}
        <div className="bg-white p-3 border border-slate-100 rounded-2xl space-y-3 shadow-xs">
          {/* Status Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            {(['all', 'in_progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
                  filterStatus === status
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                id={`filter-tab-${status}`}
              >
                {status === 'all' && 'Tất cả'}
                {status === 'in_progress' && 'Đang kiểm'}
                {status === 'completed' && 'Hoàn thành'}
              </button>
            ))}
          </div>

          {/* Search text input */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all text-xs font-medium text-slate-800"
              placeholder="Tìm theo mã phiếu, ghi chú, khu vực..."
              id="search-sheets-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Inventory Sheets List */}
        <div className="space-y-3.5">
          <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-wider px-1">
            <span>Danh sách phiếu kiểm ({filteredSheets.length})</span>
            {sheets.length > 0 && sheets.length !== filteredSheets.length && (
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setSearchTerm('');
                }}
                className="text-blue-500 hover:underline capitalize"
              >
                Xóa lọc
              </button>
            )}
          </div>

          {filteredSheets.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-slate-100 bg-white rounded-3xl text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-slate-300 block">
                assignment_late
              </span>
              <div>
                <p className="text-xs font-bold text-slate-800">Không tìm thấy phiếu kiểm kê</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-60 mx-auto">
                  Chưa có phiếu kiểm nào trong danh sách khớp với điều kiện tìm kiếm của bạn. Hãy
                  tạo mới hoặc kích hoạt dữ liệu mẫu.
                </p>
              </div>
              {sheets.length === 0 && (
                <button
                  type="button"
                  onClick={onPopulateMockData}
                  className="px-4 py-2 bg-blue-50 border border-blue-100 text-blue-600 font-bold rounded-xl text-xs hover:bg-blue-100 transition-colors"
                >
                  Nạp Dữ liệu Mẫu
                </button>
              )}
            </div>
          ) : (
            filteredSheets.map((sheet) => {
              // Calculate completion bar progress inside card
              const totalItems = sheet.items.length;
              const countedItems = sheet.items.filter((item) => item.actualQty !== null).length;
              const percentComplete =
                totalItems > 0 ? Math.round((countedItems / totalItems) * 100) : 0;

              // Check for variance
              const hasDiscrepancy = sheet.items.some(
                (item) => item.actualQty !== null && item.actualQty !== item.expectedQty
              );

              const typeStyle = getTypeLabel(sheet.type);

              return (
                <div
                  key={sheet.id}
                  className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3.5 shadow-xs hover:border-blue-200/50 hover:shadow-xs transition-all duration-200"
                  id={`sheet-card-${sheet.code}`}
                >
                  {/* First row: Code, Status & Type badge */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-sm text-slate-800">
                          {sheet.code}
                        </span>
                        {/* Type badge */}
                        <div
                          className={`flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold border rounded-full ${typeStyle.bg}`}
                        >
                          <span className="material-symbols-outlined text-[11px]">
                            {typeStyle.icon}
                          </span>
                          <span>{typeStyle.label}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                        <span>Ngày tạo: {formatDate(sheet.createdAt)}</span>
                        <span>•</span>
                        <span>{sheet.createdBy}</span>
                      </div>
                    </div>

                    {/* Status indicator */}
                    {sheet.status === 'in_progress' ? (
                      <span className="text-[10px] bg-blue-50 text-blue-600 font-extrabold border border-blue-100 px-2 py-0.5 rounded-md animate-pulse">
                        Đang kiểm
                      </span>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 font-extrabold border border-emerald-100 px-2 py-0.5 rounded-md">
                          Hoàn thành
                        </span>
                        {hasDiscrepancy && (
                          <span className="text-[9px] text-red-500 font-extrabold flex items-center bg-red-50 px-1.5 py-0.2 rounded border border-red-100">
                            🚨 Có chênh lệch
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Summary filters used or selected labels */}
                  <div className="text-[11px] font-medium text-slate-600 bg-slate-50/60 p-2.5 rounded-xl space-y-1">
                    {sheet.type === 'position' && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Điều kiện kiểm:</span>
                        <span className="font-bold text-slate-700">
                          {sheet.zone} • {sheet.rack}
                        </span>
                      </div>
                    )}
                    {sheet.type === 'product' && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Kiểm sản phẩm:</span>
                        <span className="font-bold text-blue-600 truncate max-w-50">
                          {sheet.items[0]?.name || 'Chi tiết'}
                        </span>
                      </div>
                    )}
                    {sheet.type === 'all' && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Quy mô:</span>
                        <span className="font-bold text-violet-600">Toàn bộ kho hàng</span>
                      </div>
                    )}

                    {sheet.notes && (
                      <div className="pt-1.5 border-t border-slate-100/50 text-[10px] text-slate-400 italic">
                        &quot;{sheet.notes}&quot;
                      </div>
                    )}
                  </div>

                  {/* Mid Row: Completion Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] text-slate-500 font-bold">
                      <span>Tiến độ thực tế:</span>
                      <span className="text-slate-700 font-mono">
                        {countedItems}/{totalItems} mặt hàng ({percentComplete}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          sheet.status === 'completed'
                            ? hasDiscrepancy
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${percentComplete}%` }}
                      />
                    </div>
                  </div>

                  {/* Bottom: Action trigger items */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                    {sheet.status === 'in_progress' ? (
                      <>
                        <button
                          onClick={() => onSelectSheet(sheet)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/10 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                          id={`continue-sheet-${sheet.code}`}
                        >
                          <span className="material-symbols-outlined text-sm font-bold animate-pulse">
                            play_arrow
                          </span>
                          <span>Tiếp Tục Kiểm Kho</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa phiếu kiểm kê ${sheet.code}?`)) {
                              onCancelSheet(sheet.id);
                            }
                          }}
                          className="px-3.5 py-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-bold border border-red-100 transition-colors"
                          title="Hủy/Xóa phiếu"
                          id={`cancel-sheet-${sheet.code}`}
                        >
                          <span className="material-symbols-outlined text-sm block">delete</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onSelectSheet(sheet)}
                        className="w-full bg-slate-100 hover:bg-slate-200/80 active:scale-98 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-200/30"
                        id={`view-report-sheet-${sheet.code}`}
                      >
                        <span className="material-symbols-outlined text-sm text-slate-500">
                          analytics
                        </span>
                        <span>Xem Báo Cáo Chênh Lệch</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
