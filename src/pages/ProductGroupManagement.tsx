import React, { useEffect, useState } from 'react';
import AddProductGroupModal from '../components/features/productGroupManagement/AddProductGroupModal';
import FilterProductGroup from '../components/features/productGroupManagement/FilterProductGroup';
import ProductGroupTable from '../components/features/productGroupManagement/ProductGroupTable';
import TabNavigation from '../components/features/TabNavigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  createProductGroup,
  deleteProductGroup,
  fetchProductGroups,
  type ProductGroupPayload,
} from '../store/slices/productGroupSlice';

const ProductGroupManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { productGroups, loading } = useAppSelector((state) => state.productGroups);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProductGroups());
  }, [dispatch]);

  const handleSave = async (data: ProductGroupPayload) => {
    await dispatch(createProductGroup(data));
    setIsAddModalOpen(false);
  };

  const tableHeads = ['Group code', 'Group name', 'Description', 'Actions'];

  const getTabColor = (index: number) => {
    if (index === tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">
      {/* --- PAGE TITLE --- */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.25">Product group management</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">
          Product group management for administrator and manager
        </p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <TabNavigation
          tabs={['All groups', 'Recently']}
          activeTabIndex={tabIndex}
          onTabChange={setTabIndex}
          getTabColor={getTabColor}
        />

        {/* Table section */}
        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterProductGroup onActionClick={() => setIsAddModalOpen(true)} />

          {loading ? (
            <div className="py-10 text-center">Đang tải dữ liệu...</div>
          ) : (
            <ProductGroupTable
              tableHeads={tableHeads}
              data={productGroups}
              onDelete={(id) => dispatch(deleteProductGroup(id))}
            />
          )}
        </div>
      </div>

      <AddProductGroupModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProductGroupManagement;
