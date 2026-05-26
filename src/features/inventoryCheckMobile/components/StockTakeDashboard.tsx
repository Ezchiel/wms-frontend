import { useState } from 'react';
import type { InventoryCheck, CheckStatus } from '../../inventoryCheck/inventoryCheckTypes';
import { ChartArea, FileSearchCorner, Inbox, Plus, ReceiptText } from 'lucide-react';

interface StockTakeDashboardProps {
  checks: InventoryCheck[];
  loading: boolean;
  onCreateNewClick: () => void;
  onViewCheck: (check: InventoryCheck) => void;
}

const STATUS_CONFIG: Record<CheckStatus, { label: string; bg: string; text: string; dot: string }> =
{
  PENDING: {
    label: 'Chờ xác nhận',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    dot: 'bg-emerald-400',
  },
  CANCELLED: {
    label: 'Đã huỷ',
    bg: 'bg-red-100',
    text: 'text-red-600',
    dot: 'bg-red-400',
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

export default function StockTakeDashboard({
  checks,
  loading,
  onCreateNewClick,
  onViewCheck,
}: StockTakeDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<CheckStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const totalChecks = checks.length;
  const pendingChecks = checks.filter((c) => c.status === 'PENDING').length;
  const completedChecks = checks.filter((c) => c.status === 'COMPLETED').length;

  const filteredChecks = checks.filter((c) => {
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesSearch =
      !searchTerm ||
      c.checkCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.createdBy?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* ── Sticky Header ── */}
      <div className="bg-white border-b border-slate-100 px-4 py-4 sticky top-0 z-20 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-black text-slate-800 leading-none">Kiểm kê kho</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1 block">
              Quản lý phiếu kiểm kê
            </span>
          </div>
          <button
            onClick={onCreateNewClick}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-extrabold shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
            id="create-new-check-btn"
          >
            <Plus size={13} />
            Tạo phiếu mới
          </button>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-5 space-y-5 pb-32">
        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="relative h-24 p-3.5 bg-white border border-slate-100 rounded-2xl shadow-xs text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng</p>
            <p className="absolute bottom-4 left-[50%] translate-x-[-50%] text-2xl font-black text-slate-800 font-mono mt-0.5">{totalChecks}</p>
          </div>
          <div className="relative h-24 p-3.5 bg-white border border-slate-100 rounded-2xl shadow-xs text-center">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
              Chờ xác nhận
            </p>
            <p className="absolute bottom-4 left-[50%] translate-x-[-50%] text-2xl font-black text-amber-600 font-mono mt-0.5">{pendingChecks}</p>
          </div>
          <div className="relative h-24 p-3.5 bg-white border border-slate-100 rounded-2xl shadow-xs text-center">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              Hoàn thành
            </p>
            <p className="absolute bottom-4 left-[50%] translate-x-[-50%] text-2xl font-black text-emerald-600 font-mono mt-0.5">{completedChecks}
            </p>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <FileSearchCorner size={15} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã, ghi chú, người tạo..."
            className="w-full bg-white border border-slate-100 rounded-xl pl-8 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-100 shadow-xs placeholder-slate-400"
            id="check-search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          )}
        </div>

        {/* ── Status Filter Tabs ── */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {(['ALL', 'PENDING', 'COMPLETED', 'CANCELLED'] as const).map((status) => {
            const isActive = filterStatus === status;
            const cfg = status !== 'ALL' ? STATUS_CONFIG[status] : null;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold transition-all ${isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-200'
                  }`}
                id={`filter-${status}`}
              >
                {status === 'ALL'
                  ? `Tất cả (${totalChecks})`
                  : cfg
                    ? cfg.label
                    : status}
              </button>
            );
          })}
        </div>

        {/* ── Check List ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
            <p className="text-xs text-slate-400 font-semibold">Đang tải danh sách phiếu...</p>
          </div>
        ) : filteredChecks.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-slate-400 gap-3">
            <Inbox size={48} />
            <p className="text-sm font-bold">Không có phiếu nào</p>
            <p className="text-xs text-center max-w-48">
              {searchTerm || filterStatus !== 'ALL'
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Tạo phiếu kiểm kê đầu tiên của bạn'}
            </p>
            {!searchTerm && filterStatus === 'ALL' && (
              <button
                onClick={onCreateNewClick}
                className="mt-2 px-5 py-2.5 flex items-center gap-1 bg-blue-600 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-200 active:scale-95 transition-all"
              >
                <Plus size={13} />
                Tạo phiếu mới
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredChecks.map((check) => {
              const cfg = STATUS_CONFIG[check.status];
              const discrepantCount = check.details.filter((d) => d.variance !== 0).length;
              const totalLines = check.details.length;

              return (
                <div
                  key={check.id}
                  className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs hover:shadow-sm transition-shadow"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-extrabold text-slate-800 truncate">
                          {check.checkCode}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} block`} />
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">
                        {formatDate(check.checkDate)}
                      </p>
                      {check.createdBy && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Tạo bởi: <span className="font-semibold text-slate-600">{check.createdBy}</span>
                        </p>
                      )}
                    </div>

                    {/* Lines summary badge */}
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Số dòng</p>
                      <p className="text-lg font-black text-slate-700 font-mono">{totalLines}</p>
                    </div>
                  </div>

                  {/* Notes */}
                  {check.notes && (
                    <p className="mt-2.5 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {check.notes}
                    </p>
                  )}

                  {/* Discrepancy warning */}
                  {check.status === 'PENDING' && discrepantCount > 0 && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5">
                      <span className="material-symbols-outlined text-xs">warning</span>
                      <span className="font-semibold">{discrepantCount} dòng có sai lệch</span>
                    </div>
                  )}

                  {/* Action button */}
                  <div className="mt-3.5">
                    <button
                      onClick={() => onViewCheck(check)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${check.status === 'PENDING'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      id={`view-check-btn-${check.id}`}
                    >
                      {check.status === 'PENDING' ? <ReceiptText size={16} /> : <ChartArea size={16} />}
                      {check.status === 'PENDING' ? 'Xem chi tiết' : 'Xem báo cáo'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
