import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchInventoryChecks } from './inventoryCheckThunks';
import { setSelectedCheck } from './inventoryCheckSlice';
import type { CheckStatus, InventoryCheckFilters, InventoryCheck } from './inventoryCheckTypes';
import type { Meta } from '../../types/api.types';
import Pagination from '../../components/Pagination';
import InventoryCheckTable from './components/InventoryCheckTable';
import InventoryCheckDetailModal from './components/InventoryCheckDetailModal';
import CreateCheckModal from './components/CreateCheckModal';

const STATUS_OPTIONS: { value: CheckStatus | ''; label: string }[] = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã huỷ' },
];

export default function InventoryCheckFeature() {
  const dispatch = useAppDispatch();
  const { checks, loading, error } = useAppSelector((state) => state.inventoryCheck);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [filters, setFilters] = useState<InventoryCheckFilters>({
    keyword: '',
    status: '',
    page: 1,
    size: 10,
    sortBy: 'id',
    sortDir: 'desc',
  });
  const [searchInput, setSearchInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    dispatch(fetchInventoryChecks(filters)).then((result) => {
      if (!cancelled && fetchInventoryChecks.fulfilled.match(result)) {
        setMeta(result.payload.meta);
      }
    });
    return () => {
      cancelled = true;
    };
    // filters is the dependency — spread into primitives to avoid object identity issues
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    filters.keyword,
    filters.status,
    filters.page,
    filters.size,
    filters.sortBy,
    filters.sortDir,
  ]);

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, keyword: searchInput, page: 1 }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleStatusChange = (status: CheckStatus | '') => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleViewDetail = (check: InventoryCheck) => {
    dispatch(setSelectedCheck(check));
    setShowDetailModal(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleConfirmSuccess = () => {
    setFilters((prev) => ({ ...prev }));
  };

  return (
    <div className="px-10 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-wms-text-main">Phiếu kiểm kê</h1>
          <p className="text-sm text-wms-muted mt-0.5">
            Quản lý và theo dõi các phiếu kiểm tra tồn kho
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-wms-primary hover:bg-wms-primary-hover text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-plus text-xs"></i>
          Tạo phiếu kiểm kê
        </button>
      </div>

      <div className="bg-white rounded-xl border border-wms-border-color p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-60 relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-wms-muted text-[13px]"></i>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm theo mã phiếu, ghi chú..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-wms-border-color rounded-lg outline-none focus:border-wms-primary focus:ring-1 focus:ring-wms-primary/20 text-wms-text-main placeholder:text-wms-muted"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value as CheckStatus | '')}
              className={`px-3 py-2 text-[13px] font-medium rounded-lg border transition-colors cursor-pointer ${
                filters.status === opt.value
                  ? 'bg-wms-primary text-white border-wms-primary'
                  : 'bg-white text-wms-muted border-wms-border-color hover:border-wms-primary hover:text-wms-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleSearch}
          className="px-4 py-2.5 bg-wms-primary hover:bg-wms-primary-hover text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          Tìm kiếm
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation"></i>
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-wms-border-color overflow-hidden">
        <InventoryCheckTable checks={checks} loading={loading} onViewDetail={handleViewDetail} />
      </div>

      <Pagination meta={meta} onPageChange={handlePageChange} />

      {showDetailModal && (
        <InventoryCheckDetailModal
          onClose={() => setShowDetailModal(false)}
          onConfirmSuccess={handleConfirmSuccess}
        />
      )}

      {showCreateModal && (
        <CreateCheckModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}
