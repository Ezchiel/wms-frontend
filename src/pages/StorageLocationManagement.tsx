import React, { useEffect, useState } from 'react';
import AddStorageLocationModal from '../components/features/storageLocationManagement/AddStorageLocationModal';
import FilterStorageLocation from '../components/features/storageLocationManagement/FilterStorageLocation';
import StorageLocationTable from '../components/features/storageLocationManagement/StorageLocationTable';
import TabNavigation from '../components/features/TabNavigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  createStorageLocation,
  deleteStorageLocation,
  fetchStorageLocations,
  type StorageLocationPayload,
} from '../store/slices/storageLocationSlice';

const StorageLocationManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { storageLocations, loading } = useAppSelector((state) => state.storageLocations);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchStorageLocations());
  }, [dispatch]);

  const handleSave = async (data: StorageLocationPayload) => {
    await dispatch(createStorageLocation(data));
    setIsModalOpen(false);
  };

  const tableHeads = ['Zone', 'Rack', 'Shelf', 'Barcode', 'Status', 'Actions'];

  const getTabColor = (index: number) => {
    if (index === tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  const filteredData =
    tabIndex === 0 ? storageLocations : storageLocations.filter((loc) => loc.isFull);

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
          tabs={['All locations', 'Full locations']}
          activeTabIndex={tabIndex}
          onTabChange={setTabIndex}
          getTabColor={getTabColor}
        />

        {/* Table section */}
        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterStorageLocation onActionClick={() => setIsModalOpen(true)} />

          {loading ? (
            <div className="py-10 text-center">Đang tải dữ liệu...</div>
          ) : (
            <StorageLocationTable
              heads={tableHeads}
              data={filteredData}
              onDelete={(id) =>
                window.confirm('Are you sure you want to delete this location?') &&
                dispatch(deleteStorageLocation(id))
              }
            />
          )}
        </div>
      </div>

      <AddStorageLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default StorageLocationManagement;
