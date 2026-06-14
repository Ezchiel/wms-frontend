import React from 'react';
import type { ExpiringStock } from '../reportsTypes';
import { AlertCircle, Clock, ShieldCheck } from 'lucide-react';

interface ExpiringStockTableProps {
  data: ExpiringStock[];
  loading: boolean;
  withinDays: number;
  onWithinDaysChange: (days: number) => void;
}

export const ExpiringStockTable: React.FC<ExpiringStockTableProps> = ({
  data,
  loading,
  withinDays,
  onWithinDaysChange,
}) => {
  const getBadgeStyle = (days: number) => {
    if (days < 7) {
      return {
        bg: 'bg-red-50 text-red-700 border-red-200',
        text: 'Cận hạn cực độ',
        icon: <AlertCircle className="w-3.5 h-3.5 text-red-500" />,
      };
    }
    if (days < 30) {
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        text: 'Cảnh báo sắp hết hạn',
        icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,
      };
    }
    return {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      text: 'An toàn',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />,
    };
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Slider Filter Bar */}
      <div className="bg-white p-5 rounded-3xl shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5 w-full md:w-96">
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Thời gian cảnh báo hết hạn: <span className="text-wms-primary font-bold">{withinDays} ngày</span>
          </label>
          <input
            type="range"
            min="5"
            max="180"
            step="5"
            value={withinDays}
            onChange={(e) => onWithinDaysChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-wms-primary"
          />
        </div>

        <div className="flex gap-2">
          {[15, 30, 60, 90].map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => onWithinDaysChange(days)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                withinDays === days
                  ? 'bg-wms-primary text-white shadow-xs'
                  : 'bg-slate-50 text-gray-500 hover:bg-slate-100 hover:text-gray-800 border border-gray-200'
              }`}
            >
              {days} ngày
            </button>
          ))}
        </div>
      </div>

      {/* Grid Ledger Table */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.03)] relative min-h-[300px]">
        <h3 className="text-gray-755 text-sm font-bold mb-4">Cảnh báo hạn sử dụng các lô hàng</h3>

        {loading ? (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-3xl z-10">
            <div className="w-10 h-10 border-4 border-wms-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-150 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Mã SP</th>
                <th className="py-3 px-4">Tên sản phẩm</th>
                <th className="py-3 px-4">Số Lô (Batch No)</th>
                <th className="py-3 px-4">Vị trí kệ</th>
                <th className="py-3 px-4 text-center">Số lượng</th>
                <th className="py-3 px-4">Ngày hết hạn</th>
                <th className="py-3 px-4 text-center">Số ngày còn lại</th>
                <th className="py-3 px-4 text-center">Mức độ cảnh báo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {data.length > 0 ? (
                data.map((row, index) => {
                  const badge = getBadgeStyle(row.daysRemaining);
                  return (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-gray-750">{row.productCode}</td>
                      <td className="py-3.5 px-4 text-gray-650 font-semibold">{row.productName}</td>
                      <td className="py-3.5 px-4 font-mono text-gray-500">{row.batchNo || '---'}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-mono">
                          {row.locationBarcode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-750">
                        {row.quantity.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-gray-650 font-medium">
                        {new Date(row.expiryDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`font-bold ${row.daysRemaining < 7 ? 'text-red-650' : row.daysRemaining < 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {row.daysRemaining} ngày
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
                          {badge.icon}
                          {badge.text}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    Không có lô hàng nào hết hạn trong vòng {withinDays} ngày tới.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
