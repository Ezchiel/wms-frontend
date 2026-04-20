import React from 'react';
import type { StorageLocation } from '../../../store/slices/storageLocationSlice';

interface StorageLocationTableProps {
  heads: string[];
  data: StorageLocation[];
  onDelete: (id: number) => void;
  onEdit?: (location: StorageLocation) => void;
}

const StorageLocationTable: React.FC<StorageLocationTableProps> = ({
  heads,
  data,
  onDelete,
  onEdit,
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
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {location.zone}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {location.rack}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {location.shelf}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {location.barcode}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {location.isFull ? (
                <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">FULL</span>
              ) : (
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                  AVAILABLE
                </span>
              )}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              <button
                onClick={() => onEdit && onEdit(location)}
                className="mr-2 px-5 py-1 border border-wms-primary rounded-[7px] text-wms-primary cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(location.id)}
                className="mr-2 px-5 py-1 border border-wms-primary rounded-[7px] text-wms-primary cursor-pointer"
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
