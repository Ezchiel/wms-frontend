import React, { useState } from 'react';
import type { Partner, PartnerPayload, PartnerType } from '../../../store/slices/partnerSlice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PartnerPayload) => Promise<void>;
  initialData?: Partner | null;
}

const AddPartnerModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const defaultData: PartnerPayload = {
    name: '',
    type: 'CUSTOMER',
    phone: '',
    email: '',
    address: '',
    taxCode: '',
  };

  const [formData, setFormData] = useState<PartnerPayload>({
    name: initialData?.name || '',
    type: initialData?.type || 'CUSTOMER',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    taxCode: initialData?.taxCode || '',
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    await onSave(formData);
    setFormData(defaultData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-125 rounded-xl shadow-lg flex flex-col overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-solid border-wms-border-color sticky top-0 bg-white z-10">
          <h2 className="text-[16px] font-semibold text-wms-text-main">
            {initialData ? 'Edit partner' : 'Add new partner'}
          </h2>
          <button
            onClick={onClose}
            className="text-wms-muted hover:text-wms-text-main transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Body (Form) */}
        <div className="p-6 flex flex-col gap-4">
          {/* Partner name */}
          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">
              Partner Name <span className="text-red-500">*</span>
            </label>
            <input
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Partner type */}
          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">
              Partner Type <span className="text-red-500">*</span>
            </label>
            <select
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main focus:border-wms-primary transition-colors"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as PartnerType })}
            >
              <option value="OTHER" className="text-wms-muted">
                Please choose partner
              </option>
              <option value="SUPPLIER">Supplier</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>

          {/* Partner Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-[13px]">
              <label className="font-medium text-wms-text-main">Phone</label>
              <input
                className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5 text-[13px]">
              <label className="font-medium text-wms-text-main">Tax Code</label>
              <input
                className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
                value={formData.taxCode}
                onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
              />
            </div>
          </div>

          {/* Partner email */}
          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">Email</label>
            <input
              type="email"
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Partner address */}
          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">Address</label>
            <input
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-solid border-wms-border-color bg-gray-50/50 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-white border border-solid border-wms-border-color text-wms-text-main hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-wms-primary border border-solid border-wms-primary text-white hover:bg-wms-primary-hover transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPartnerModal;
