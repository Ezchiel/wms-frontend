import React, { useEffect, useState } from 'react';
import Pagination from '../../components/admin/Pagination';
import AddStorageLocationModal from '../../components/admin/storageLocationManagement/AddStorageLocationModal';
import FilterStorageLocation from '../../components/admin/storageLocationManagement/FilterStorageLocation';
import PrintQRModal from '../../components/admin/storageLocationManagement/PrintQRModal';
import StorageLocationTable from '../../components/admin/storageLocationManagement/StorageLocationTable';
import TabNavigation from '../../components/admin/TabNavigation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  bulkCreateStorageLocation,
  createStorageLocation,
  deleteStorageLocation,
  fetchStorageLocations,
  updateStorageLocation,
  type StorageLocation,
  type StorageLocationPayload,
} from '../../store/slices/storageLocationSlice';

const StorageLocationManagement: React.FC = () => {
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

  // Handle open Add modal
  const handleOpenAddModal = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  // Handle open Edit modal
  const handleOpenEditModal = (location: StorageLocation) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  // Handle open PrintQR modal
  const handleOpenPrintModal = (location: StorageLocation) => {
    setSelectedLocation(location);
    setIsPrintModalOpen(true);
  };

  const handleSave = async (data: StorageLocationPayload) => {
    if (editingLocation) {
      await dispatch(updateStorageLocation({ id: editingLocation.id, data }));
    } else {
      await dispatch(createStorageLocation(data));
    }
    setIsModalOpen(false);
    setEditingLocation(null);
  };

  // Handle Import Excel
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

  const getTabColor = (index: number) => {
    if (index === tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">
      {/* --- PAGE TITLE --- */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.25">Storage location management</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">
          Storage location management for administrator and manager
        </p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <TabNavigation
          tabs={['All locations', 'Available']}
          activeTabIndex={tabIndex}
          onTabChange={handleTabChange}
          getTabColor={getTabColor}
        />

        {/* Table section */}
        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterStorageLocation
            onSearch={(keyword) => {
              setSearchKeyword(keyword);
              setCurrentPage(1);
            }}
            onActionClick={handleOpenAddModal}
            onImportClick={handleImportExcel}
          />

          {loading ? (
            <div className="py-10 text-center">Loading data...</div>
          ) : (
            <>
              <StorageLocationTable
                heads={[
                  'Zone',
                  'Rack',
                  'Shelf',
                  'Barcode',
                  'Path Seq',
                  'Description',
                  'Status',
                  'Actions',
                ]}
                data={storageLocations}
                onEdit={handleOpenEditModal}
                onPrintQR={handleOpenPrintModal}
                onDelete={(id) =>
                  window.confirm('Are you sure you want to delete this location?') &&
                  dispatch(deleteStorageLocation(id)).then(() => {
                    dispatch(
                      fetchStorageLocations({
                        keyword: searchKeyword,
                        page: currentPage,
                        size: pageSize,
                        isAvailableOnly: tabIndex === 1,
                      })
                    );
                  })
                }
              />

              {/* Pagination */}
              <Pagination meta={meta} onPageChange={setCurrentPage} />
            </>
          )}
        </div>
      </div>

      {/* Add/Edit modal */}
      <AddStorageLocationModal
        key={editingLocation?.id || 'new'}
        isOpen={isModalOpen}
        initialData={editingLocation}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLocation(null);
        }}
        onSave={handleSave}
      />

      {/* PrintQR modal */}
      <PrintQRModal
        isOpen={isPrintModalOpen}
        location={selectedLocation}
        onClose={() => {
          setIsPrintModalOpen(false);
          setSelectedLocation(null);
        }}
      />
    </div>
  );
};

export default StorageLocationManagement;
