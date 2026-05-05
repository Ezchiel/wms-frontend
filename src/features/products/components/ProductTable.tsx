import React from 'react';
import type { Product } from '../productTypes';

interface ProductTableProps {
  heads: string[];
  data: Product[];
  onDelete: (id: number) => void;
  onEdit?: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ heads, data, onDelete, onEdit }) => {
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
        {data.map((product) => (
          <tr key={product.id} className="hover:bg-gray-50 transition-colors">
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {product.productCode}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {product.productName}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {product.unit}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {product.productGroup?.groupName || 'Chưa phân nhóm'}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              {product.minStockLevel}
            </td>
            <td className="py-4.5 px-3.75 border-b border-b-wms-border-color text-wms-text-main">
              <button
                onClick={() => onEdit && onEdit(product)}
                className="mr-2 px-5 py-1 border border-wms-primary rounded-[7px] text-wms-primary cursor-pointer hover:bg-wms-primary hover:text-white"
                title="Chỉnh sửa"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="mr-2 px-5 py-1 border border-red-500 rounded-[7px] text-red-500 cursor-pointer hover:bg-red-500 hover:text-white"
                title="Xóa sản phẩm"
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

export default ProductTable;
