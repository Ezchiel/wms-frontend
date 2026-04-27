import React from 'react';
import type { Partner } from '../../../store/slices/partnerSlice';

interface PartnerTableProps {
  heads: string[];
  data: Partner[];
  onDelete: (id: number) => void;
  onEdit?: (partner: Partner) => void;
}

const PartnerTable: React.FC<PartnerTableProps> = ({ heads, data, onDelete, onEdit }) => {
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
        {data.map((partner) => (
          <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {partner.name}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {partner.type}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {partner.phone}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {partner.email}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {partner.taxCode}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {partner.address}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              <button
                onClick={() => onEdit?.(partner)}
                className="px-5 py-1 border border-wms-primary rounded-[7px] text-wms-primary cursor-pointer hover:bg-wms-primary hover:text-white"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(partner.id)}
                className="mt-2 px-5 py-1 border border-red-500 rounded-[7px] text-red-500 cursor-pointer hover:bg-red-500 hover:text-white"
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

export default PartnerTable;
