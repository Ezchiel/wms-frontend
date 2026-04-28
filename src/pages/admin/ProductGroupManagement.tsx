import React, { useEffect, useState } from 'react';
import Pagination from '../../components/admin/Pagination';
import AddProductGroupModal from '../../components/admin/productGroupManagement/AddProductGroupModal';
import FilterProductGroup from '../../components/admin/productGroupManagement/FilterProductGroup';
import ProductGroupTable from '../../components/admin/productGroupManagement/ProductGroupTable';
import TabNavigation from '../../components/admin/TabNavigation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  createProductGroup,
  deleteProductGroup,
  fetchProductGroups,
  updateProductGroup,
  type ProductGroup,
  type ProductGroupPayload,
} from '../../store/slices/productGroupSlice';

const ProductGroupManagement: React.FC = () => {
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
          tabs={['All groups']}
          activeTabIndex={tabIndex}
          onTabChange={setTabIndex}
          getTabColor={getTabColor}
        />

        {/* Table section */}
        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterProductGroup onSearch={handleSearch} onActionClick={handleOpenAddModal} />

          {loading ? (
            <div className="py-10 text-center">Loading data...</div>
          ) : (
            <>
              <ProductGroupTable
                tableHeads={['Group code', 'Group name', 'Description', 'Actions']}
                data={productGroups}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
              />

              {/* Pagination */}
              <Pagination meta={meta} onPageChange={setCurrentPage} />
            </>
          )}
        </div>
      </div>

      <AddProductGroupModal
        key={editingGroup?.id || 'new'}
        isOpen={isAddModalOpen}
        initialData={editingGroup}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingGroup(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProductGroupManagement;
