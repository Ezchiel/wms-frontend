import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { MoreHorizontal, Users } from 'lucide-react';

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────

export interface BarListItem {
  label: string;
  value: number;
  /** Optional icon to show beside the value (defaults to Users) */
  icon?: LucideIcon;
  /** Override bar color (Tailwind bg class, e.g. "bg-blue-500") */
  barColor?: string;
}

interface BarListCardProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  items: BarListItem[];
  onMenuClick?: () => void;
}

// ─────────────────────────────────────────────
//  BarListCard  (matches the "Time Off Request Type" card in the design)
// ─────────────────────────────────────────────

export const BarListCard: React.FC<BarListCardProps> = ({
  title,
  icon: TitleIcon,
  iconColor = 'text-blue-600',
  items,
  onMenuClick,
}) => {
  const maxValue = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="bg-white border border-wms-border-color rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <TitleIcon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <span className="text-[13px] font-semibold text-wms-text-main">{title}</span>
        </div>
        <button
          onClick={onMenuClick}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-wms-muted"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Bar list rows */}
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const ItemIcon = item.icon ?? Users;
          const pct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const barColor = item.barColor ?? 'bg-blue-500';

          return (
            <div key={item.label} className="flex items-center gap-3">
              {/* Label */}
              <span className="text-[12px] text-wms-text-main w-32 flex-shrink-0 truncate">
                {item.label}
              </span>

              {/* Bar */}
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Count + Icon */}
              <div className="flex items-center gap-1 w-10 justify-end flex-shrink-0">
                <ItemIcon className="w-3.5 h-3.5 text-wms-muted" />
                <span className="text-[12px] font-semibold text-wms-text-main">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
