import React from 'react';
import { ArrowDownToLine, ArrowUpFromLine, SlidersHorizontal } from 'lucide-react';
import type { InventoryTransaction, TransactionType } from '../stockCardTypes';

interface TransactionTimelineItemProps {
  transaction: InventoryTransaction;
  isLast: boolean;
}

const TYPE_CONFIG: Record<
  TransactionType,
  {
    label: string;
    icon: React.ReactNode;
    badgeBg: string;
    badgeText: string;
    dotBg: string;
    quantityClass: string;
    prefix: string;
  }
> = {
  RECEIPT: {
    label: 'Nhập kho',
    icon: <ArrowDownToLine size={14} />,
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
    dotBg: 'bg-emerald-500',
    quantityClass: 'text-emerald-600',
    prefix: '+',
  },
  ISSUE: {
    label: 'Xuất kho',
    icon: <ArrowUpFromLine size={14} />,
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700',
    dotBg: 'bg-red-500',
    quantityClass: 'text-red-600',
    prefix: '-',
  },
  ADJUST: {
    label: 'Điều chỉnh',
    icon: <SlidersHorizontal size={14} />,
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
    dotBg: 'bg-amber-500',
    quantityClass: 'text-amber-600',
    prefix: '±',
  },
};

const formatDateTime = (iso: string): string => {
  try {
    const date = new Date(iso);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const TransactionTimelineItem: React.FC<TransactionTimelineItemProps> = ({
  transaction: tx,
  isLast,
}) => {
  const cfg = TYPE_CONFIG[tx.transactionType];

  return (
    <div className="flex gap-3">
      {/* Timeline stem */}
      <div className="flex flex-col items-center shrink-0 pt-1">
        <div className={`w-3 h-3 rounded-full ${cfg.dotBg} shrink-0`} />
        {!isLast && <div className="w-px flex-1 bg-wms-border-color mt-1" />}
      </div>

      {/* Card */}
      <div className={`flex-1 bg-white border border-wms-border-color rounded-2xl p-4 space-y-3 ${isLast ? '' : 'mb-3'}`}>
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${cfg.badgeBg} ${cfg.badgeText}`}
          >
            {cfg.icon}
            {cfg.label}
          </span>
          <span className="text-[10px] text-wms-muted font-medium">
            {formatDateTime(tx.createdAt)}
          </span>
        </div>

        {/* Quantity + Reference */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-wms-muted uppercase font-extrabold tracking-wide block">
              Qty
            </span>
            <span className={`text-lg font-black ${cfg.quantityClass}`}>
              {cfg.prefix}{tx.quantity}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-wms-muted uppercase font-extrabold tracking-wide block">
              Reference
            </span>
            <span className="text-xs font-mono font-bold text-wms-primary bg-wms-primary/8 px-2 py-0.5 rounded">
              {tx.referenceCode}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 pt-0.5 border-t border-wms-border-color">
          <span className="text-[10px] text-wms-muted uppercase font-extrabold tracking-wide">
            Location:
          </span>
          <span className="text-[11px] text-wms-text-main font-semibold">
            {tx.location.description}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionTimelineItem;
