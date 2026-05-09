import type { InventoryReceipt } from '../../inventoryReceipt/inventoryReceiptTypes';
import EmptyState from './EmptyState';

interface ReceiptSelectorProps {
  receipts: InventoryReceipt[];
  selected: InventoryReceipt | null;
  onSelect: (r: InventoryReceipt) => void;
}

function ReceiptSelector({ receipts, selected, onSelect }: ReceiptSelectorProps) {
  const receivingReceipts = receipts.filter((r) => r.status === 'RECEIVING');

  if (receivingReceipts.length === 0) return <EmptyState />;

  return (
    <div className="px-5 pt-6 space-y-3 max-w-md mx-auto pb-8">
      <h2 className="text-[14px] font-bold text-wms-text-main mb-4">
        Chọn phiếu để kiểm đếm ({receivingReceipts.length})
      </h2>
      {receivingReceipts.map((receipt) => {
        const isActive = selected?.id === receipt.id;
        return (
          <button
            key={receipt.id}
            onClick={() => onSelect(receipt)}
            className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-[0.98] ${
              isActive
                ? 'bg-wms-primary/5 border-wms-primary shadow-[0_0_0_2px_rgba(59,130,246,0.2)]'
                : 'bg-white border-wms-border-color shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start mb-1.5">
              <span
                className={`font-bold text-[13px] ${isActive ? 'text-wms-primary' : 'text-wms-text-main'}`}
              >
                {receipt.receiptCode}
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-md">
                RECEIVING
              </span>
            </div>
            <p className="text-[12px] text-wms-muted font-medium">{receipt.supplierName}</p>
            <p className="text-[11px] text-wms-muted mt-1">
              {receipt.details?.length ?? 0} SKUs •{' '}
              {new Date(receipt.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default ReceiptSelector;
