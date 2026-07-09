import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import type { LocationUtilization } from '../reportsTypes';

interface LocationUtilizationChartProps {
  data: LocationUtilization[];
  loading: boolean;
}

export const LocationUtilizationChart: React.FC<LocationUtilizationChartProps> = ({
  data,
  loading,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Zone summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((zoneData, idx) => {
          const rate = zoneData.utilizationRate;
          const circleColor =
            rate >= 95 ? '#ef4444' : rate >= 70 ? '#f59e0b' : '#10b981';

          return (
            <div key={idx} className="bg-white rounded-2xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Zone: {zoneData.zone}</p>
                <h4 className="text-lg font-bold text-gray-700 mt-1">
                  {rate.toFixed(1)}%
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {zoneData.totalQuantity.toLocaleString()} / {zoneData.totalCapacity > 0 ? zoneData.totalCapacity.toLocaleString() : '∞'} units
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {zoneData.fullLocations} full · {zoneData.emptyLocations} empty · {zoneData.totalLocations} total shelves
                </p>
              </div>
              <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="24" cy="24" r="20" className="stroke-gray-100" strokeWidth="4" fill="transparent" />
                  <circle
                    cx="24" cy="24" r="20"
                    stroke={circleColor}
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={125.6}
                    strokeDashoffset={125.6 - (125.6 * Math.min(rate, 100)) / 100}
                    className="transition-all duration-500"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold" style={{ color: circleColor }}>
                  {Math.round(rate)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.03)] h-[380px] flex flex-col justify-between relative">
        <h3 className="text-gray-750 text-sm font-bold mb-4">Zone capacity utilization (units)</h3>

        {loading ? (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-3xl z-10">
            <div className="w-10 h-10 border-4 border-wms-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : null}

        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="zone" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e2436',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(value: number, name: string) => [
                  value?.toLocaleString(),
                  name,
                ]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              <Bar
                name="Current stock (units)"
                dataKey="totalQuantity"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={16}
              />
              <Bar
                name="Total capacity (units)"
                dataKey="totalCapacity"
                fill="#e2e8f0"
                radius={[4, 4, 0, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
