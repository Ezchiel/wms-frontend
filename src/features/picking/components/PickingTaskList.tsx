import React, { useState } from 'react';
import type { PickingTask, PickingTaskStatus } from '../pickingTypes';
import PickingTaskCard from './PickingTaskCard';
import PickingStatsBar from './PickingStatsBar';
import { RefreshCw, Search, X, PackageSearch } from 'lucide-react';

interface Props {
  tasks: PickingTask[];
  loading: boolean;
  onRefresh: () => void;
  onSelectTask: (task: PickingTask) => void;
  onSelectNewIssue?: () => void;
}

type FilterTab = 'ALL' | PickingTaskStatus;

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ lấy' },
  { key: 'IN_PROGRESS', label: 'Đang làm' },
  { key: 'DONE', label: 'Hoàn thành' },
];

export const PickingTaskList: React.FC<Props> = ({
  tasks,
  loading,
  onRefresh,
  onSelectTask,
  onSelectNewIssue,
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter((task) => {
    const tabOk = activeTab === 'ALL' || task.status === activeTab;
    const searchOk =
      !searchTerm ||
      task.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.issueCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.locationBarcode.toLowerCase().includes(searchTerm.toLowerCase());
    return tabOk && searchOk;
  });

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      {/* Sticky Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs">
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <div>
            <h1 className="font-black text-base text-slate-800 leading-tight">Lấy hàng</h1>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              Các nhiệm vụ được giao cho bạn
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!tasks.some((t) => t.status === 'PENDING' || t.status === 'IN_PROGRESS') && onSelectNewIssue && (
              <button
                onClick={onSelectNewIssue}
                className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                Chọn phiếu mới
              </button>
            )}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all active:scale-90"
              id="picking-refresh-btn"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-4 space-y-4 pb-28">
        {/* Stats Bar */}
        <PickingStatsBar tasks={tasks} />

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={14} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm sản phẩm, mã phiếu, mã kệ..."
            className="w-full bg-white border border-slate-100 rounded-xl pl-8 pr-8 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-100 placeholder-slate-400"
            id="picking-search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Tab Filter */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
          {TABS.map(({ key, label }) => {
            const count =
              key === 'ALL'
                ? tasks.length
                : tasks.filter((t) => t.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-2 text-[10px] font-extrabold rounded-lg transition-all text-center ${
                  activeTab === key
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                id={`picking-tab-${key}`}
              >
                {label}
                <span className="block text-[9px] font-black opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-semibold">Đang tải nhiệm vụ...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white border border-slate-100 rounded-2xl">
            <PackageSearch size={32} className="text-slate-300" />
            <div className="text-center">
              <p className="text-xs font-extrabold text-slate-500">Không có nhiệm vụ nào</p>
              <p className="text-[10px] text-slate-400 mt-1">
                {searchTerm
                  ? 'Không tìm thấy kết quả phù hợp'
                  : 'Chưa có nhiệm vụ lấy hàng được giao'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <PickingTaskCard
                key={task.id}
                task={task}
                onSelect={onSelectTask}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PickingTaskList;
