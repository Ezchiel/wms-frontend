import React from 'react';
import { Boxes, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SummaryCardProps {
  totalStock: number | null;
  lowStockCount: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ totalStock, lowStockCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Stock Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/25 flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Total inventory</p>
          <h3 className="text-3xl font-extrabold mt-2 tracking-tight">
            {totalStock !== null ? totalStock.toLocaleString() : '---'}
          </h3>
          <p className="text-xs text-blue-200 mt-1">Units: Product</p>
        </div>
        <div className="p-4 bg-white/10 rounded-2xl">
          <Boxes className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* Low Stock Alerts Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg shadow-amber-500/25 flex items-center justify-between">
        <div>
          <p className="text-amber-100 text-sm font-medium uppercase tracking-wider">below minimum quantity</p>
          <h3 className="text-3xl font-extrabold mt-2 tracking-tight">
            {lowStockCount}
          </h3>
          <p className="text-xs text-amber-250 mt-1">Order more stock</p>
        </div>
        <div className="p-4 bg-white/10 rounded-2xl">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* Warehouse Status Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-between">
        <div>
          <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">Warehouse Status</p>
          <h3 className="text-3xl font-extrabold mt-2 tracking-tight">
            stable
          </h3>
          <p className="text-xs text-emerald-200 mt-1">All zones available</p>
        </div>
        <div className="p-4 bg-white/10 rounded-2xl">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
      </div>
    </div>
  );
};
