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
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-red-50 text-red-600 border-red-200',
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
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main font-semibold font-mono text-[13px]">
                  {check.checkCode}
                </td>
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-muted text-[13px]">
                  {formatDate(check.checkDate)}
                </td>
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-semibold border ${statusCfg.className}`}
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
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-muted max-w-48 truncate">
                  {check.notes || '—'}
                </td>
                <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
                  <button
                    onClick={() => onViewDetail(check)}
                    className="mr-2 px-4 py-1 border border-wms-primary rounded-[7px] text-wms-primary hover:bg-wms-primary hover:text-white transition-all cursor-pointer"
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

