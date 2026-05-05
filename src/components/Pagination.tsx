import type React from 'react';
import type { Meta } from '../types/api.types';

interface PaginationProps {
  meta: Meta | null;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  if (!meta) return null;

  const { page = 1, totalPages = 0 } = meta;

  if (totalPages <= 1) return null;

  const handlePrevClick = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextClick = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      const isActive = page === i;
      pages.push(
        <div
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-7.5 h-7.5 flex items-center justify-center border rounded-sm text-[13px] cursor-pointer transition-colors
            ${
              isActive
                ? 'border-wms-primary text-wms-primary bg-blue-50'
                : 'border-wms-border-color text-wms-muted bg-white hover:bg-gray-50'
            }`}
        >
          {i}
        </div>
      );
    }
    return pages;
  };

  return (
    <div className="flex justify-end items-center gap-1.25 mt-6.25">
      {/* Previous button */}
      <div
        onClick={handlePrevClick}
        className={`w-7.5 h-7.5 flex items-center justify-center border border-wms-border-color rounded-sm text-[13px] bg-white transition-colors
          ${page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-wms-muted cursor-pointer hover:bg-gray-50'}`}
      >
        <i className="fa-solid fa-angle-left"></i>
      </div>

      {/* Page list */}
      {renderPageNumbers()}

      {/* Next button */}
      <div
        onClick={handleNextClick}
        className={`w-7.5 h-7.5 flex items-center justify-center border border-wms-border-color rounded-sm text-[13px] bg-white transition-colors
          ${page === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-wms-muted cursor-pointer hover:bg-gray-50'}`}
      >
        <i className="fa-solid fa-angle-right"></i>
      </div>
    </div>
  );
};

export default Pagination;
