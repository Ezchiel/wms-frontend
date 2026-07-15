import React, { useState } from 'react';
import type { Partner } from '../../partners/partnerTypes';
import type { Product } from '../../products/productTypes';
import type { CreateIssuePayload, CreateIssueDetailPayload } from '../inventoryIssueTypes';

interface Props {
  isOpen: boolean;
  customers: Partner[];
  products: Product[];
  onClose: () => void;
  onSave: (data: CreateIssuePayload) => Promise<void>;
}

const AddIssueModal: React.FC<Props> = ({
  isOpen,
  customers,
  products,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CreateIssuePayload>({
    customerId: 0,
    notes: '',
    details: [],
  });

  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const addDetailRow = () => {
    const newDetail: CreateIssueDetailPayload = {
      productId: 0,
      quantity: 1,
      batchNo: '',
    };
    setFormData({ ...formData, details: [...formData.details, newDetail] });
  };

  const removeDetailRow = (index: number) => {
    const newDetails = formData.details.filter((_, i) => i !== index);
    setFormData({ ...formData, details: newDetails });
  };

  const updateDetail = (index: number, field: keyof CreateIssueDetailPayload, value: number | string) => {
    const newDetails = [...formData.details];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setFormData({ ...formData, details: newDetails });
  };

  const handleSubmit = async () => {
    if (formData.customerId === 0) {
      alert('Vui lòng chọn khách hàng!');
      return;
    }
    if (formData.details.length === 0) {
      alert('Vui lòng thêm ít nhất một sản phẩm!');
      return;
    }

    const invalidDetail = formData.details.find((d) => d.productId === 0 || d.quantity <= 0);
    if (invalidDetail) {
      alert('Vui lòng chọn đầy đủ sản phẩm và số lượng lớn hơn 0!');
      return;
    }

    try {
      setIsSaving(true);
      await onSave(formData);
      // Reset form on success
      setFormData({
        customerId: 0,
        notes: '',
        details: [],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-solid border-wms-border-color sticky top-0 bg-white z-10">
          <h2 className="text-[16px] font-semibold text-wms-text-main">Create Inventory Issue</h2>
          <button
            onClick={onClose}
            className="text-wms-muted hover:text-red-500 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Top Info Section */}
          <div className="grid grid-cols-2 gap-5 mb-8">
            <div className="flex flex-col gap-1.5 text-[13px]">
              <label className="font-medium text-wms-text-main text-[13px]">
                Customer <span className="text-red-500">*</span>
              </label>
              <select
                className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main focus:border-wms-primary bg-white"
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: Number(e.target.value) })}
              >
                <option value={0}>-- Select Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-[13px]">
              <label className="font-medium text-wms-text-main text-[13px]">Notes</label>
              <input
                type="text"
                className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary"
                placeholder="Nhập ghi chú cho phiếu xuất..."
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Details Table Section */}
          <div className="border border-solid border-wms-border-color rounded-lg overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-gray-50 border-b border-wms-border-color">
                <tr>
                  <th className="p-3 text-left w-5/12">Product</th>
                  <th className="p-3 text-left w-3/12">Batch No (Optional)</th>
                  <th className="p-3 text-left w-24">Qty</th>
                  <th className="p-3 text-center w-12"></th>
                </tr>
              </thead>
              <tbody>
                {formData.details.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-wms-border-color last:border-0 hover:bg-gray-50/50"
                  >
                    {/* Product */}
                    <td className="p-3">
                      <select
                        className="w-full py-1.5 px-2 border border-wms-border-color rounded outline-none focus:border-wms-primary bg-white"
                        value={item.productId}
                        onChange={(e) => updateDetail(index, 'productId', Number(e.target.value))}
                      >
                        <option value={0}>Select product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.productName} ({p.productCode})
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Batch No (Optional) */}
                    <td className="p-3">
                      <input
                        type="text"
                        className="w-full py-1.5 px-2 border border-wms-border-color rounded outline-none focus:border-wms-primary"
                        placeholder="Để trống = tự động"
                        value={item.batchNo || ''}
                        onChange={(e) => updateDetail(index, 'batchNo', e.target.value)}
                      />
                    </td>

                    {/* Quantity */}
                    <td className="p-3">
                      <input
                        type="number"
                        min="1"
                        className="w-full py-1.5 px-2 border border-wms-border-color rounded outline-none"
                        value={item.quantity}
                        onChange={(e) => updateDetail(index, 'quantity', Number(e.target.value))}
                      />
                    </td>

                    {/* Delete row */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => removeDetailRow(index)}
                        className="text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-3 bg-gray-50/30">
              <button
                onClick={addDetailRow}
                className="text-[12px] font-medium text-wms-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <i className="fa-solid fa-plus text-[10px]"></i> Add product
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-solid border-wms-border-color bg-gray-50/50 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-white border border-solid border-wms-border-color text-wms-text-main hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-wms-primary border border-solid border-wms-primary text-white hover:opacity-90 transition-all shadow-sm flex items-center gap-1.5"
          >
            {isSaving ? 'Saving...' : 'Save Issue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddIssueModal;
