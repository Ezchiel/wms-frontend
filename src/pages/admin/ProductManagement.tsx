import React, { useEffect, useState } from 'react';
import AddProductModal from '../../components/admin/productManagement/AddProductModal';
import FilterProduct from '../../components/admin/productManagement/FilterProduct';
import ProductTable from '../../components/admin/productManagement/ProductTable';
import TabNavigation from '../../components/admin/TabNavigation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProductGroups } from '../../store/slices/productGroupSlice';
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
  type Product,
  type ProductPayload,
} from '../../store/slices/productSlice';

const ProductManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const { productGroups } = useAppSelector((state) => state.productGroups);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductGroups());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = async (data: ProductPayload) => {
    if (editingProduct) {
      await dispatch(updateProduct({ id: editingProduct.id, data }));
    } else {
      await dispatch(createProduct(data));
    }
    setIsModalOpen(false);
    setEditingProduct(null);
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
        <h1 className="text-[22px] font-semibold mb-1.25">Product management</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">
          Product management for administrator and manager
        </p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <TabNavigation
          tabs={['All products']}
          activeTabIndex={tabIndex}
          onTabChange={setTabIndex}
          getTabColor={getTabColor}
        />

        {/* Table section */}
        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterProduct onActionClick={handleOpenAddModal} />

          {loading ? (
            <div className="py-10 text-center">Đang tải dữ liệu...</div>
          ) : (
            <ProductTable
              heads={[
                'Product code',
                'Product name',
                'Unit',
                'Group',
                'Min stock level',
                'Actions',
              ]}
              data={products}
              onEdit={handleOpenEditModal}
              onDelete={(id) => window.confirm('Xóa sản phẩm này?') && dispatch(deleteProduct(id))}
            />
          )}
        </div>
      </div>

      <AddProductModal
        key={editingProduct?.id || 'new_product'}
        isOpen={isModalOpen}
        groups={productGroups}
        initialData={editingProduct}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProductManagement;
