import { useState } from 'react';
import { Check, PackageOpen, ChevronDown, Minus, Plus, Tag, AlertTriangle, Loader2, RotateCw, QrCode } from 'lucide-react';
import type { InventoryReceiptDetail } from '../../inventoryReceipt/inventoryReceiptTypes';
import type { ItemState } from '../countingAndLabelingTypes';
import ProgressBar from './ProgressBar';

interface ItemCardProps {
  detail: InventoryReceiptDetail;
  state: ItemState;
  onQtyChange: (delta: number) => void;
  onFieldChange: (field: 'batchNo' | 'expiryDate' | 'serialNumber', value: string) => void;
  onPrint: () => void;
  receiptStatus: string;
}

function ItemCard({
  detail,
  state,
  onQtyChange,
  onFieldChange,
  onPrint,
  receiptStatus,
}: ItemCardProps) {
  const [expanded, setExpanded] = useState(!state.isPrinted);
  const isComplete = state.countedQty >= detail.quantity;
  const isLocked = state.isPrinted || receiptStatus !== 'RECEIVING';

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${state.isPrinted
        ? 'border-green-200'
        : isComplete
          ? 'border-wms-primary/40'
          : 'border-wms-border-color'
        }`}
    >
      {/* ── Card Header ── */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-start gap-3 p-4 text-left active:bg-gray-50 transition-colors cursor-pointer"
      >
        {/* Status dot */}
        <div
          className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${state.isPrinted
            ? 'bg-green-100 text-green-600'
            : isComplete
              ? 'bg-wms-primary/10 text-wms-primary'
              : 'bg-wms-bg text-wms-muted'
            }`}
        >
          {state.isPrinted ? (
            <Check className="w-[14px] h-[14px]" />
          ) : isComplete ? (
            <Check className="w-[14px] h-[14px]" />
          ) : (
            <PackageOpen className="w-[14px] h-[14px]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-[13px] font-bold text-wms-text-main leading-snug line-clamp-2 flex-1">
              {detail.productName}
            </h4>
            <div className="flex items-center gap-1.5 shrink-0">
              {state.isPrinted && (
                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded-md">
                  Printed
                </span>
              )}
              <ChevronDown
                className={`w-[11px] h-[11px] text-wms-muted transition-transform duration-300 ${expanded ? 'rotate-180' : ''
                  }`}
              />
            </div>
          </div>

          <p className="text-[11px] text-wms-muted font-medium mt-1">SKU: {detail.productCode}</p>

          {/* Mini progress */}
          <div className="mt-2">
            <ProgressBar value={state.countedQty} total={detail.quantity} />
          </div>
        </div>
      </button>

      {/* ── Expanded Body ── */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-wms-border-color/60">
          {/* Qty summary */}
          <div className="mt-3 bg-wms-bg rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase font-bold text-wms-muted mb-0.5">Need to Count</p>
              <p className="text-[16px] font-bold text-wms-text-main">
                {detail.quantity}{' '}
                <span className="text-[12px] font-medium text-wms-muted">Unit</span>
              </p>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onQtyChange(-1)}
                disabled={isLocked || state.countedQty <= 0}
                className="w-9 h-9 rounded-xl bg-white border border-wms-border-color flex items-center justify-center active:scale-90 disabled:opacity-40 transition-all shadow-sm cursor-pointer"
              >
                <Minus className="w-[12px] h-[12px] text-wms-text-main" />
              </button>

              <div className="w-16">
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  disabled={isLocked}
                  max={detail.quantity}
                  value={state.countedQty === 0 ? '' : state.countedQty}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10) || 0;

                    // Check max
                    if (val > detail.quantity) {
                      val = detail.quantity;
                    }

                    const delta = val - state.countedQty;
                    onQtyChange(delta);
                  }}
                  className={`w-full text-center bg-transparent border-none p-0 text-[20px] font-black outline-none focus:ring-0 transition-colors ${state.countedQty >= detail.quantity
                    ? 'text-green-600'
                    : state.countedQty > 0
                      ? 'text-wms-primary'
                      : 'text-wms-muted'
                    }`}
                />
              </div>

              <button
                onClick={() => onQtyChange(1)}
                disabled={isLocked || state.countedQty >= detail.quantity}
                className="w-9 h-9 rounded-xl bg-white border border-wms-border-color flex items-center justify-center active:scale-90 disabled:opacity-40 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-[12px] h-[12px] text-wms-text-main" />
              </button>
            </div>
          </div>

          {/* Optional fields */}
          <div className="space-y-2.5">
            <div>
              <label className="text-[11px] font-bold uppercase text-wms-muted mb-1.5 block">
                Batch No
              </label>
              <input
                type="text"
                disabled={isLocked}
                placeholder="VD: BN-2025-001"
                value={state.batchNo}
                onChange={(e) => onFieldChange('batchNo', e.target.value)}
                className="w-full py-2.5 px-3 border border-wms-border-color rounded-xl text-[13px] text-wms-text-main placeholder:text-wms-muted outline-none focus:border-wms-primary transition-colors disabled:bg-gray-50 disabled:text-wms-muted"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold uppercase text-wms-muted mb-1.5 block">
                  EXP
                </label>
                <input
                  type="date"
                  disabled={isLocked}
                  value={state.expiryDate}
                  onChange={(e) => onFieldChange('expiryDate', e.target.value)}
                  className="w-full py-2.5 px-3 border border-wms-border-color rounded-xl text-[12px] text-wms-text-main outline-none focus:border-wms-primary transition-colors disabled:bg-gray-50 disabled:text-wms-muted"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-wms-muted mb-1.5 block">
                  Serial No
                </label>
                <input
                  type="text"
                  disabled={isLocked}
                  placeholder="S/N"
                  value={state.serialNumber}
                  onChange={(e) => onFieldChange('serialNumber', e.target.value)}
                  className="w-full py-2.5 px-3 border border-wms-border-color rounded-xl text-[12px] text-wms-text-main placeholder:text-wms-muted outline-none focus:border-wms-primary transition-colors disabled:bg-gray-50 disabled:text-wms-muted"
                />
              </div>
            </div>
          </div>

          {/* LPN success badge */}
          {state.lpnCode && (
            <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-xl">
              <Tag className="text-green-600 w-[14px] h-[14px]" />
              <div className="flex-1">
                <p className="text-[11px] text-green-600 font-bold">LPN Code</p>
                <p className="text-[12px] font-black text-green-700">{state.lpnCode}</p>
              </div>
            </div>
          )}

          {/* Error */}
          {state.error && (
            <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="text-red-500 w-[13px] h-[13px] mt-0.5" />
              <p className="text-[12px] text-red-600">{state.error}</p>
            </div>
          )}

          {/* Action button */}
          {receiptStatus === 'RECEIVING' && (
            <button
              onClick={onPrint}
              disabled={state.isSubmitting || state.countedQty <= 0}
              className={`w-full py-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm disabled:opacity-50 cursor-pointer ${state.isPrinted
                ? 'bg-white border border-wms-border-color text-wms-text-main'
                : 'bg-wms-primary text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)]'
                }`}
            >
              {state.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-[16px] h-[16px]" />
                  Processing...
                </>
              ) : state.isPrinted ? (
                <>
                  <RotateCw className="w-[15px] h-[15px]" />
                  Print Again
                </>
              ) : (
                <>
                  <QrCode className="w-[16px] h-[16px]" />
                  Create LPN & Print
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ItemCard;
