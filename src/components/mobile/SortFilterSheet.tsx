import React, { useState, useEffect } from 'react';
import { X, Check, Calendar } from 'lucide-react';

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  type: 'chip' | 'dateRange';
  options?: { value: string; label: string }[];
}

export interface SortFilterValue {
  sort: string;
  filters: Record<string, string>;
}

interface SortFilterSheetProps {
  open: boolean;
  sortOptions: SortOption[];
  filterGroups: FilterGroup[];
  value: any;
  onApply: (v: any) => void;
  onClose: () => void;
}

const SortFilterSheet: React.FC<SortFilterSheetProps> = ({
  open,
  sortOptions,
  filterGroups,
  value,
  onApply,
  onClose,
}) => {
  const [localSort, setLocalSort] = useState(value.sort);
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(value.filters);

  // Sync state when open changes
  useEffect(() => {
    if (open) {
      setLocalSort(value.sort);
      setLocalFilters(value.filters);
    }
  }, [open, value]);

  if (!open) return null;

  const handleChipClick = (key: string, optionValue: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: optionValue,
    }));
  };

  const handleDateChange = (key: string, dateVal: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: dateVal,
    }));
  };

  const handleReset = () => {
    setLocalSort(sortOptions[0]?.value || '');
    const resetFilters: Record<string, string> = {};
    filterGroups.forEach((group) => {
      if (group.type === 'chip' && group.options && group.options.length > 0) {
        resetFilters[group.key] = group.options[0].value;
      } else {
        resetFilters[group.key] = '';
      }
    });
    setLocalFilters(resetFilters);
  };

  const handleApplyClick = () => {
    onApply({
      sort: localSort,
      filters: localFilters,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity duration-300 cursor-pointer"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl z-50 shadow-2xl transition-transform duration-300 transform translate-y-0 border-t border-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-base font-bold text-slate-800">Sort & Filter</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-6 overflow-y-auto flex-1 no-scrollbar pb-10">
          {/* Sort Section */}
          {sortOptions.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sort by</h3>
              <div className="grid grid-cols-2 gap-2">
                {sortOptions.map((opt) => {
                  const isSelected = localSort === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setLocalSort(opt.value)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer border ${isSelected
                        ? 'bg-wms-primary/10 border-wms-primary text-wms-primary'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100/70'
                        }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && <Check size={14} className="shrink-0 text-wms-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filter Groups */}
          {filterGroups.map((group) => (
            <div key={group.key} className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{group.label}</h3>

              {group.type === 'chip' && group.options && (
                <div className="flex flex-wrap gap-2">
                  {group.options.map((opt) => {
                    const isSelected = localFilters[group.key] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleChipClick(group.key, opt.value)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border cursor-pointer ${isSelected
                          ? 'bg-wms-primary border-wms-primary text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {group.type === 'dateRange' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Calendar size={13} />
                    </span>
                    <input
                      type="date"
                      value={localFilters[`${group.key}From`] || ''}
                      onChange={(e) => handleDateChange(`${group.key}From`, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-wms-primary/20 placeholder-slate-400"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Calendar size={13} />
                    </span>
                    <input
                      type="date"
                      value={localFilters[`${group.key}To`] || ''}
                      onChange={(e) => handleDateChange(`${group.key}To`, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-wms-primary/20 placeholder-slate-400"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="px-5 pt-4 pb-8 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md rounded-b-3xl flex items-center gap-3 shrink-0">
          <button
            onClick={handleReset}
            className="flex-1 py-3 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer bg-white"
          >
            Reset
          </button>
          <button
            onClick={handleApplyClick}
            className="flex-2 py-3 bg-wms-primary hover:bg-wms-primary-hover text-white font-bold text-xs rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-md shadow-blue-100"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

export default SortFilterSheet;
