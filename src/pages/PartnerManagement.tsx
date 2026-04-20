import React, { useEffect, useState } from 'react';
import AddPartnerModal from '../components/features/partnerManagement/AddPartnerModal';
import FilterPartner from '../components/features/partnerManagement/FilterPartner';
import PartnerTable from '../components/features/partnerManagement/PartnerTable';
import TabNavigation from '../components/features/TabNavigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  createPartner,
  deletePartner,
  fetchPartners,
  type PartnerPayload,
} from '../store/slices/partnerSlice';

const PartnerManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { partners, loading } = useAppSelector((state) => state.partners);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  const handleSave = async (data: PartnerPayload) => {
    await dispatch(createPartner(data));
    setIsModalOpen(false);
  };

  const tableHeads = ['Name', 'Type', 'Phone', 'Email', 'Tax Code', 'Address', 'Actions'];

  const getTabColor = (index: number) => {
    if (index === tabIndex) return '#ffffff';
    const lightness = Math.max(92 - index * 4, 60);
    return `hsl(215, 20%, ${lightness}%)`;
  };

  return (
    <div className="w-full pl-75 pr-10">
      {/* --- PAGE TITLE --- */}
      <div>
        <h1 className="text-[22px] font-semibold mb-1.25">Partner management</h1>
        <p className="text-[13px] text-wms-muted mb-6.25">Manage your suppliers and customers</p>
      </div>

      {/* --- WORK AREA --- */}
      <div className="bg-transparent flex flex-col overflow-x-auto">
        <TabNavigation
          tabs={['All partners', 'Suppliers', 'Customers']}
          activeTabIndex={tabIndex}
          onTabChange={setTabIndex}
          getTabColor={getTabColor}
        />

        {/* Table section */}
        <div className="w-full bg-white rounded-r-2xl rounded-bl-2xl p-6.25 shadow-[0_4px_15px_rgba(0,0,0,0.03)] overflow-x-auto">
          <FilterPartner onActionClick={() => setIsModalOpen(true)} />

          {loading ? (
            <div className="py-10 text-center">Đang tải dữ liệu...</div>
          ) : (
            <PartnerTable
              heads={tableHeads}
              data={partners}
              onDelete={(id) =>
                window.confirm('Delete this partner?') && dispatch(deletePartner(id))
              }
            />
          )}
        </div>
      </div>

      <AddPartnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default PartnerManagement;
