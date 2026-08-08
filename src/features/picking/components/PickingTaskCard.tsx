import React from 'react';
import type { PickingTask } from '../pickingTypes';
import { MapPin, Box, FileText, ArrowRight } from 'lucide-react';

interface Props {
  task: PickingTask;
  onSelect: (task: PickingTask) => void;
}

export const PickingTaskCard: React.FC<Props> = ({ task, onSelect }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-teal-50 text-teal-700 border-teal-100';
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'DONE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'FAILED':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'IN_PROGRESS':
        return 'In progress';
      case 'DONE':
        return 'Done';
      case 'FAILED':
        return 'Failed';
      default:
        return status;
    }
  };

  const showStartBtn = task.status === 'PENDING' || task.status === 'IN_PROGRESS';

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-xs hover:border-blue-100 transition-colors">
      {/* Product Name & Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-black text-slate-800 leading-snug break-words">
            {task.productName}
          </h4>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{task.productCode}</p>
        </div>
        <span
          className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${getStatusBadge(
            task.status
          )}`}
        >
          {getStatusLabel(task.status)}
        </span>
      </div>

      {/* Info Rows */}
      <div className="grid grid-cols-2 gap-3 pt-1 text-[11px] text-slate-500 font-semibold">
        <div className="flex items-center gap-1.5 min-w-0">
          <FileText size={13} className="text-slate-400 shrink-0" />
          <span className="truncate">Issue: {task.issueCode}</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0 justify-end">
          <Box size={13} className="text-slate-400 shrink-0" />
          <span>Quantity: {task.pickedQuantity}/{task.requiredQuantity}</span>
        </div>
      </div>

      {/* Location Badge (Prominent) */}
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <MapPin size={14} />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide block leading-none">
              Location
            </span>
            <span className="text-xs font-black text-slate-700 font-mono block mt-0.5 leading-none">
              {task.locationBarcode}
            </span>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
          {task.locationDescription || 'No description'}
        </span>
      </div>

      {/* Action Button */}
      {showStartBtn && (
        <button
          onClick={() => onSelect(task)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl transition-all shadow-xs"
        >
          <span>{task.status === 'PENDING' ? 'Start Picking' : 'Continue Picking'}</span>
          <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
};

export default PickingTaskCard;
