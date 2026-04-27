import React from 'react';
import type { ProductGroup } from '../../../store/slices/productGroupSlice';

interface ProductGroupTableProps {
  tableHeads: string[];
  data: ProductGroup[];
  onEdit: (group: ProductGroup) => void;
  onDelete: (id: number) => void;
}

const ProductGroupTable: React.FC<ProductGroupTableProps> = ({
  tableHeads,
  data,
  onEdit,
  onDelete,
}) => {
  return (
    <table className="w-full border-collapse text-[13px]">
      <thead className="bg-[#f8fafc]">
        <tr>
          {tableHeads.map((head, index) => (
            <th key={index} className="text-start p-3.75 text-wms-muted font-medium">
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((group) => (
          <tr key={group.id} className="hover:bg-gray-50 transition-colors">
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {group.groupCode}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {group.groupName}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {group.description || 'N/A'}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              <button
                onClick={() => onEdit(group)}
                className="mr-2 px-4 py-1 border border-blue-500 rounded-[7px] text-blue-500 cursor-pointer hover:bg-wms-primary hover:text-white"
              >
                Edit
              </button>
              <button
                onClick={() => window.confirm('Xoá nhóm này?') && onDelete(group.id)}
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

export default ProductGroupTable;
