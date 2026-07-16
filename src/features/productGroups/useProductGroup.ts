import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  createProductGroup,
  deleteProductGroup,
  fetchProductGroups,
  updateProductGroup,
} from './productGroupThunks';
import type { ProductGroup, ProductGroupPayload } from './productGroupTypes';

export const useProductGroupManagement = () => {
  const dispatch = useAppDispatch();
  const { productGroups, loading, meta } = useAppSelector((state) => state.productGroups);

  // States for search and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ProductGroup | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProductGroups({ keyword: searchKeyword, page: currentPage, size: pageSize }));
  }, [dispatch, searchKeyword, currentPage, pageSize]);

  const handleSearch = (keyword: string) => {
    setCurrentPage(1);
    setSearchKeyword(keyword);
  };

  const handleRefresh = () => {
    dispatch(fetchProductGroups({ keyword: searchKeyword, page: currentPage, size: pageSize }));
  };

  const handleOpenAddModal = () => {
    setEditingGroup(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (group: ProductGroup) => {
    setEditingGroup(group);
    setIsAddModalOpen(true);
  };

  const handleSave = async (data: ProductGroupPayload) => {
    if (editingGroup) {
      await dispatch(updateProductGroup({ id: editingGroup.id, data }));
    } else {
      await dispatch(createProductGroup(data));
      setCurrentPage(1);
    }

    dispatch(fetchProductGroups({ keyword: searchKeyword, page: currentPage, size: pageSize }));

    setIsAddModalOpen(false);
    setEditingGroup(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this product group?')) {
      try {
        await dispatch(deleteProductGroup(id));

        const isLastItemOnPage = productGroups.length === 1;
        const shouldGoBack = currentPage > 1 && isLastItemOnPage;
        const pageToFetch = shouldGoBack ? currentPage - 1 : currentPage;

        if (shouldGoBack) {
          setCurrentPage(pageToFetch);
        }

        dispatch(fetchProductGroups({ keyword: searchKeyword, page: currentPage, size: pageSize }));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return {
    state: {
      productGroups,
      loading,
      meta,
      tabIndex,
      isAddModalOpen,
      editingGroup,
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
      setIsAddModalOpen,
      setEditingGroup,
    },
  };
};
