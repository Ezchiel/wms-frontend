import React, { useState } from 'react';
import type { StorageLocationPayload } from '../../../store/slices/storageLocationSlice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StorageLocationPayload) => Promise<void>;
}

const AddStorageLocationModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<StorageLocationPayload>({
    zone: '',
    rack: '',
    shelf: '',
    barcode: '',
    description: '',
    isFull: false,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-125 rounded-xl shadow-lg flex flex-col overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-solid border-wms-border-color sticky top-0 bg-white z-10">
          <h2 className="text-[16px] font-semibold text-wms-text-main">Add new location</h2>
          <button
            onClick={onClose}
            className="text-wms-muted hover:text-wms-text-main transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Body (Form) */}
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-[13px]">
              <label className="font-medium text-wms-text-main">
                Zone <span className="text-red-500">*</span>
              </label>
              <input
                className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
                placeholder="Ex: A, B, C"
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5 text-[13px]">
              <label className="font-medium text-wms-text-main">
                Rack <span className="text-red-500">*</span>
              </label>
              <input
                className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
                placeholder="Ex: R1"
                onChange={(e) => setFormData({ ...formData, rack: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-[13px]">
              <label className="font-medium text-wms-text-main">
                Shelf <span className="text-red-500">*</span>
              </label>
              <input
                className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
                placeholder="Ex: S1"
                onChange={(e) => setFormData({ ...formData, shelf: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5 text-[13px]">
              <label className="font-medium text-wms-text-main">
                Barcode <span className="text-red-500">*</span>
              </label>
              <input
                className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
                placeholder="Unique barcode"
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-[13px]">
            <label className="font-medium text-wms-text-main">Description</label>
            <textarea
              className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors resize-none"
              rows={3}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 text-[13px]">
            <input
              type="checkbox"
              id="isFull"
              onChange={(e) => setFormData({ ...formData, isFull: e.target.checked })}
            />
            <label htmlFor="isFull" className="font-medium text-wms-text-main cursor-pointer">
              Location is full
            </label>
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

export default AddStorageLocationModal;
