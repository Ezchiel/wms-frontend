import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DateRangePicker } from './DateRangePicker';
import type { StockTrendPoint } from '../reportsTypes';
import type { Product } from '../../products/productTypes';

interface StockTrendChartProps {
  data: StockTrendPoint[];
  loading: boolean;
  products: Product[];
  filters: {
    from: string;
    to: string;
    groupBy: 'day' | 'week' | 'month';
    productId?: number;
  };
  onFiltersChange: (newFilters: trendFilters) => void;
}

type trendFilters = {
  from: string;
  to: string;
  groupBy: 'day' | 'week' | 'month';
  productId?: number;
};

export const StockTrendChart: React.FC<StockTrendChartProps> = ({
  data,
  loading,
  products,
  filters,
  onFiltersChange,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date Picker */}
          <DateRangePicker
            from={filters.from}
            to={filters.to}
            onChange={(from, to) => onFiltersChange({ ...filters, from, to })}
          />

          {/* Granularity */}
          <div className="flex items-center gap-1 bg-slate-50 border border-gray-200 p-1 rounded-2xl">
            {(['day', 'week', 'month'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onFiltersChange({ ...filters, groupBy: g })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${filters.groupBy === g
                  ? 'bg-wms-primary text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                {g === 'day' ? 'Day' : g === 'week' ? 'Week' : 'Month'}
              </button>
            ))}
          </div>
        </div>

        {/* Product Dropdown */}
        <div className="w-64">
          <select
            value={filters.productId || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                productId: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-gray-750 focus:outline-none focus:border-wms-primary transition-all cursor-pointer"
          >
            <option value="">All products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.productName} ({p.productCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart container */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.03)] h-[400px] flex flex-col justify-between relative">
        {loading ? (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-3xl z-10">
            <div className="w-10 h-10 border-4 border-wms-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : null}

        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e2436',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [`${value?.toLocaleString()} sản phẩm`, 'Tổng số lượng']}
              />
              <Line
                type="monotone"
                dataKey="totalQuantity"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
