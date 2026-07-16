import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  bulkCreateStorageLocation,
  createStorageLocation,
  deleteStorageLocation,
  fetchStorageLocations,
  updateStorageLocation,
} from './storageLocationThunks';
import type { StorageLocation, StorageLocationPayload } from './storageLocationTypes';

export const useStorageLocationManagement = () => {
  const dispatch = useAppDispatch();
  const { storageLocations, loading, meta } = useAppSelector((state) => state.storageLocations);

  // State for Pagination and Search
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');

  // State for Add/Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<StorageLocation | null>(null);

  // State for PrintQR modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<StorageLocation | null>(null);

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    dispatch(
      fetchStorageLocations({
        keyword: searchKeyword,
        page: currentPage,
        size: pageSize,
        isAvailableOnly: tabIndex === 1,
      })
    );
  }, [dispatch, currentPage, pageSize, tabIndex, searchKeyword]);

  // Reset to page 1 if switching Tabs
  const handleTabChange = (newTabIndex: number) => {
    setTabIndex(newTabIndex);
    setCurrentPage(1);
    setSearchKeyword('');
  };

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleSearch = (keyword: string) => {
    setCurrentPage(1);
    setSearchKeyword(keyword);
  };

  const handleRefresh = () => {
    dispatch(
      fetchStorageLocations({
        keyword: searchKeyword,
        page: currentPage,
        size: pageSize,
        isAvailableOnly: tabIndex === 1,
      })
    );
  };

  const handleOpenAddModal = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (location: StorageLocation) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleOpenPrintModal = (location: StorageLocation) => {
    setSelectedLocation(location);
    setIsPrintModalOpen(true);
  };

  const handleSave = async (data: StorageLocationPayload) => {
    if (editingLocation) {
      await dispatch(updateStorageLocation({ id: editingLocation.id, data }));
    } else {
      await dispatch(createStorageLocation(data));
      setCurrentPage(1);
    }

    dispatch(
      fetchStorageLocations({
        keyword: searchKeyword,
        page: currentPage,
        size: pageSize,
        isAvailableOnly: tabIndex === 1,
      })
    );

    setIsModalOpen(false);
    setEditingLocation(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await dispatch(deleteStorageLocation(id));

        const isLastItemOnPage = storageLocations.length === 1;
        const shouldGoBack = currentPage > 1 && isLastItemOnPage;
        const pageToFetch = shouldGoBack ? currentPage - 1 : currentPage;

        if (shouldGoBack) {
          setCurrentPage(pageToFetch);
        }

        dispatch(
          fetchStorageLocations({
            keyword: searchKeyword,
            page: currentPage,
            size: pageSize,
            isAvailableOnly: tabIndex === 1,
          })
        );
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleImportExcel = async (data: StorageLocationPayload[]) => {
    if (data.length === 0) return;

    const isConfirm = window.confirm(
      `Bạn có chắc chắn muốn tạo ${data.length} vị trí từ file Excel này không?`
    );

    if (isConfirm) {
      try {
        await dispatch(bulkCreateStorageLocation(data)).unwrap();
        alert(`Đã import thành công ${data.length} vị trí!`);

        dispatch(
          fetchStorageLocations({
            page: currentPage,
            size: pageSize,
            isAvailableOnly: tabIndex === 1,
          })
        );
      } catch (error: unknown) {
        alert(`Lỗi khi import: ${error}`);
      }
    }
  };

  return {
    state: {
      storageLocations,
      loading,
      meta,
      tabIndex,
      isModalOpen,
      editingLocation,
      isPrintModalOpen,
      selectedLocation,
    },
    actions: {
      setCurrentPage,
      handleTabChange,
      handleSearch,
      handleRefresh,
      handleOpenAddModal,
      handleOpenEditModal,
      handleOpenPrintModal,
      handleSave,
      handleDelete,
      handleImportExcel,
      setIsModalOpen,
      setEditingLocation,
      setIsPrintModalOpen,
      setSelectedLocation,
    },
  };
};
