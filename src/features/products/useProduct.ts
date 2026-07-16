// src/store/slices/useProductManagement.ts (hoặc src/features/products/useProductManagement.ts tùy cấu trúc thư mục của bạn)
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAllProductGroups } from '../productGroups/productGroupThunks';
import { createProduct, deleteProduct, fetchProducts, updateProduct } from './productThunks';
import { fetchLowStockAlerts } from '../dashboard/dashboardThunks';
import type { Product, ProductPayload } from './productTypes';

export const useProductManagement = () => {
  const dispatch = useAppDispatch();
  const { products, loading, meta } = useAppSelector((state) => state.products);
  const { productGroups } = useAppSelector((state) => state.productGroups);
  const { lowStockAlerts } = useAppSelector((state) => state.dashboard);

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
    dispatch(fetchLowStockAlerts());
  }, [dispatch, currentPage, pageSize, searchKeyword]);

  const handleSearch = (keyword: string) => {
    setCurrentPage(1);
    setSearchKeyword(keyword);
  };

  const handleRefresh = () => {
    dispatch(fetchProducts({ keyword: searchKeyword, page: currentPage, size: pageSize }));
    dispatch(fetchAllProductGroups());
    dispatch(fetchLowStockAlerts());
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

  return {
    state: {
      products,
      loading,
      meta,
      productGroups,
      tabIndex,
      isModalOpen,
      editingProduct,
      lowStockAlerts,
    },
    actions: {
      setTabIndex,
      setCurrentPage,
      handleSearch,
      handleRefresh,
      handleOpenAddModal,
      handleOpenEditModal,
      handleSave,
      handleDelete,
      setIsModalOpen,
      setEditingProduct,
    },
  };
};
