import React from 'react';
import type { InventoryReceipt } from '../../../store/slices/inventoryReceiptSlice';

interface Props {
  isOpen: boolean;
  receipt: InventoryReceipt | null;
  onClose: () => void;
}

const ReceiptDetailModal: React.FC<Props> = ({ isOpen, receipt, onClose }) => {
  if (!isOpen || !receipt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-solid border-wms-border-color sticky top-0 bg-white z-10">
          <h2 className="text-[16px] font-semibold text-wms-text-main">
            Receipt Detail: <span className="text-wms-primary">{receipt.receiptCode}</span>
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
                <span className="font-medium text-wms-muted">Supplier:</span> {receipt.supplierName}
              </p>
              <p>
                <span className="font-medium text-wms-muted">Created At:</span>{' '}
                {new Date(receipt.createdAt).toLocaleString('vi-VN')}
              </p>
              <p>
                <span className="font-medium text-wms-muted">Created By:</span> {receipt.createdBy}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-medium text-wms-muted">Status:</span>
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-[11px] font-semibold ${receipt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                >
                  {receipt.status}
                </span>
              </p>
              <p>
                <span className="font-medium text-wms-muted">Total Amount:</span>{' '}
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                  receipt.totalAmount
                )}
              </p>
              <p>
                <span className="font-medium text-wms-muted">Notes:</span> {receipt.notes || 'N/A'}
              </p>
            </div>
          </div>

          {/* Details Table */}
          <h3 className="font-medium text-[14px] mb-3">Product List</h3>
          <div className="border border-solid border-wms-border-color rounded-lg overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-gray-50 border-b border-wms-border-color">
                <tr>
                  <th className="p-3 text-left">Product Code</th>
                  <th className="p-3 text-left">Product Name</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-right">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {receipt.details && receipt.details.length > 0 ? (
                  receipt.details.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-wms-border-color last:border-0 hover:bg-gray-50/50"
                    >
                      <td className="p-3">{item.productCode}</td>
                      <td className="p-3 font-medium">{item.productName}</td>
                      <td className="p-3">{item.locationName}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">
                        {new Intl.NumberFormat('vi-VN').format(item.unitPrice)}
                      </td>
                      <td className="p-3 text-right font-medium text-wms-primary">
                        {new Intl.NumberFormat('vi-VN').format(item.totalPrice)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-wms-muted">
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
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetailModal;
