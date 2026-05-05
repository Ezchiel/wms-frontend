import React from 'react';
import type { StorageLocation } from '../storageLocationTypes';

interface StorageLocationTableProps {
  heads: string[];
  data: StorageLocation[];
  onDelete: (id: number) => void;
  onEdit?: (location: StorageLocation) => void;
  onPrintQR?: (location: StorageLocation) => void;
}

const StorageLocationTable: React.FC<StorageLocationTableProps> = ({
  heads,
  data,
  onDelete,
  onEdit,
  onPrintQR,
}) => {
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
        {data.map((location) => (
          <tr key={location.id} className="hover:bg-gray-50 transition-colors">
            {/* Zone */}
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {location.zone}
            </td>

            {/* Rack */}
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {location.rack}
            </td>

            {/* Shelf */}
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {location.shelf}
            </td>

            {/* Barcode */}
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {location.barcode}
            </td>

            {/* Path Sequence */}
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {location.pathSequence || '-'}
            </td>

            {/* Description */}
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {location.description}
            </td>

            {/* Status */}
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {location.full ? (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-700">
                  FULL
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                  AVAILABLE
                </span>
              )}
            </td>

            {/* Action buttons */}
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {/* Print button */}
              <button
                onClick={() => onPrintQR?.(location)}
                className="mr-2 px-4 py-1 border border-blue-500 rounded-[7px] text-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white"
              >
                Print QR
              </button>

              {/* Edit button */}
              <button
                onClick={() => onEdit && onEdit(location)}
                className="mr-2 px-5 py-1 border border-wms-primary rounded-[7px] text-wms-primary cursor-pointer hover:bg-wms-primary hover:text-white"
              >
                Edit
              </button>

              {/* Delete button */}
              <button
                onClick={() => onDelete(location.id)}
                className="mr-2 px-5 py-1 border border-red-500 rounded-[7px] text-red-500 cursor-pointer hover:bg-red-500 hover:text-white"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StorageLocationTable;
