import React from 'react';

interface StatusBadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ text, variant }) => {
  const getBadgeClasses = () => {
    let activeVariant = variant;
    if (!activeVariant) {
      const normalized = text.toUpperCase();
      if (normalized === 'ACTIVE' || normalized === 'SUCCESS' || normalized === 'OK') {
        activeVariant = 'success';
      } else if (normalized === 'LOCKED' || normalized === 'WARNING' || normalized === 'CUSTOMER') {
        activeVariant = 'warning';
      } else if (normalized === 'INACTIVE' || normalized === 'DELETED' || normalized === 'DANGER' || normalized === 'ERROR') {
        activeVariant = 'danger';
      } else if (normalized === 'SUPPLIER' || normalized === 'INFO') {
        activeVariant = 'info';
      } else {
        activeVariant = 'neutral';
      }
    }

    switch (activeVariant) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'warning':
        return 'bg-amber-100 text-amber-700';
      case 'danger':
        return 'bg-red-100 text-red-700';
      case 'info':
        return 'bg-blue-100 text-blue-700';
      case 'neutral':
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${getBadgeClasses()}`}
    >
      {text}
    </span>
  );
};
