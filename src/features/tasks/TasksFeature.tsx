import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Search as SearchIcon, SlidersHorizontal, Loader2 } from 'lucide-react';
import TaskCard from './components/TaskCard';
import { useTasks } from './useTasks';
import PageHeader from '../../layouts/MobileLayout/PageHeader';
import SortFilterSheet from '../../components/mobile/SortFilterSheet';

export const TasksFeature: React.FC = () => {
  const { state, actions } = useTasks();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(state.keyword || '');
  const [sheetOpen, setSheetOpen] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      actions.handleSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sync state.keyword back to input if reset
  useEffect(() => {
    setSearchTerm(state.keyword);
  }, [state.keyword]);

  // Scroll down to the bottom of the page detection logic
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        actions.handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [actions, state.loading, state.mobileHasMore]);

  const sortOptions = [
    { value: 'createdAt_desc', label: 'Newest' },
    { value: 'createdAt_asc', label: 'Oldest' },
    { value: 'receiptCode_asc', label: 'Receipt Code A-Z' },
    { value: 'receiptCode_desc', label: 'Receipt Code Z-A' },
  ];

  const filterGroups = [
    {
      key: 'taskType',
      label: 'Type',
      type: 'chip' as const,
      options: [
        { value: 'receiving', label: 'Receive' },
        { value: 'putaway', label: 'Putaway' },
      ],
    },
    {
      key: 'assignedFilter',
      label: 'User',
      type: 'chip' as const,
      options: [
        { value: 'ALL', label: 'All' },
        { value: 'UNASSIGNED', label: 'Unassigned' },
        { value: 'ME', label: 'Me' },
      ],
    },
    {
      key: 'createdAt',
      label: 'Date',
      type: 'dateRange' as const,
    },
  ];

  return (
    <>
      <PageHeader
        title="Putaway"
        subtitle="Manage putaway tasks"
        rightSlot={
          <button
            onClick={() => navigate('/mobile/receipt-scan')}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-wms-primary text-white text-xs font-extrabold shadow-md shadow-amber-200/50 active:scale-95 transition-all cursor-pointer"
            id="camera-scan-receipt-btn"
          >
            <Camera size={13} />
            <span>Scan putaway</span>
          </button>
        }
      />

      <main className="max-w-md mx-auto px-5 py-6">
        {/* Search & Filter Area */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-wms-muted w-4 h-4" />
              <input
                className="w-full pl-11 pr-4 py-3 bg-white border border-wms-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-wms-primary/20 focus:border-wms-primary text-[14px] text-wms-text-main placeholder:text-wms-muted transition-all shadow-sm"
                placeholder="Search receipt code..."
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
          <h2 className="text-[15px] font-bold text-wms-text-main">Receipts in processing</h2>
          <span className="text-[13px] font-medium text-wms-primary bg-wms-primary/10 px-2.5 py-0.5 rounded-full">
            {state.meta?.totalElements || 0} tasks
          </span>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {state.receipts.map((receipt) => (
            <TaskCard key={receipt.id} receipt={receipt} />
          ))}
        </div>

        {/* Loading Indicator */}
        {state.loading && (
          <div className="py-4 flex items-center justify-center text-wms-muted text-[13px]">
            <Loader2 className="animate-spin mr-2 w-4 h-4" />
            Loading more...
          </div>
        )}

        {!state.mobileHasMore && state.receipts.length > 0 && (
          <div className="py-10 text-center text-wms-muted text-[12px]">
            You have reached the end of the list.
          </div>
        )}
      </main>

      <SortFilterSheet
        open={sheetOpen}
        sortOptions={sortOptions}
        filterGroups={filterGroups}
        value={state.sortFilter}
        onApply={(val) => {
          actions.handleSortFilter(val);
          setSheetOpen(false);
        }}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
};
