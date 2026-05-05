import React from 'react';
import Pagination from '../../components/Pagination';
import TabNavigation from '../../components/TabNavigation';
import AddStorageLocationModal from './components/AddStorageLocationModal';
import FilterStorageLocation from './components/FilterStorageLocation';
import PrintQRModal from './components/PrintQRModal';
import StorageLocationTable from './components/StorageLocationTable';
import { useStorageLocationManagement } from './useStorageLocation';

export const StorageLocationManagementFeature: React.FC = () => {
  const { state, actions } = useStorageLocationManagement();

  const getTabColor = (index: number) => {
    if (index === state.tabIndex) return '#ffffff';
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
          activeTabIndex={state.tabIndex}
          onTabChange={actions.handleTabChange}
          getTabColor={getTabColor}
        />

        {/* Table section */}
        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterStorageLocation
            onSearch={actions.handleSearch}
            onActionClick={actions.handleOpenAddModal}
            onImportClick={actions.handleImportExcel}
          />

          {state.loading ? (
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
                data={state.storageLocations}
                onEdit={actions.handleOpenEditModal}
                onPrintQR={actions.handleOpenPrintModal}
                onDelete={actions.handleDelete}
              />

              {/* Pagination */}
              <Pagination meta={state.meta} onPageChange={actions.setCurrentPage} />
            </>
          )}
        </div>
      </div>

      {/* Add/Edit modal */}
      <AddStorageLocationModal
        key={state.editingLocation?.id || 'new'}
        isOpen={state.isModalOpen}
        initialData={state.editingLocation}
        onClose={() => {
          actions.setIsModalOpen(false);
          actions.setEditingLocation(null);
        }}
        onSave={actions.handleSave}
      />

      {/* PrintQR modal */}
      <PrintQRModal
        isOpen={state.isPrintModalOpen}
        location={state.selectedLocation}
        onClose={() => {
          actions.setIsPrintModalOpen(false);
          actions.setSelectedLocation(null);
        }}
      />
    </div>
  );
};
