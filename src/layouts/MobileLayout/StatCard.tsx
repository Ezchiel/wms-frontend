import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  tone?: 'default' | 'warning' | 'success';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, tone = 'default' }) => {
  const toneClasses = {
    default: {
      label: 'text-wms-muted',
      value: 'text-wms-text-main',
      border: 'border-wms-border-color bg-white',
    },
    warning: {
      label: 'text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full',
      value: 'text-amber-600',
      border: 'border-amber-100 bg-amber-50/50',
    },
    success: {
      label: 'text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full',
      value: 'text-emerald-600',
      border: 'border-emerald-100 bg-emerald-50/50',
    },
  };

  const classes = toneClasses[tone] || toneClasses.default;

  return (
    <div className={`relative h-24 p-3.5 border rounded-2xl shadow-xs text-center transition-all ${classes.border}`}>
      <span className={`text-[10px] font-bold uppercase tracking-wider inline-block ${classes.label}`}>
        {label}
      </span>
      <span className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-2xl font-black font-mono tracking-tight ${classes.value}`}>
        {value}
      </span>
    </div>
  );
};

export default StatCard;
