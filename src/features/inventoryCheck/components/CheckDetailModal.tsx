import React from 'react';
import type { InventoryCheck } from '../inventoryCheckTypes';

interface Props {
  isOpen: boolean;
  check: InventoryCheck | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

const CheckDetailModal: React.FC<Props> = ({ isOpen, check, onClose, onConfirm }) => {
  if (!isOpen || !check) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg flex flex-col overflow-hidden max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-solid border-wms-border-color sticky top-0 bg-white z-10">
          <h2 className="text-[16px] font-semibold text-wms-text-main">
            Check Detail: <span className="text-wms-primary">{check.checkCode}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-wms-muted hover:text-red-500 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 text-[13px]">

          {/* General Info */}
          <div className="grid grid-cols-2 gap-5 mb-6 bg-gray-50 p-4 rounded-lg border border-wms-border-color">
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-medium text-wms-muted">Check Code:</span>{' '}
                {check.checkCode}
              </p>
              <p>
                <span className="font-medium text-wms-muted">Created At:</span>{' '}
                {new Date(check.checkDate).toLocaleString('vi-VN')}
              </p>
              <p>
                <span className="font-medium text-wms-muted">Created By:</span>{' '}
                {check.createdBy}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-medium text-wms-muted">Status:</span>
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-[11px] font-semibold ${check.status === 'COMPLETED'
                      ? 'bg-blue-100 text-blue-700'
                      : check.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  {check.status}
                </span>
              </p>
              <p>
                <span className="font-medium text-wms-muted">Total Lines:</span>{' '}
                {check.details.length}
              </p>
              <p>
                <span className="font-medium text-wms-muted">Notes:</span>{' '}
                {check.notes || 'N/A'}
              </p>
            </div>
          </div>

          {/* Details Table */}
          <h3 className="font-medium text-[14px] mb-3">Check Detail Lines</h3>
          <div className="border border-solid border-wms-border-color rounded-lg overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-gray-50 border-b border-wms-border-color">
                <tr>
                  <th className="p-3 text-left">Product Name</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Batch No</th>
                  <th className="p-3 text-right">System Qty</th>
                  <th className="p-3 text-right">Actual Qty</th>
                  <th className="p-3 text-right">Variance</th>
                  <th className="p-3 text-left">Reason</th>
                </tr>
              </thead>
              <tbody>
                {check.details && check.details.length > 0 ? (
                  check.details.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-wms-border-color last:border-0 hover:bg-gray-50/50"
                    >
                      <td className="p-3 font-medium">{item.productName}</td>
                      <td className="p-3">{item.locationBarcode}</td>
                      <td className="p-3">{item.batchNo || '—'}</td>
                      <td className="p-3 text-right">{item.systemQuantity}</td>
                      <td className="p-3 text-right">{item.actualQuantity}</td>
                      <td className="p-3 text-right font-medium">
                        <span
                          className={
                            item.variance === 0
                              ? 'text-wms-muted'
                              : item.variance > 0
                                ? 'text-green-600'
                                : 'text-red-500'
                          }
                        >
                          {item.variance > 0
                            ? `+${item.variance}`
                            : item.variance}
                        </span>
                      </td>
                      <td className="p-3 text-wms-muted">{item.reason || '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-wms-muted">
                      No details available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-solid border-wms-border-color bg-gray-50/50 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-wms-primary border border-solid border-wms-primary text-white hover:opacity-90 transition-all shadow-sm"
          >
            Close
          </button>
          {check.status === 'PENDING' && (
            <button
              onClick={() => onConfirm(check.id)}
              className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-green-500 border border-solid border-green-500 text-white hover:opacity-90 transition-all shadow-sm"
            >
              Confirm & Adjust Stock
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default CheckDetailModal;