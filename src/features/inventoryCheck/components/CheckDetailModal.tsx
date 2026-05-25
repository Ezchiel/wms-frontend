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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Inventory Check: {check.checkCode}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-center">System Qty</th>
                <th className="p-3 text-center">Actual Qty</th>
                <th className="p-3 text-center">Variance</th>
                <th className="p-3 text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              {check.details.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3">{item.locationBarcode}</td>
                  <td className="p-3 text-center">{item.systemQuantity}</td>
                  <td className="p-3 text-center font-semibold">{item.actualQuantity}</td>
                  <td
                    className={`p-3 text-center font-bold ${item.variance < 0 ? 'text-red-500' : item.variance > 0 ? 'text-green-500' : ''}`}
                  >
                    {item.variance > 0 ? `+${item.variance}` : item.variance}
                  </td>
                  <td className="p-3 text-gray-500 italic">{item.reason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 border rounded-md">
            Close
          </button>
          {check.status === 'PENDING' && (
            <button
              onClick={() => onConfirm(check.id)}
              className="px-5 py-2 bg-wms-primary text-white rounded-md hover:opacity-90"
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
