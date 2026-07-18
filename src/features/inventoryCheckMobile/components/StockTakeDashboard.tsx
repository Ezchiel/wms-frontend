import { useState, useEffect } from 'react';
import type { InventoryCheck, CheckStatus } from '../../inventoryCheck/inventoryCheckTypes';
import { ChartArea, Inbox, Plus, ReceiptText, AlertTriangle, SearchIcon, SlidersHorizontal } from 'lucide-react';
import PageHeader from '../../../layouts/MobileLayout/PageHeader';
import SortFilterSheet from '../../../components/mobile/SortFilterSheet';

interface StockTakeDashboardProps {
  checks: InventoryCheck[];
  loading: boolean;
  onCreateNewClick: () => void;
  onViewCheck: (check: InventoryCheck) => void;
  onFetchChecks: (params: any) => void;
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
  onFetchChecks,
}: StockTakeDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sortFilter, setSortFilter] = useState({
    sort: 'id_desc',
    filters: {
      status: 'ALL',
      createdByMe: 'ALL',
      checkDateFrom: '',
      checkDateTo: '',
    },
  });

  const totalChecks = checks.length;

  // Debounced search & filter dispatch
  useEffect(() => {
    const timer = setTimeout(() => {
      const statusVal = sortFilter.filters.status === 'ALL' ? undefined : sortFilter.filters.status;
      const createdByMeVal = sortFilter.filters.createdByMe === 'ME' ? true : undefined;
      const fromDate = sortFilter.filters.checkDateFrom || undefined;
      const toDate = sortFilter.filters.checkDateTo || undefined;
      const [sortBy, sortDir] = sortFilter.sort.split('_');

      onFetchChecks({
        keyword: searchTerm || undefined,
        status: statusVal,
        createdByMe: createdByMeVal,
        fromDate,
        toDate,
        sortBy,
        sortDir,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, sortFilter, onFetchChecks]);

  const sortOptions = [
    { value: 'id_desc', label: 'Newest' },
    { value: 'id_asc', label: 'Oldest' },
    { value: 'checkCode_asc', label: 'Check Code A-Z' },
    { value: 'checkCode_desc', label: 'Check Code Z-A' },
  ];

  const filterGroups = [
    {
      key: 'status',
      label: 'Status',
      type: 'chip' as const,
      options: [
        { value: 'ALL', label: 'All' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' },
      ],
    },
    {
      key: 'createdByMe',
      label: 'User',
      type: 'chip' as const,
      options: [
        { value: 'ALL', label: 'All' },
        { value: 'ME', label: 'Me' },
      ],
    },
    {
      key: 'checkDate',
      label: 'Date',
      type: 'dateRange' as const,
    },
  ];

  const isFiltered =
    searchTerm ||
    sortFilter.filters.status !== 'ALL' ||
    sortFilter.filters.createdByMe !== 'ALL' ||
    sortFilter.filters.checkDateFrom ||
    sortFilter.filters.checkDateTo;

  return (
    <div className="bg-wms-bg min-h-screen font-sans">
      {/* ── Shared Page Header ── */}
      <PageHeader
        title="Stock take"
        subtitle="Manage stock take orders"
        rightSlot={
          <button
            onClick={onCreateNewClick}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-md shadow-amber-200/50 active:scale-95 transition-all cursor-pointer"
            id="create-new-check-btn"
          >
            <Plus size={13} />
            <span>Create new check</span>
          </button>
        }
      />

      <main className="max-w-md mx-auto px-5 py-5 space-y-5 pb-32">
        {/* Search & Filter Area */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-wms-muted w-4 h-4" />
              <input
                className="w-full pl-11 pr-4 py-3 bg-white border border-wms-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-wms-primary/20 focus:border-wms-primary text-[14px] text-wms-text-main placeholder:text-wms-muted transition-all shadow-sm"
                placeholder="Search check code..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setSheetOpen(true)}
              className="w-12 h-12 bg-white border border-wms-border-color text-wms-text-main rounded-xl active:scale-95 transition-transform shadow-sm flex items-center justify-center cursor-pointer"
            >
              <SlidersHorizontal className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-wms-text-main">Checks in processing</h2>
          <span className="text-[13px] font-medium text-wms-primary bg-wms-primary/10 px-2.5 py-0.5 rounded-full">
            {totalChecks} tasks
          </span>
        </div>

        {/* ── Check List ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-4 border-amber-600 rounded-full border-t-transparent animate-spin" />
            <p className="text-xs text-slate-400 font-semibold">Loading data...</p>
          </div>
        ) : checks.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-slate-400 gap-3 bg-white border border-wms-border-color rounded-2xl">
            <Inbox size={48} className="text-slate-300" />
            <p className="text-sm font-bold text-slate-500">No data</p>
            <p className="text-xs text-center text-slate-400 max-w-48 leading-relaxed">
              {isFiltered
                ? 'Try changing the filters or search keyword'
                : 'Create your first stock take'}
            </p>
            {!isFiltered && (
              <button
                onClick={onCreateNewClick}
                className="mt-2 px-5 py-2.5 flex items-center gap-1 bg-amber-600 text-white text-xs font-extrabold rounded-xl shadow-md shadow-amber-200/50 hover:bg-amber-700 active:scale-95 transition-all cursor-pointer"
              >
                <Plus size={13} />
                Create new check
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {checks.map((check) => {
              const cfg = STATUS_CONFIG[check.status] || { label: check.status, bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' };
              const discrepantCount = check.details ? check.details.filter((d) => d.variance !== 0).length : 0;
              const totalLines = check.details ? check.details.length : 0;

              return (
                <div
                  key={check.id}
                  className="bg-white border border-wms-border-color rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-extrabold text-slate-800 truncate font-mono">
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
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span className="font-semibold">{discrepantCount} dòng có sai lệch</span>
                    </div>
                  )}

                  {/* Action button */}
                  <div className="mt-3.5">
                    <button
                      onClick={() => onViewCheck(check)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${check.status === 'PENDING'
                        ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-100'
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

      <SortFilterSheet
        open={sheetOpen}
        sortOptions={sortOptions}
        filterGroups={filterGroups}
        value={sortFilter}
        onApply={(val) => {
          setSortFilter(val);
          setSheetOpen(false);
        }}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
