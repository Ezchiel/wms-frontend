import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────

interface TrendProps {
  value: number;       // positive → green, negative → red, 0 → neutral
  label?: string;      // e.g. "vs yesterday"
}

/** A single metric inside MultiStatCard */
export interface StatItem {
  label: string;
  value: string | number;
  trend?: TrendProps;
}

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────

const TrendBadge: React.FC<{ trend: TrendProps }> = ({ trend }) => {
  const isUp = trend.value > 0;
  const isDown = trend.value < 0;
  const color = isUp
    ? 'text-emerald-600'
    : isDown
    ? 'text-red-500'
    : 'text-gray-400';
  const prefix = isUp ? '+' : '';

  return (
    <p className={`text-[11px] font-medium mt-0.5 ${color}`}>
      {prefix}{trend.value} {trend.label ?? 'vs yesterday'}
    </p>
  );
};

// ─────────────────────────────────────────────
//  MultiStatCard  (matches the "Approval Status" card in the design)
// ─────────────────────────────────────────────

interface MultiStatCardProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  stats: StatItem[];
  onMenuClick?: () => void;
}

export const MultiStatCard: React.FC<MultiStatCardProps> = ({
  title,
  icon: Icon,
  iconColor = 'text-blue-600',
  stats,
  onMenuClick,
}) => {
  return (
    <div className="bg-white border border-wms-border-color rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <Icon className={`w-4 h-4 ${iconColor}`} />
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

      {/* Stat columns */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
      >
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-[11px] text-wms-muted font-medium mb-1 uppercase tracking-wide">
              {s.label}
            </p>
            <p className="text-2xl font-extrabold text-wms-text-main leading-none">
              {s.value}
            </p>
            {s.trend && <TrendBadge trend={s.trend} />}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  StatCard  – single-metric card (backward-compatible)
//  Redesigned to match the same header style as MultiStatCard
// ─────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trendValue?: number;
  trendLabel?: string;
  hint?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-50',
  trendValue,
  trendLabel = 'vs yesterday',
  hint,
}) => {
  const hasTrend = trendValue !== undefined && trendValue !== null;

  return (
    <div className="bg-white border border-wms-border-color rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <span className="text-[13px] font-semibold text-wms-text-main">{label}</span>
        </div>
        <MoreHorizontal className="w-4 h-4 text-wms-muted" />
      </div>

      {/* Value */}
      <p className="text-3xl font-extrabold text-wms-text-main tracking-tight leading-none mb-2">
        {value}
      </p>

      {/* Trend or hint */}
      {hasTrend ? (
        <TrendBadge trend={{ value: trendValue!, label: trendLabel }} />
      ) : hint ? (
        <p className="text-[11px] text-wms-muted">{hint}</p>
      ) : null}
    </div>
  );
};
