import React from 'react';
import type { StockByGroup } from '../reportsTypes';

interface StockByGroupTableProps {
  data: StockByGroup[];
  loading: boolean;
}

export const StockByGroupTable: React.FC<StockByGroupTableProps> = ({ data, loading }) => {
  // Find maximum quantity to scale inline bars
  const maxQty = Math.max(...data.map((item) => item.totalQuantity || 0), 1);

  // Helper to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.03)] relative min-h-[300px]">
      <h3 className="text-gray-750 text-sm font-bold mb-4">Tồn kho theo nhóm sản phẩm</h3>

      {loading ? (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-3xl z-10">
          <div className="w-10 h-10 border-4 border-wms-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-150 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Mã nhóm</th>
              <th className="py-3 px-4">Tên nhóm sản phẩm</th>
              <th className="py-3 px-4 text-center">Tổng số lượng</th>
              <th className="py-3 px-4">Tỷ lệ phân phối số lượng</th>
              <th className="py-3 px-4 text-right">Tổng giá trị ước tính</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {data.length > 0 ? (
              data.map((item, index) => {
                const pct = ((item.totalQuantity || 0) / maxQty) * 100;
                return (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-gray-750">{item.groupCode}</td>
                    <td className="py-3.5 px-4 text-gray-650 font-semibold">{item.groupName}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-gray-800">
                      {item.totalQuantity.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 w-1/3 min-w-[150px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-wms-primary h-full rounded-full transition-all duration-550"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <span className="text-[11px] text-gray-400 font-semibold w-8 text-right">
                          {Math.round(pct)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-650 font-extrabold bg-emerald-50/20">
                      {formatCurrency(item.totalValue)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400">
                  Không có dữ liệu tồn kho theo nhóm sản phẩm.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
