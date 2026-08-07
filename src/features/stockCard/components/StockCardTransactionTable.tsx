import React from 'react';
import { ClipboardList } from 'lucide-react';
import type { InventoryTransaction, TransactionType } from '../stockCardTypes';

interface StockCardTransactionTableProps {
  data: InventoryTransaction[];
  hasSelectedProduct: boolean;
}

const TYPE_CONFIG: Record<
  TransactionType,
  { label: string; badgeBg: string; badgeText: string; quantityClass: string; prefix: string }
> = {
  RECEIPT: {
    label: 'Receipt',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
    quantityClass: 'text-emerald-600 font-bold',
    prefix: '+',
  },
  ISSUE: {
    label: 'Issue',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700',
    quantityClass: 'text-red-600 font-bold',
    prefix: '-',
  },
  ADJUST: {
    label: 'Adjust',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
    quantityClass: 'text-amber-600 font-bold',
    prefix: '±',
  },
};

const formatDateTime = (iso: string): string => {
  try {
    const date = new Date(iso);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const heads = ['Type', 'Product', 'Location', 'Quantity', 'Reference', 'Date & Time'];

const StockCardTransactionTable: React.FC<StockCardTransactionTableProps> = ({
  data,
  hasSelectedProduct,
}) => {
  return (
    <table className="w-full border-collapse text-[13px]">
      <thead className="bg-[#f8fafc]">
        <tr>
          {heads.map((head) => (
            <th key={head} className="text-start p-3.75 text-wms-muted font-medium">
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={heads.length}>
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <ClipboardList size={26} className="text-wms-muted" />
                </div>
                <p className="text-[13px] font-semibold text-slate-500">
                  {hasSelectedProduct
                    ? 'No transactions found for this product.'
                    : 'Select a product above to view its stock card history.'}
                </p>
              </div>
            </td>
          </tr>
        ) : (
          data.map((tx) => {
            const cfg = TYPE_CONFIG[tx.transactionType];
            return (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                {/* Type badge */}
                <td className="py-4 px-3.75 border-b border-b-wms-border-color">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold ${cfg.badgeBg} ${cfg.badgeText}`}
                  >
                    {cfg.label}
                  </span>
                </td>

                {/* Product */}
                <td className="py-4 px-3.75 border-b border-b-wms-border-color">
                  <p className="font-medium text-wms-text-main">{tx.product.productName}</p>
                  <p className="text-[11px] text-wms-muted font-mono">{tx.product.productCode}</p>
                </td>

                {/* Location */}
                <td className="py-4 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                  {tx.location.description}
                </td>

                {/* Quantity */}
                <td className={`py-4 px-3.75 border-b border-b-wms-border-color ${cfg.quantityClass}`}>
                  {cfg.prefix}{tx.quantity}
                </td>

                {/* Reference */}
                <td className="py-4 px-3.75 border-b border-b-wms-border-color">
                  <span className="font-mono text-[12px] text-wms-primary bg-wms-primary/8 px-2 py-0.5 rounded">
                    {tx.referenceCode}
                  </span>
                </td>

                {/* Date */}
                <td className="py-4 px-3.75 border-b border-b-wms-border-color text-wms-muted text-[12px]">
                  {formatDateTime(tx.createdAt)}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default StockCardTransactionTable;
