import React from 'react';
import type { StorageLocation } from '../storageLocationTypes';

interface StorageLocationTableProps {
  heads: string[];
  data: StorageLocation[];
  onDelete: (id: number) => void;
  onEdit?: (location: StorageLocation) => void;
  onPrintQR?: (location: StorageLocation) => void;
}

/** Returns a Tailwind color class based on fill percentage */
const getCapacityColor = (fillRate: number) => {
  if (fillRate >= 0.95) return { bar: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-100' };
  if (fillRate >= 0.7) return { bar: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-100' };
  return { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-100' };
};

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
        {data.map((location) => {
          const isUnlimited = location.maxCapacity == null;
          const fillRate = isUnlimited ? 0 : (location.fillRate ?? 0);
          const pct = Math.round(fillRate * 100);
          const colors = getCapacityColor(fillRate);

          return (
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

              {/* Capacity */}
              <td className="py-4.5 px-3.75 border-b border-b-wms-border-color">
                {isUnlimited ? (
                  <div className="flex flex-col gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-600">
                      Unlimited
                    </span>
                    {location.lockedProductName ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-medium max-w-[140px] truncate">
                        <i className="fa-solid fa-box text-[9px]" />
                        {location.lockedProductName}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
                        <i className="fa-solid fa-circle-check text-[9px]" />
                        Trống
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 min-w-[130px]">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-semibold ${colors.text}`}>
                        {location.currentQuantity} / {location.maxCapacity}
                        {location.unit ? ` ${location.unit}` : ''}
                      </span>
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${colors.bg} ${colors.text}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${colors.bar}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    {location.lockedProductName ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-medium max-w-[140px] truncate" title={location.lockedProductName}>
                        <i className="fa-solid fa-box text-[9px]" />
                        {location.lockedProductName}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
                        <i className="fa-solid fa-circle-check text-[9px]" />
                        Trống
                      </span>
                    )}
                  </div>
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
                  className="mt-1 mr-2 px-5 py-1 border border-wms-primary rounded-[7px] text-wms-primary cursor-pointer hover:bg-wms-primary hover:text-white"
                >
                  Edit
                </button>

                {/* Delete button */}
                <button
                  onClick={() => onDelete(location.id)}
                  className="mt-1 mr-2 px-5 py-1 border border-red-500 rounded-[7px] text-red-500 cursor-pointer hover:bg-red-500 hover:text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default StorageLocationTable;
