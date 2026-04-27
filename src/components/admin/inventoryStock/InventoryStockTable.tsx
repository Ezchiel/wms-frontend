import React from 'react';
import type { InventoryStock } from '../../../store/slices/inventoryStockSlice';
import type { StorageLocation } from '../../../store/slices/storageLocationSlice';

interface InventoryStockTableProps {
  heads: string[];
  data: InventoryStock[];
  locations: StorageLocation[];
}

const InventoryStockTable: React.FC<InventoryStockTableProps> = ({ heads, data, locations }) => {
  const getLocationDescription = (locationId: number) => {
    const foundLoc = locations.find((loc) => loc.id === locationId);
    return foundLoc?.description || `Location ${locationId}`;
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
          data.map((stock) => (
            <tr key={stock.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main font-medium">
                {stock.productName}
              </td>

              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {getLocationDescription(stock.locationId)}
              </td>

              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {stock.quantity}
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {stock.batchNo || 'N/A'}
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {stock.expiryDate || 'N/A'}
              </td>
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                {stock.serialNumber || 'N/A'}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default InventoryStockTable;
