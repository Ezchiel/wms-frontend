import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import type { StorageLocationPayload } from '../storageLocationTypes';

interface ExcelRow {
  Zone?: string | number;
  Rack?: string | number;
  Shelf?: string | number;
  Description?: string;
  'Path Sequence'?: string | number;
  'Max Capacity'?: string | number;
}

interface FilterStorageLocationProps {
  onSearch?: (keyword: string) => void;
  onActionClick?: () => void;
  onImportClick?: (data: StorageLocationPayload[]) => void;
}

const FilterStorageLocation: React.FC<FilterStorageLocationProps> = ({
  onSearch,
  onActionClick,
  onImportClick,
}) => {
  const [keyword, setKeyword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = () => {
    onSearch?.(keyword.trim());
  };

  // Handle read file Excel
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bstr = event.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        // Convert sheet to JSON
        const data = XLSX.utils.sheet_to_json<ExcelRow>(ws);

        // Map data from Excel column to StorageLocationPayload
        const formattedData: StorageLocationPayload[] = data
          .map((row) => {
            const zone = row.Zone ? String(row.Zone) : '';
            const rack = row.Rack ? String(row.Rack) : '';
            const shelf = row.Shelf ? String(row.Shelf) : '';
            // Auto generate barcode
            const barcode = [zone, rack, shelf].filter(Boolean).join('-');

            return {
              zone,
              rack,
              shelf,
              barcode,
              description: row.Description ? String(row.Description) : '',
              pathSequence: row['Path Sequence'] ? Number(row['Path Sequence']) : 0,
              maxCapacity: row['Max Capacity'] ? Number(row['Max Capacity']) : null,
            };
          })
          .filter((item) => item.zone && item.rack && item.shelf);

        if (onImportClick) {
          onImportClick(formattedData);
        }
      } catch (error) {
        console.error('Lỗi khi đọc file Excel:', error);
        alert('Đã có lỗi xảy ra khi đọc file. Vui lòng kiểm tra lại định dạng.');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex justify-between items-center mb-6.25">
      {/* Search box */}
      <div className="flex items-center gap-3.75">
        <div className="flex items-center gap-2.5 text-[13px] font-medium">
          <label>Search location</label>
          <input
            className="py-2 px-3.75 border border-solid border-wms-border-color rounded-md outline-none text-[13px] text-wms-muted"
            type="text"
            placeholder="Please enter here"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
          />
        </div>
        <button
          onClick={handleSearchClick}
          className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer transition-all duration-300 bg-transparent border border-solid border-wms-primary text-wms-primary"
        >
          Search
        </button>
      </div>

      <div className="flex gap-2">
        {/* Hidden input for choosing file */}
        <input
          type="file"
          accept=".xlsx, .xls"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
        {/* Import Excel button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="py-2.25 px-5 rounded-md text-[13px] font-medium cursor-pointer transition-all duration-300 bg-green-600 border border-solid border-green-600 text-white flex items-center gap-2"
        >
          <i className="fa-solid fa-file-excel"></i>
          Import Excel
        </button>

        {/* Add new location button */}
        <button
          onClick={onActionClick}
          className="py-2.25 px-5 rounded-md text-[13px] font-medium cursor-pointer transition-all duration-300 bg-wms-primary border border-solid border-wms-primary text-white flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Add new location
        </button>
      </div>
    </div>
  );
};

export default FilterStorageLocation;
