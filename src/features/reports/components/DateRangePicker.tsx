import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ from, to, onChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-slate-50 border border-gray-200 p-3 rounded-2xl">
      <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
        <Calendar className="w-4 h-4 text-wms-muted" />
        Khoảng thời gian
      </div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={from}
          onChange={(e) => onChange(e.target.value, to)}
          className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-medium text-gray-750 focus:outline-none focus:border-wms-primary transition-all"
        />
        <span className="text-gray-400 text-xs">đến</span>
        <input
          type="date"
          value={to}
          onChange={(e) => onChange(from, e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-medium text-gray-750 focus:outline-none focus:border-wms-primary transition-all"
        />
      </div>
    </div>
  );
};
