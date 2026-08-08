import React, { useState } from 'react';
import type { PickingTask } from '../pickingTypes';
import PickingTaskCard from './PickingTaskCard';
import { RefreshCw, Search, X, PackageSearch, SlidersHorizontal } from 'lucide-react';
import PageHeader from '../../../layouts/MobileLayout/PageHeader';
import SortFilterSheet from '../../../components/mobile/SortFilterSheet';

interface Props {
  tasks: PickingTask[];
  loading: boolean;
  onRefresh: () => void;
  onSelectTask: (task: PickingTask) => void;
  onSelectNewIssue?: () => void;
}

export const PickingTaskList: React.FC<Props> = ({
  tasks,
  loading,
  onRefresh,
  onSelectTask,
  onSelectNewIssue,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sortFilter, setSortFilter] = useState({
    sort: 'id_desc',
    filters: {
      status: 'ALL',
    },
  });

  const sortOptions = [
    { value: 'id_desc', label: 'Newest' },
    { value: 'id_asc', label: 'Oldest' },
    { value: 'productName_asc', label: 'Product name A-Z' },
    { value: 'productName_desc', label: 'Product name Z-A' },
  ];

  const filterGroups = [
    {
      key: 'status',
      label: 'Status',
      type: 'chip' as const,
      options: [
        { value: 'ALL', label: 'All' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'IN_PROGRESS', label: 'In progress' },
        { value: 'DONE', label: 'Done' },
      ],
    },
  ];

  const filteredTasks = tasks.filter((task) => {
    const statusVal = sortFilter.filters.status;
    const tabOk = statusVal === 'ALL' || task.status === statusVal;
    const searchOk =
      !searchTerm ||
      task.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.issueCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.locationBarcode.toLowerCase().includes(searchTerm.toLowerCase());
    return tabOk && searchOk;
  });

  // Client-side sort
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const [sortBy, sortDir] = sortFilter.sort.split('_');
    let comparison = 0;
    if (sortBy === 'id') {
      comparison = a.id - b.id;
    } else if (sortBy === 'productName') {
      comparison = a.productName.localeCompare(b.productName);
    }
    return sortDir === 'desc' ? -comparison : comparison;
  });

  const isFiltered = searchTerm || sortFilter.filters.status !== 'ALL';

  return (
    <div className="bg-wms-bg min-h-screen flex flex-col font-sans">
      {/* Shared Page Header */}
      <PageHeader
        title="Picking"
        subtitle="Tasks assigned to you"
        rightSlot={
          <>
            {!tasks.some((t) => t.status === 'PENDING' || t.status === 'IN_PROGRESS') && onSelectNewIssue && (
              <button
                onClick={onSelectNewIssue}
                className="py-1.5 px-3 bg-wms-primary hover:bg-wms-primary-hover text-white font-extrabold text-[10px] rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
              >
                Claim new issues
              </button>
            )}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-wms-border-color text-wms-text-main hover:bg-slate-50 transition-all active:scale-90 cursor-pointer shrink-0"
              id="picking-refresh-btn"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </>
        }
      />

      <main className="flex-1 max-w-md mx-auto w-full px-5 py-4 space-y-4 pb-28">
        {/* Search Bar & Sliders Button */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm sản phẩm, mã phiếu, mã kệ..."
              className="w-full bg-white border border-wms-border-color rounded-xl pl-11 pr-8 py-3 text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-wms-primary/20 focus:border-wms-primary placeholder:text-wms-muted transition-all shadow-sm"
              id="picking-search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setSheetOpen(true)}
            className="w-12 h-12 bg-white border border-wms-border-color text-wms-text-main rounded-xl active:scale-95 transition-transform shadow-sm flex items-center justify-center cursor-pointer"
          >
            <SlidersHorizontal className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-4 border-wms-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-semibold">Loading...</p>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white border border-wms-border-color rounded-2xl shadow-sm">
            <PackageSearch size={32} className="text-slate-300" />
            <div className="text-center">
              <p className="text-xs font-extrabold text-slate-500">
                {isFiltered ? 'No result found' : 'No tasks assigned'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                {isFiltered
                  ? 'Try changing filters or search keywords'
                  : 'No picking tasks assigned'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <PickingTaskCard
                key={task.id}
                task={task}
                onSelect={onSelectTask}
              />
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

export default PickingTaskList;
