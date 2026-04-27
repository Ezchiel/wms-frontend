import { QRCodeSVG } from 'qrcode.react';
import React from 'react';
import type { StorageLocation } from '../../../store/slices/storageLocationSlice';

interface PrintQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: StorageLocation | null;
}

const PrintQRModal: React.FC<PrintQRModalProps> = ({ isOpen, onClose, location }) => {
  if (!isOpen || !location) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 backdrop-blur-sm print:bg-white print:backdrop-blur-none">
      <div className="bg-white p-8 rounded-xl w-full max-w-sm flex flex-col items-center print:shadow-none print:p-0">
        {/* Content */}
        <div
          id="print-area"
          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg print:border-none print:w-full print:h-full"
        >
          {/* Location name */}
          <span className="font-bold text-lg mb-1 print:text-black">{location.barcode}</span>

          {/* QRCode */}
          <QRCodeSVG
            value={location.barcode}
            size={200}
            level="H"
            className="print:w-64 print:h-64"
          />

          <span className="text-[10px] text-gray-500 mt-1 print:text-black">
            Zone: {location.zone} | Rack: {location.rack} | Shelf: {location.shelf}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8 print:hidden w-full">
          {/* Cancel button */}
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="flex-1 py-2 bg-wms-primary text-white rounded-md hover:bg-wms-primary-hover flex justify-center items-center gap-2 cursor-pointer"
          >
            Print label
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintQRModal;
