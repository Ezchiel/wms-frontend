import React from 'react';
import type { LowStockAlert } from '../dashboardTypes';

interface LowStockAlertTableProps {
  alerts: LowStockAlert[];
}

export const LowStockAlertTable: React.FC<LowStockAlertTableProps> = ({ alerts }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 text-sm font-semibold">Cảnh báo tồn kho dưới mức tối thiểu</h3>
        <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold">
          {alerts.length} cảnh báo
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-150 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Mã sản phẩm</th>
              <th className="py-3 px-4">Tên sản phẩm</th>
              <th className="py-3 px-4 text-center">Định mức tối thiểu</th>
              <th className="py-3 px-4 text-center">Tồn kho hiện tại</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {alerts.length > 0 ? (
              alerts.map((alert, index) => {
                const deficit = alert.minStockLevel - alert.currentTotalStock;
                return (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-gray-700">{alert.productCode}</td>
                    <td className="py-3 px-4 text-gray-600">{alert.productName}</td>
                    <td className="py-3 px-4 text-center text-gray-500 font-semibold">{alert.minStockLevel}</td>
                    <td className="py-3 px-4 text-center text-red-650 font-bold bg-red-50/30">{alert.currentTotalStock}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                        Thiếu {deficit} sản phẩm
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                  Không có cảnh báo tồn kho thấp. Hệ thống vận hành tốt!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
