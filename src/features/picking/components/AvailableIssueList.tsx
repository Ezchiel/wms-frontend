import React, { useState, useEffect } from 'react';
import type { InventoryIssue } from '../../inventoryIssue/inventoryIssueTypes';
import { ClipboardList, Calendar, RefreshCw, Layers, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import PageHeader from '../../../layouts/MobileLayout/PageHeader';
import SortFilterSheet from '../../../components/mobile/SortFilterSheet';

interface Props {
  issues: InventoryIssue[];
  loading: boolean;
  onRefresh: () => void;
  onClaim: (issueId: number) => void;
  onBackToMyTasks?: () => void;
  actionLoading?: boolean;
  onFetchIssues: (params: any) => void;
}

export const AvailableIssueList: React.FC<Props> = ({
  issues,
  loading,
  onRefresh,
  onClaim,
  onBackToMyTasks,
  actionLoading = false,
  onFetchIssues,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sortFilter, setSortFilter] = useState({
    sort: 'issueDate_desc',
    filters: {
      issueDateFrom: '',
      issueDateTo: '',
    },
  });

  // Debounced search & filter dispatch
  useEffect(() => {
    const timer = setTimeout(() => {
      const fromDate = sortFilter.filters.issueDateFrom || undefined;
      const toDate = sortFilter.filters.issueDateTo || undefined;
      const [sortBy, sortDir] = sortFilter.sort.split('_');

      onFetchIssues({
        keyword: searchTerm || undefined,
        fromDate,
        toDate,
        sortBy,
        sortDir,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, sortFilter, onFetchIssues]);

  const sortOptions = [
    { value: 'issueDate_desc', label: 'Mới nhất' },
    { value: 'issueDate_asc', label: 'Cũ nhất' },
    { value: 'issueCode_asc', label: 'Mã phiếu A-Z' },
    { value: 'issueCode_desc', label: 'Mã phiếu Z-A' },
  ];

  const filterGroups = [
    {
      key: 'issueDate',
      label: 'Khoảng ngày tạo',
      type: 'dateRange' as const,
    },
  ];

  const isFiltered = searchTerm || sortFilter.filters.issueDateFrom || sortFilter.filters.issueDateTo;

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      {/* Page Header */}
      <PageHeader
        title="Picking"
        subtitle="Choose an issue to start picking"
        backTo={onBackToMyTasks}
        rightSlot={
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-wms-primary text-white text-xs font-extrabold shadow-md shadow-amber-200/50 active:scale-95 transition-all cursor-pointer"
            id="available-refresh-btn"
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button>
        }
      />

      {/* Main content */}
      <main className="flex-1 max-w-md mx-auto w-full px-5 py-4 space-y-4 pb-28">
        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className='relative flex-1'>
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wms-primary/20 focus:border-wms-primary text-[14px] text-slate-800 placeholder:text-slate-400 transition-all shadow-xs"
                placeholder="Search issue code..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setSheetOpen(true)}
              className="w-12 h-12 bg-white border border-slate-200 text-slate-700 rounded-xl active:scale-95 transition-transform shadow-xs flex items-center justify-center cursor-pointer"
            >
              <SlidersHorizontal className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-wms-text-main">Available for picking</h2>
          <span className="text-[13px] font-medium text-wms-primary bg-wms-primary/10 px-2.5 py-0.5 rounded-full">
            {issues.length} available
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-semibold">Loading data...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white border border-slate-100 rounded-2xl">
            <ClipboardList size={32} className="text-slate-300" />
            <div className="text-center">
              <p className="text-xs font-extrabold text-slate-500">
                {isFiltered ? 'No results found' : 'No available issues'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                {isFiltered ? 'Try changing the filters or search keyword' : 'There are no available issues at the moment.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-xs hover:border-blue-100 transition-colors"
              >
                {/* Code & Title */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-black text-slate-800 leading-snug font-mono">
                      {issue.issueCode}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1">
                      KH: {issue.customerName}
                    </p>
                  </div>
                </div>

                {/* Details info */}
                <div className="grid grid-cols-2 gap-3 pt-1 text-[11px] text-slate-500 font-semibold">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Layers size={13} className="text-slate-400 shrink-0" />
                    <span>Số dòng: {issue.details?.length || 0} SP</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0 justify-end">
                    <Calendar size={13} className="text-slate-400 shrink-0" />
                    <span>{new Date(issue.issueDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                {/* Claim Button */}
                <button
                  onClick={() => onClaim(issue.id)}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer mt-2"
                >
                  {actionLoading ? 'Đang nhận phiếu...' : 'Nhận & bắt đầu picking'}
                </button>
              </div>
            ))}
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
};

export default AvailableIssueList;
