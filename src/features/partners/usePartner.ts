import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createPartner, deletePartner, fetchPartners, updatePartner } from './partnerThunks';
import type { Partner, PartnerPayload, PartnerType } from './partnerTypes';

const TAB_TYPE_MAP: Record<number, PartnerType | undefined> = {
  0: undefined,
  1: 'SUPPLIER',
  2: 'CUSTOMER',
};

export const usePartnerManagement = () => {
  const dispatch = useAppDispatch();
  const { partners, loading, meta } = useAppSelector((state) => state.partners);

  // State for search and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    dispatch(
      fetchPartners({
        keyword: searchKeyword,
        page: currentPage,
        size: pageSize,
        type: TAB_TYPE_MAP[tabIndex],
      })
    );
  }, [dispatch, currentPage, pageSize, searchKeyword, tabIndex]);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    setCurrentPage(1);
    setSearchKeyword('');
  };

  const handleSearch = (keyword: string) => {
    setCurrentPage(1);
    setSearchKeyword(keyword);
  };

  const handleRefresh = () => {
    dispatch(
      fetchPartners({
        keyword: searchKeyword,
        page: currentPage,
        size: pageSize,
        type: TAB_TYPE_MAP[tabIndex],
      })
    );
  };

  const handleOpenAddModal = () => {
    setEditingPartner(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (partner: Partner) => {
    setEditingPartner(partner);
    setIsModalOpen(true);
  };

  const handleSave = async (data: PartnerPayload) => {
    if (editingPartner) {
      await dispatch(updatePartner({ id: editingPartner.id, data }));
    } else {
      await dispatch(createPartner(data));
      setCurrentPage(1);
    }

    dispatch(fetchPartners({ keyword: searchKeyword, page: currentPage, size: pageSize }));
    setIsModalOpen(false);
    setEditingPartner(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this partner?')) {
      try {
        await dispatch(deletePartner(id));

        const isLastItemOnPage = partners.length === 1;
        const shouldGoBack = currentPage > 1 && isLastItemOnPage;
        const pageToFetch = shouldGoBack ? currentPage - 1 : currentPage;

        if (shouldGoBack) {
          setCurrentPage(pageToFetch);
        }

        dispatch(fetchPartners({ keyword: searchKeyword, page: currentPage, size: pageSize }));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return {
    state: {
      partners,
      loading,
      meta,
      tabIndex,
      isModalOpen,
      editingPartner,
    },
    actions: {
      setCurrentPage,
      handleTabChange,
      handleSearch,
      handleRefresh,
      handleOpenAddModal,
      handleOpenEditModal,
      handleSave,
      handleDelete,
      setIsModalOpen,
      setEditingPartner,
    },
  };
};
