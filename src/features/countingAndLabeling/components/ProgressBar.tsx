interface ProgressBarProps {
  value: number;
  total: number;
}

function ProgressBar({ value, total }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((value / total) * 100));

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-wms-border-color rounded-full overflow-hidden">
        <div
          className="h-full bg-wms-primary rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] font-bold text-wms-primary shrink-0">{pct}%</span>
    </div>
  );
}

export default ProgressBar;
