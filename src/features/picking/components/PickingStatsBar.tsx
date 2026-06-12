import React from 'react';
import type { PickingTask } from '../pickingTypes';
import { ClipboardList, Hourglass, Play, CheckCircle } from 'lucide-react';

interface Props {
  tasks: PickingTask[];
}

export const PickingStatsBar: React.FC<Props> = ({ tasks }) => {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'PENDING').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const done = tasks.filter((t) => t.status === 'DONE').length;

  return (
    <div className="grid grid-cols-4 gap-2 w-full">
      <div className="bg-white rounded-2xl p-3 border border-slate-100 flex flex-col items-center justify-center text-center shadow-xs">
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 mb-1">
          <ClipboardList size={16} />
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tổng</span>
        <span className="text-sm font-black text-slate-800 mt-0.5">{total}</span>
      </div>

      <div className="bg-white rounded-2xl p-3 border border-slate-100 flex flex-col items-center justify-center text-center shadow-xs">
        <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-1">
          <Hourglass size={16} className="animate-pulse" />
        </div>
        <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">Chờ</span>
        <span className="text-sm font-black text-teal-800 mt-0.5">{pending}</span>
      </div>

      <div className="bg-white rounded-2xl p-3 border border-slate-100 flex flex-col items-center justify-center text-center shadow-xs">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
          <Play size={16} />
        </div>
        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Đang lấy</span>
        <span className="text-sm font-black text-blue-800 mt-0.5">{inProgress}</span>
      </div>

      <div className="bg-white rounded-2xl p-3 border border-slate-100 flex flex-col items-center justify-center text-center shadow-xs">
        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-1">
          <CheckCircle size={16} />
        </div>
        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Xong</span>
        <span className="text-sm font-black text-emerald-800 mt-0.5">{done}</span>
      </div>
    </div>
  );
};

export default PickingStatsBar;
