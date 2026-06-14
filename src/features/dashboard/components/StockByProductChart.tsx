import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { ChartData } from '../dashboardTypes';

interface StockByProductChartProps {
  data: ChartData[];
}

export const StockByProductChart: React.FC<StockByProductChartProps> = ({ data }) => {
  // Take top 10 products
  const chartData = [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.03)] h-[320px] flex flex-col justify-between">
      <h3 className="text-gray-700 text-sm font-semibold mb-2">Top 10 sản phẩm tồn kho nhiều nhất</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
            <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} />
            <YAxis
              dataKey="label"
              type="category"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              width={90}
              tickFormatter={(value) =>
                value.length > 12 ? `${value.substring(0, 12)}...` : value
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e2436',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: any) => [`${value?.toLocaleString()} sản phẩm`]}
            />
            <Bar
              dataKey="value"
              fill="#3b82f6"
              radius={[0, 8, 8, 0]}
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
