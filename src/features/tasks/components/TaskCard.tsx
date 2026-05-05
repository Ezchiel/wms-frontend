import { Link } from 'react-router-dom';
import type { InventoryReceipt, ReceiptStatus } from '../../inventoryReceipt/inventoryReceiptTypes';

interface TaskProps {
  receipt: InventoryReceipt;
}

const TaskCard = ({ receipt }: TaskProps) => {
  const statusConfig: Record<ReceiptStatus, { label: ReceiptStatus; styles: string }> = {
    EXPECTED: { label: 'RECEIVING', styles: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    RECEIVING: { label: 'RECEIVING', styles: 'bg-blue-50 text-blue-600 border-blue-200' },
    PUTAWAY_PENDING: {
      label: 'PUTAWAY_PENDING',
      styles: 'bg-orange-50 text-orange-600 border-orange-200',
    },
  };

  // Status
  const currentStatus = statusConfig[receipt.status] || {
    label: receipt.status,
    styles: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  // CreatedAt
  const createdDate = new Date(receipt.createdAt);
  const timeString = createdDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const dateString = createdDate.toLocaleDateString('vi-VN');
  const displayTime = `${timeString} - ${dateString}`;

  // SKUs
  const skuCount = receipt.details?.length || 0;

  return (
    <div
      className={`bg-white rounded-2xl p-4.5 shadow-sm border border-wms-border-color flex flex-col gap-4.5 transition-all`}
    >
      {/* Header Card */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-wms-primary font-bold text-[13px] block mb-1">#{receipt.id}</span>
          <h3 className="font-bold text-wms-text-main text-[16px] leading-tight">
            {receipt.receiptCode}
          </h3>
        </div>
        <span
          className={`${currentStatus.styles} px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border`}
        >
          {currentStatus.label}
        </span>
      </div>

      {/* Supplier information */}
      <div className="flex items-center gap-2.5 text-[13px] text-wms-text-main font-medium -mt-1.25">
        <i className="fa-solid fa-truck-field text-wms-muted w-4 text-center"></i>
        <span className="truncate">{receipt.supplierName || 'Supplier unknown'}</span>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-y-3 py-3 border-y border-wms-border-color">
        <div className="flex items-center gap-3">
          <div className="min-w-8 w-8 h-8 rounded-full bg-wms-bg flex items-center justify-center text-wms-muted">
            <i className="fa-regular fa-clock text-[15px]"></i>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-wms-muted font-medium mb-0.5">Created at</span>
            <span className="text-[12px] font-semibold text-wms-text-main truncate">
              {displayTime}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="min-w-8 w-8 h-8 rounded-full bg-wms-bg flex items-center justify-center text-wms-muted">
            <i className="fa-solid fa-box-open text-[14px]"></i>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-wms-muted font-medium mb-0.5">SKU</span>
            <span className="text-[13px] font-semibold text-wms-text-main">{skuCount} SKUs</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {receipt.notes && (
        <div className="text-[12px] text-wms-muted italic px-1 line-clamp-1">
          *Ghi chú: {receipt.notes}
        </div>
      )}

      {/* Action Button */}
      <Link
        to="/mobile/count-and-label"
        className="w-full bg-wms-primary hover:bg-wms-primary-hover text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all shadow-sm mt-1"
      >
        <i className="fa-solid fa-qrcode text-[18px]"></i>
        Count and label now
      </Link>
    </div>
  );
};

export default TaskCard;
