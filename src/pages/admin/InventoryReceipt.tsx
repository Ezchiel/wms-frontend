import React, { useEffect, useState } from 'react';
import TabNavigation from '../../components/admin/TabNavigation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  confirmReceipt,
  createReceipt,
  fetchReceipts,
  type InventoryReceipt,
  type InventoryReceiptPayload,
} from '../../store/slices/inventoryReceiptSlice';
import { fetchPartners } from '../../store/slices/partnerSlice';
import { fetchProducts } from '../../store/slices/productSlice';
import { fetchAvailableLocations } from '../../store/slices/storageLocationSlice';

import AddReceiptModal from '../../components/admin/inventoryReceipt/AddReceiptModal';
import FilterInventoryReceipt from '../../components/admin/inventoryReceipt/FilterInventoryReceipt';
import InventoryReceiptTable from '../../components/admin/inventoryReceipt/InventoryReceiptTable';
import ReceiptDetailModal from '../../components/admin/inventoryReceipt/ReceiptDetailModal';

const InventoryReceiptPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { receipts, loading } = useAppSelector((state) => state.inventoryReceipts);
  const { products } = useAppSelector((state) => state.products);
  const { partners } = useAppSelector((state) => state.partners);
  const { storageLocations } = useAppSelector((state) => state.storageLocations);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [selectedReceipt, setSelectedReceipt] = useState<InventoryReceipt | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchReceipts());
    dispatch(fetchProducts());
    dispatch(fetchPartners());
    dispatch(fetchAvailableLocations());
  }, [dispatch]);

  const handleCreateReceipt = async (data: InventoryReceiptPayload) => {
    try {
      await dispatch(createReceipt(data)).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create receipt:', error);
    }
  };

  const handleConfirm = (id: number) => {
    if (
      window.confirm(
        'Bạn có chắc chắn muốn xác nhận nhập kho cho phiếu này? Hệ thống sẽ tự động tăng tồn kho tương ứng.'
      )
    ) {
      dispatch(confirmReceipt(id));
    }
  };

  const filteredData = receipts.filter((item) => {
    if (tabIndex === 0) return true;
    if (tabIndex === 1) return item.status === 'PENDING';
    if (tabIndex === 2) return item.status === 'COMPLETED';
    return true;
  });

  const getTabColor = (index: number) => {
    if (index === tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">
      {/* --- PAGE TITLE --- */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.25">Inventory Receipt</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">
          Inventory receipt management for Admin and Manager
        </p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <TabNavigation
          tabs={['All Receipts', 'Pending', 'Completed']}
          activeTabIndex={tabIndex}
          onTabChange={setTabIndex}
          getTabColor={getTabColor}
        />

        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterInventoryReceipt onActionClick={() => setIsModalOpen(true)} />

          {loading ? (
            <div className="py-10 text-center text-wms-muted text-[13px]">Loading data...</div>
          ) : (
            <InventoryReceiptTable
              heads={[
                'Receipt Code',
                'Supplier',
                'Date Created',
                'Total Amount',
                'Status',
                'Actions',
              ]}
              data={filteredData}
              onConfirm={handleConfirm}
              onViewDetail={(receipt) => {
                setSelectedReceipt(receipt);
                setIsDetailModalOpen(true);
              }}
            />
          )}
        </div>
      </div>

      {/* --- MODAL --- */}
      <AddReceiptModal
        isOpen={isModalOpen}
        suppliers={partners.filter((p) => p.type === 'SUPPLIER')}
        products={products}
        storageLocations={storageLocations}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateReceipt}
      />
      <ReceiptDetailModal
        isOpen={isDetailModalOpen}
        receipt={selectedReceipt}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedReceipt(null);
        }}
      />
    </div>
  );
};

export default InventoryReceiptPage;
