import React, { useState } from 'react';
import { useAppSelector } from '../../../app/hooks';

interface Props {
  onSearch?: (keyword: string) => void;
  onActionClick?: () => void;
}

const FilterInventoryIssue: React.FC<Props> = ({ onSearch, onActionClick }) => {
  const [keyword, setKeyword] = useState('');
  const user = useAppSelector((state) => state.auth.user);
  const showCreateBtn = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const handleSearchClick = () => {
    if (onSearch) onSearch(keyword.trim());
  };

  return (
    <div className="flex justify-between items-center mb-6.25">
      <div className="flex items-center gap-3.75">
        <div className="flex items-center gap-2.5 text-[13px] font-medium">
          <label className="text-wms-text-main">Search Issue</label>
          <input
            className="py-2 px-3.75 border border-solid border-wms-border-color rounded-md outline-none text-[13px] text-wms-text-main placeholder:text-wms-muted focus:border-wms-primary transition-colors"
            type="text"
            placeholder="Mã phiếu, tên KH..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
          />
        </div>

        <button
          onClick={handleSearchClick}
          className="py-2 px-5 rounded-md text-[13px] font-medium cursor-pointer transition-all duration-300 bg-transparent border border-solid border-wms-primary text-wms-primary hover:bg-wms-primary/10"
        >
          Search
        </button>
      </div>

      {showCreateBtn && (
        <button
          onClick={onActionClick}
          className="py-2.25 px-5 rounded-md text-[13px] font-medium cursor-pointer transition-all duration-300 bg-wms-primary border border-solid border-wms-primary text-white flex items-center gap-2 hover:opacity-90 shadow-md"
        >
          <i className="fa-solid fa-plus text-[12px]"></i>
          Create Issue
        </button>
      )}
    </div>
  );
};

export default FilterInventoryIssue;
