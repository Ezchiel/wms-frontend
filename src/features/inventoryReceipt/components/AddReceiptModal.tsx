import React, { useState } from 'react';
import type { Partner } from '../../partners/partnerTypes';
import type { Product } from '../../products/productTypes';
import type { InventoryReceiptPayload, ReceiptDetailPayload } from '../inventoryReceiptTypes';

interface Props {
  isOpen: boolean;
  suppliers: Partner[];
  products: Product[];
  onClose: () => void;
  onSave: (data: InventoryReceiptPayload) => Promise<void>;
}

const AddReceiptModal: React.FC<Props> = ({ isOpen, suppliers, products, onClose, onSave }) => {
  const [formData, setFormData] = useState<InventoryReceiptPayload>({
    supplierId: 0,
    notes: '',
    details: [],
  });

  if (!isOpen) return null;

  const addDetailRow = () => {
    const newDetail: ReceiptDetailPayload = {
      productId: 0,
      quantity: 1,
      unitPrice: 0,
      batchNo: '',
      expiryDate: '',
      serialNumber: '',
    };
    setFormData({ ...formData, details: [...formData.details, newDetail] });
  };

  const removeDetailRow = (index: number) => {
    const newDetails = formData.details.filter((_, i) => i !== index);
    setFormData({ ...formData, details: newDetails });
  };

  const updateDetail = (index: number, field: keyof ReceiptDetailPayload, value: unknown) => {
    const newDetails = [...formData.details];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setFormData({ ...formData, details: newDetails });
  };

  const handleSubmit = () => {
    if (formData.supplierId === 0 || formData.details.length === 0) {
      alert('Vui lòng chọn nhà cung cấp và ít nhất một sản phẩm!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-white w-full max-w-6xl rounded-xl shadow-lg flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-solid border-wms-border-color sticky top-0 bg-white z-10">
          <h2 className="text-[16px] font-semibold text-wms-text-main">Create Inventory Receipt</h2>
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
                Supplier <span className="text-red-500">*</span>
              </label>
              <select
                className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main focus:border-wms-primary"
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: Number(e.target.value) })}
              >
                <option value={0}>-- Select Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-[13px]">
              <label className="font-medium text-wms-text-main text-[13px]">Notes</label>
              <input
                type="text"
                className="py-2 px-3.5 border border-solid border-wms-border-color rounded-md outline-none text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary"
                placeholder="Nhập ghi chú cho phiếu nhập..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Details Table Section */}
          <div className="border border-solid border-wms-border-color rounded-lg overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-gray-50 border-b border-wms-border-color">
                <tr>
                  <th className="p-3 text-left w-1/4">Product</th>
                  <th className="p-3 text-left w-25">Qty</th>
                  <th className="p-3 text-left">Unit Price</th>
                  <th className="p-3 text-left">Batch No</th>
                  <th className="p-3 text-left">Serial No</th>
                  <th className="p-3 text-left">Expiry Date</th>
                  <th className="p-3 text-center w-12.5"></th>
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
                        className="w-full py-1.5 px-2 border border-wms-border-color rounded outline-none focus:border-wms-primary"
                        value={item.productId}
                        onChange={(e) => updateDetail(index, 'productId', Number(e.target.value))}
                      >
                        <option value={0}>Select product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.productName}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Location */}
                    {/* <td className="p-3">
                      <select
                        className="py-1.5 px-2 border border-wms-border-color rounded outline-none focus:border-wms-primary"
                        value={item.locationId || 0}
                        onChange={(e) => updateDetail(index, 'locationId', Number(e.target.value))}
                      >
                        <option value={0}>Select location</option>
                        {storageLocations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.zone}-{loc.rack}-{loc.shelf}
                          </option>
                        ))}
                      </select>
                    </td> */}

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

                    {/* Unit price */}
                    <td className="p-3">
                      <input
                        type="number"
                        className="w-full py-1.5 px-2 border border-wms-border-color rounded outline-none"
                        value={item.unitPrice}
                        onChange={(e) => updateDetail(index, 'unitPrice', Number(e.target.value))}
                      />
                    </td>

                    {/* Batch no */}
                    <td className="p-3">
                      <input
                        type="text"
                        className="w-full py-1.5 px-2 border border-wms-border-color rounded outline-none placeholder:text-[11px]"
                        placeholder="Batch#"
                        value={item.batchNo}
                        onChange={(e) => updateDetail(index, 'batchNo', e.target.value)}
                      />
                    </td>

                    {/* Serial number */}
                    <td className="p-3">
                      <input
                        type="text"
                        className="w-full py-1.5 px-2 border border-wms-border-color rounded outline-none placeholder:text-[11px]"
                        placeholder="S/N"
                        value={item.serialNumber || ''}
                        onChange={(e) => updateDetail(index, 'serialNumber', e.target.value)}
                      />
                    </td>

                    {/* Expiry date */}
                    <td className="p-3">
                      <input
                        type="date"
                        className="w-full py-1.5 px-2 border border-wms-border-color rounded outline-none"
                        value={item.expiryDate}
                        onChange={(e) => updateDetail(index, 'expiryDate', e.target.value)}
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
            className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-white border border-solid border-wms-border-color text-wms-text-main hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer bg-wms-primary border border-solid border-wms-primary text-white hover:opacity-90 transition-all shadow-sm"
          >
            Save Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReceiptModal;
