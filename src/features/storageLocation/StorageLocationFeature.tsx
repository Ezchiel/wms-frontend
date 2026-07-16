import React from 'react';
import Pagination from '../../components/Pagination';
import TabNavigation from '../../components/TabNavigation';
import AddStorageLocationModal from './components/AddStorageLocationModal';
import FilterStorageLocation from './components/FilterStorageLocation';
import PrintQRModal from './components/PrintQRModal';
import StorageLocationTable from './components/StorageLocationTable';
import { useStorageLocationManagement } from './useStorageLocation';
import { RefreshCw } from 'lucide-react';

export const StorageLocationManagementFeature: React.FC = () => {
  const { state, actions } = useStorageLocationManagement();

  const getTabColor = (index: number) => {
    if (index === state.tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <div className='flex justify-between'>
          <TabNavigation
            tabs={['All locations', 'Available']}
            activeTabIndex={state.tabIndex}
            onTabChange={actions.handleTabChange}
            getTabColor={getTabColor}
          />

          <div className='flex items-center'>
            <button
              onClick={actions.handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-800 rounded-xl shadow-xs transition-all text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${state.loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

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
                  'Capacity',
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
