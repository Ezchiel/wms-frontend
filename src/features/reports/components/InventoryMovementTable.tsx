import React from 'react';
import { DateRangePicker } from './DateRangePicker';
import type { InventoryMovement } from '../reportsTypes';
import type { Product } from '../../products/productTypes';
import type { ProductGroup } from '../../productGroups/productGroupTypes';

interface InventoryMovementTableProps {
  data: InventoryMovement[];
  loading: boolean;
  products: Product[];
  productGroups: ProductGroup[];
  filters: {
    from: string;
    to: string;
    productId?: number;
    groupId?: number;
  };
  onFiltersChange: (newFilters: filters) => void;
}

type filters = {
  from: string;
  to: string;
  productId?: number;
  groupId?: number;
};

export const InventoryMovementTable: React.FC<InventoryMovementTableProps> = ({
  data,
  loading,
  products,
  productGroups,
  filters,
  onFiltersChange,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
        <div className="flex flex-wrap items-center gap-4">
          <DateRangePicker
            from={filters.from}
            to={filters.to}
            onChange={(from, to) => onFiltersChange({ ...filters, from, to })}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Product Selector */}
          <div className="w-56">
            <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">
              By product
            </label>
            <select
              value={filters.productId || ''}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                onFiltersChange({
                  ...filters,
                  productId: val,
                  groupId: undefined,
                });
              }}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-medium text-gray-750 focus:outline-none focus:border-wms-primary transition-all cursor-pointer"
            >
              <option value="">All products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.productName}
                </option>
              ))}
            </select>
          </div>

          {/* Group Selector */}
          <div className="w-56">
            <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">
              Or by group
            </label>
            <select
              value={filters.groupId || ''}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                onFiltersChange({
                  ...filters,
                  groupId: val,
                  productId: undefined,
                });
              }}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-medium text-gray-750 focus:outline-none focus:border-wms-primary transition-all cursor-pointer"
            >
              <option value="">All groups</option>
              {productGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.groupName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid Ledger Table */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.03)] relative min-h-[300px]">
        <h3 className="text-gray-755 text-sm font-bold mb-4">Stock movement (Receipt - Issue - Balance)</h3>

        {loading ? (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-3xl z-10">
            <div className="w-10 h-10 border-4 border-wms-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-150 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Product code</th>
                <th className="py-3 px-4">Product name</th>
                <th className="py-3 px-4 text-center">Opening stock</th>
                <th className="py-3 px-4 text-center">Total receipt (+)</th>
                <th className="py-3 px-4 text-center">Total issue (-)</th>
                <th className="py-3 px-4 text-center">Adjustment (+/-)</th>
                <th className="py-3 px-4 text-center font-bold text-slate-800">Closing stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-gray-700">{row.productCode}</td>
                    <td className="py-3 px-4 text-gray-600 font-semibold">{row.productName}</td>
                    <td className="py-3 px-4 text-center text-gray-500 font-semibold">
                      {row.openingStock.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center text-emerald-650 font-bold bg-emerald-50/20">
                      <span className="inline-flex items-center gap-0.5">
                        {row.totalReceipt.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-red-650 font-bold bg-red-50/20">
                      <span className="inline-flex items-center gap-0.5">
                        {row.totalIssue.toLocaleString()}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-center font-semibold ${row.totalAdjust > 0
                      ? 'text-blue-600 bg-blue-50/10'
                      : row.totalAdjust < 0
                        ? 'text-amber-600 bg-amber-50/10'
                        : 'text-gray-400'
                      }`}>
                      {row.totalAdjust > 0 ? `+${row.totalAdjust}` : row.totalAdjust}
                    </td>
                    <td className="py-3 px-4 text-center font-extrabold text-slate-800 bg-slate-50/40">
                      {row.closingStock.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No stock movement data found for this period.
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
