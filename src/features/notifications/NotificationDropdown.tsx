import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from './useNotifications';
import type { NotificationSummary } from './notificationTypes';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { items, loading, error, refetch } = useNotifications();

  const handleItemClick = (item: NotificationSummary) => {
    if (item.type === 'LOW_STOCK') {
      navigate(`/inventory-stocks?productId=${item.referenceId}`);
    } else {
      navigate(`/inventory-stocks?stockId=${item.referenceId}`);
    }
    onClose();
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-50 border-red-100',
          text: 'text-red-700',
          iconBg: 'bg-red-100 text-red-600',
          badge: 'bg-red-500 text-white',
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-50/70 border-amber-100',
          text: 'text-amber-700',
          iconBg: 'bg-amber-100 text-amber-600',
          badge: 'bg-amber-500 text-white',
        };
      default:
        return {
          bg: 'bg-blue-50/50 border-blue-100',
          text: 'text-blue-700',
          iconBg: 'bg-blue-100 text-blue-600',
          badge: 'bg-blue-500 text-white',
        };
    }
  };

  const getIcon = (type: string) => {
    if (type === 'LOW_STOCK') {
      return 'fa-solid fa-triangle-exclamation';
    }
    return 'fa-solid fa-hourglass-half';
  };

  return (
    <div className="absolute right-0 mt-3.5 w-96 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-[fadeIn_0.15s_ease-out]">
      {/* --- HEADER --- */}
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[15px] text-gray-800">Notifications</span>
          {items.length > 0 && (
            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">
              {items.length}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            refetch();
          }}
          className="text-gray-400 hover:text-wms-primary transition-colors cursor-pointer text-xs flex items-center gap-1"
          title="Refresh"
        >
          <i className="fa-solid fa-rotate-right"></i>
          <span>Refresh</span>
        </button>
      </div>

      {/* --- BODY --- */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-100">
        {loading && items.length === 0 ? (
          // Skeleton loading
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="p-4 flex gap-3.5 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-gray-200 shrink-0"></div>
              <div className="flex-1 space-y-2 py-0.5">
                <div className="h-3.5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-2.5 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <i className="fa-solid fa-triangle-exclamation text-2xl mb-2"></i>
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 px-6 text-center text-gray-400">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <i className="fa-regular fa-bell-slash text-lg"></i>
            </div>
            <p className="font-semibold text-gray-700 text-sm">No notifications</p>
            <p className="text-[12px] text-gray-400 mt-0.5">Inventory and expiration dates are in a safe state.</p>
          </div>
        ) : (
          items.map((item, idx) => {
            const styles = getSeverityStyles(item.severity);
            return (
              <div
                key={idx}
                onClick={() => handleItemClick(item)}
                className={`p-4 flex gap-3.5 hover:bg-gray-50/70 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg}`}>
                  <i className={`${getIcon(item.type)} text-[14px]`}></i>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-[13.5px] text-gray-800 leading-tight">
                      {item.title}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${styles.bg} ${styles.text} border`}>
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-gray-500 text-[12.5px] leading-relaxed">
                    {item.message}
                  </p>
                  {item.daysRemaining !== null && item.daysRemaining !== undefined && (
                    <span className="inline-block text-[11px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-md mt-1 border border-amber-100">
                      {item.daysRemaining} days remaining
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- FOOTER --- */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/30 text-center">
        <span className="text-[11px] text-gray-400 font-medium">
          <i className="fa-solid fa-shield-halved mr-1"></i>
          Automatic Inventory Monitoring System
        </span>
      </div>
    </div>
  );
};

export default NotificationDropdown;
