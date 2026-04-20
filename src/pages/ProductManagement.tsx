import React, { useEffect, useState } from 'react';
import AddProductModal from '../components/features/productManagement/AddProductModal';
import FilterProduct from '../components/features/productManagement/FilterProduct';
import ProductTable from '../components/features/productManagement/ProductTable';
import TabNavigation from '../components/features/TabNavigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProductGroups } from '../store/slices/productGroupSlice';
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  type ProductPayload,
} from '../store/slices/productSlice';

const ProductManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const { productGroups } = useAppSelector((state) => state.productGroups);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductGroups());
  }, [dispatch]);

  const handleSave = async (data: ProductPayload) => {
    await dispatch(createProduct(data));
    setIsModalOpen(false);
  };

  const tableHeads = [
    'Product code',
    'Product name',
    'Unit',
    'Group',
    'Min stock level',
    'Actions',
  ];

  const getTabColor = (index: number) => {
    if (index === tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">
      {/* --- PAGE TITLE --- */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.25">Product management</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">
          Product management for administrator and manager
        </p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <TabNavigation
          tabs={['All products', 'Out of stock']}
          activeTabIndex={tabIndex}
          onTabChange={setTabIndex}
          getTabColor={getTabColor}
        />

        {/* Table section */}
        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterProduct onActionClick={() => setIsModalOpen(true)} />

          {loading ? (
            <div className="py-10 text-center">Đang tải dữ liệu...</div>
          ) : (
            <ProductTable
              heads={tableHeads}
              data={products}
              onDelete={(id) => window.confirm('Xóa sản phẩm này?') && dispatch(deleteProduct(id))}
            />
          )}
        </div>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        groups={productGroups}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProductManagement;
