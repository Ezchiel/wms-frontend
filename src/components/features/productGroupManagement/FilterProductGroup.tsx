import React, { useState } from 'react';

interface FilterProductGroupProps {
  onSearch?: (keyword: string) => void;
  onActionClick?: () => void;
}

const FilterProductGroup: React.FC<FilterProductGroupProps> = ({ onSearch, onActionClick }) => {
  const [keyword, setKeyword] = useState('');

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(keyword.trim());
    }
  };

  return (
    <div className="flex justify-between items-center mb-6.25">
      <div className="flex items-center gap-3.75">
        <div className="flex items-center gap-2.5 text-[13px] font-medium">
          <label>Search product group</label>
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

      <button
        onClick={onActionClick}
        className="py-2.25 px-5 rounded-md text-[13px] font-medium cursor-pointer transition-all duration-300 bg-wms-primary border border-solid border-wms-primary text-white flex items-center gap-2"
      >
        <i className="fa-solid fa-folder-plus"></i>
        Add new group
      </button>
    </div>
  );
};

export default FilterProductGroup;
