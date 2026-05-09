import { QRCodeSVG } from 'qrcode.react';
import React from 'react';

interface PrintLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    lpnCode: string;
    productName: string;
    qty: number;
  } | null;
}

const PrintLabelModal: React.FC<PrintLabelModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 backdrop-blur-sm print:hidden p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-sm flex flex-col items-center shadow-2xl">
        <h3 className="text-[15px] font-bold mb-4">Xem trước tem nhãn</h3>

        <div
          id="print-area"
          className="flex flex-col items-center p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 print:bg-white print:border-none"
        >
          <span className="font-black text-xl mb-2">{data.lpnCode}</span>
          <QRCodeSVG value={data.lpnCode} size={180} level="H" />
          <div className="mt-3 text-center">
            <p className="text-[13px] font-bold uppercase">{data.productName}</p>
            <p className="text-[12px]">Quantity: {data.qty}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 rounded-xl text-[13px] font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-wms-primary text-white rounded-xl text-[13px] font-bold shadow-sm"
          >
            Print label
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintLabelModal;
