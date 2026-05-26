import React from 'react';
import type { InventoryCheck, CheckStatus } from '../inventoryCheckTypes';

interface Props {
  heads: string[];
  data: InventoryCheck[];
  onViewDetail: (check: InventoryCheck) => void;
}

const STATUS_CONFIG: Record<CheckStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-700',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-700',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-700',
  },
};

const formatDate = (isoStr: string) => {
  try {
    return new Date(isoStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoStr;
  }
};

const InventoryCheckTable: React.FC<Props> = ({ heads, data, onViewDetail }) => {
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
          data.map((check) => {
            const statusCfg = STATUS_CONFIG[check.status];
            const discrepantCount = check.details.filter((d) => d.variance !== 0).length;

            return (
              <tr key={check.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main font-medium">
                  {check.checkCode}
                </td>
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                  {formatDate(check.checkDate)}
                </td>
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusCfg.className} uppercase`}
                  >
                    {statusCfg.label}
                  </span>
                </td>
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                  {check.createdBy || '—'}
                </td>
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{check.details.length}</span>
                    {discrepantCount > 0 && (
                      <span className="text-[11px] bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded font-semibold">
                        {discrepantCount} discrepant
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main max-w-48 truncate">
                  {check.notes || '—'}
                </td>
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                  <button
                    onClick={() => onViewDetail(check)}
                    className="mr-2 px-4 py-1 border border-wms-primary rounded-[7px] text-wms-primary hover:bg-wms-primary hover:text-white transition-all cursor-pointer"
                    title="View detail"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default InventoryCheckTable;