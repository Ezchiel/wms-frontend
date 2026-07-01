import React from 'react';
import type { InventoryReceipt, ReceiptStatus } from '../inventoryReceiptTypes';

interface Props {
  heads: string[];
  data: InventoryReceipt[];
  onViewDetail: (receipt: InventoryReceipt) => void;
}

const InventoryReceiptTable: React.FC<Props> = ({ heads, data, onViewDetail }) => {
  const getStatusStyle = (status: ReceiptStatus) => {
    switch (status) {
      case 'EXPECTED':
        return 'bg-yellow-100 text-yellow-700';
      case 'RECEIVING':
        return 'bg-blue-100 text-blue-700';
      case 'PUTAWAY_PENDING':
        return 'bg-orange-100 text-orange-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <table className="w-full border-collapse text-[13px]">
      <thead className="bg-[#f8fafc]">
        <tr>
          {heads.map((head, index) => (
            <th key={index} className="text-start p-3.75 text-wms-muted font-medium">
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={heads.length} className="text-center py-10 text-wms-muted">
              No data.
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main font-medium">
                {item.receiptCode}
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {item.supplierName}
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {new Date(item.createdAt).toLocaleDateString('vi-VN')}
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                  item.totalAmount
                )}
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusStyle(item.status)}`}
                >
                  {item.status}
                </span>
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                <button
                  onClick={() => onViewDetail(item)}
                  className="mr-2 px-4 py-1 border border-wms-primary rounded-[7px] text-wms-primary hover:bg-wms-primary hover:text-white transition-all cursor-pointer"
                  title="Xem chi tiết"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default InventoryReceiptTable;
