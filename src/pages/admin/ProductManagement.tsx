import React, { useEffect, useState } from 'react';
import Pagination from '../../components/admin/Pagination';
import AddProductModal from '../../components/admin/productManagement/AddProductModal';
import FilterProduct from '../../components/admin/productManagement/FilterProduct';
import ProductTable from '../../components/admin/productManagement/ProductTable';
import TabNavigation from '../../components/admin/TabNavigation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllProductGroups } from '../../store/slices/productGroupSlice';
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
  const { products, loading, meta } = useAppSelector((state) => state.products);
  const { productGroups } = useAppSelector((state) => state.productGroups);

  // State for search and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts({ keyword: searchKeyword, page: currentPage, size: pageSize }));
    dispatch(fetchAllProductGroups());
  }, [dispatch, currentPage, pageSize, searchKeyword]);

  const handleSearch = (keyword: string) => {
    setCurrentPage(1);
    setSearchKeyword(keyword);
  };

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
      setCurrentPage(1);
    }

    dispatch(fetchProducts({ keyword: searchKeyword, page: currentPage, size: pageSize }));

    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this product?')) {
      try {
        await dispatch(deleteProduct(id));

        const isLastItemOnPage = products.length === 1;
        const shouldGoBack = currentPage > 1 && isLastItemOnPage;
        const pageToFetch = shouldGoBack ? currentPage - 1 : currentPage;

        if (shouldGoBack) {
          setCurrentPage(pageToFetch);
        }

        dispatch(fetchProducts({ keyword: searchKeyword, page: currentPage, size: pageSize }));
      } catch (error) {
        console.error('Delete failed:', error);
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
          <FilterProduct onActionClick={handleOpenAddModal} onSearch={handleSearch} />

          {loading ? (
            <div className="py-10 text-center">Loading data...</div>
          ) : (
            <>
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
                onDelete={handleDelete}
              />

              {/* Pagination */}
              <Pagination meta={meta} onPageChange={setCurrentPage} />
            </>
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
