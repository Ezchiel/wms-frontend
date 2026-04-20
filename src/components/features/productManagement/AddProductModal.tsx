import React, { useState } from 'react';
import type { ProductGroup } from '../../../store/slices/productGroupSlice';
import type { ProductPayload } from '../../../store/slices/productSlice';

interface Props {
  isOpen: boolean;
  groups: ProductGroup[];
  onClose: () => void;
  onSave: (data: ProductPayload) => Promise<void>;
}

const AddProductModal: React.FC<Props> = ({ isOpen, groups, onClose, onSave }) => {
  const [formData, setFormData] = useState<ProductPayload>({
    productCode: '',
    productName: '',
    unit: '',
    groupId: 0,
    description: '',
    minStockLevel: 0,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-125 rounded-xl shadow-lg flex flex-col overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-solid border-wms-border-color sticky top-0 bg-white z-10">
          <h2 className="text-[16px] font-semibold text-wms-text-main">Add new group</h2>
          <button
            onClick={onClose}
            className="text-wms-muted hover:text-wms-text-main transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Body (Form) */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">
              Product code <span className="text-red-500">*</span>
            </label>
            <input
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
              onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">
              Product name <span className="text-red-500">*</span>
            </label>
            <input
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">Unit</label>
            <input
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
              placeholder="VD: Cái, Thùng"
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">
              Group <span className="text-red-500">*</span>
            </label>
            <select
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main focus:border-wms-primary transition-colors"
              onChange={(e) => setFormData({ ...formData, groupId: Number(e.target.value) })}
            >
              <option value={0} className="text-wms-muted">
                Please choose group
              </option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.groupName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">Min stock level</label>
            <input
              type="number"
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
              onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-solid border-wms-border-color bg-gray-50/50 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-white border border-solid border-wms-border-color text-wms-text-main hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-wms-primary border border-solid border-wms-primary text-white hover:bg-wms-primary-hover transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
