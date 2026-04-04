import type React from 'react';
import { useState } from 'react';

interface FilterTableProps {
  onSearch: (filters: { keyword?: string; role?: string }) => void;
  actionButtonText: string;
  actionButtonIcon: string;
  onActionClick?: () => void;
}

const FilterTable: React.FC<FilterTableProps> = ({
  onSearch,
  actionButtonText,
  actionButtonIcon,
  onActionClick,
}) => {
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('');

  const handleSearchClick = () => {
    onSearch({
      keyword: keyword.trim() != '' ? keyword.trim() : undefined,
      role: role !== '' && role != 'Please choose' ? role : undefined,
    });
  };

  return (
    <div className="flex justify-between items-center mb-6.25">
      <div className="flex items-center gap-3.75">
        <div className="flex items-center gap-2.5 text-[13px] font-medium">
          <label>User name</label>
          <input
            className="py-2 px-3.75 border border-solid border-wms-border-color rounded-md outline-none text-[13px] text-wms-muted"
            type="text"
            placeholder="Please enter here"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2.5 text-[13px] font-medium">
          <label>Role name</label>
          <select
            className="py-2 px-3.75 border border-solid border-wms-border-color rounded-md outline-none text-[13px] text-wms-muted"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Please choose</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="USER">User</option>
          </select>
        </div>
        <button
          onClick={handleSearchClick}
          className="py-2.25 px-5 rounded-md text-[13px] font-medium cursor-pointer transition-all duration-300 bg-transparent border border-solid border-wms-primary text-wms-primary"
        >
          Search
        </button>
      </div>
      <button
        onClick={onActionClick}
        className="py-2.25 px-5 rounded-md text-[13px] font-medium cursor-pointer transition-all duration-300 bg-wms-primary border border-solid border-wms-primary text-white flex items-center gap-2"
      >
        <i className={actionButtonIcon}></i>
        {actionButtonText}
      </button>
    </div>
  );
};

export default FilterTable;
