import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAllPartners } from '../partners/partnerThunks';
import { fetchAllProducts } from '../products/productThunks';
import { fetchAvailableLocations } from '../storageLocation/storageLocationThunks';
import { confirmReceipt, createReceipt, fetchReceipts, scanReceiptImage } from './inventoryReceiptThunks';
import { clearOcrResult } from './inventoryReceiptSlice';
import {
  TAB_STATUS_MAP,
  type InventoryReceipt,
  type InventoryReceiptPayload,
} from './inventoryReceiptTypes';

export const useInventoryReceipt = () => {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { receipts, loading, meta, ocrLoading, ocrResult, ocrError } = useAppSelector(
    (state) => state.inventoryReceipts
  );
  const { products } = useAppSelector((state) => state.products);
  const { partners } = useAppSelector((state) => state.partners);

  // State for search and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Local State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedReceipt, setSelectedReceipt] = useState<InventoryReceipt | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Ref để track modal đang mở (tránh gọi lại clearOcrResult không cần thiết)
  const isModalOpenRef = useRef(isModalOpen);
  isModalOpenRef.current = isModalOpen;

  // Fetch initial data
  useEffect(() => {
    dispatch(
      fetchReceipts({
        keyword: searchKeyword,
        page: currentPage,
        size: pageSize,
        status: TAB_STATUS_MAP[tabIndex],
      })
    );
    dispatch(fetchAllProducts());
    dispatch(fetchAllPartners());
    dispatch(fetchAvailableLocations());
  }, [currentPage, dispatch, pageSize, searchKeyword, tabIndex]);

  // Tab change handler
  const handleTabChange = (index: number) => {
    setTabIndex(index);
    setCurrentPage(1);
    setSearchKeyword('');
  };

  // Search handler
  const handleSearch = (keyword: string) => {
    setCurrentPage(1);
    setSearchKeyword(keyword);
  };

  // Create receipt handler
  const handleCreateReceipt = async (data: InventoryReceiptPayload) => {
    try {
      const cleanedData = {
        ...data,
        details: data.details.map((d) => ({
          ...d,
          expiryDate: d.expiryDate && d.expiryDate.trim() !== '' ? d.expiryDate : null,
        })),
      };
      await dispatch(createReceipt(cleanedData)).unwrap();
      setIsModalOpen(false);
      // Xóa OCR result sau khi tạo phiếu thành công
      dispatch(clearOcrResult());
    } catch (error) {
      console.error('Failed to create receipt:', error);
    }
  };

  // Confirm receipt handler
  const handleConfirm = (id: number) => {
    if (
      window.confirm(
        'Bạn có chắc chắn muốn xác nhận nhập kho cho phiếu này? Hệ thống sẽ tự động tăng tồn kho tương ứng.'
      )
    ) {
      dispatch(confirmReceipt(id));
      setIsDetailModalOpen(false);
      setSelectedReceipt(null);
    }
  };

  /**
   * Xử lý khi người dùng chọn ảnh để quét OCR.
   * Đọc file thành base64 rồi dispatch thunk scanReceiptImage.
   */
  const handleScanImage = async (file: File) => {
    return new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;
        // Tách phần base64 ra khỏi data URI (vd: "data:image/jpeg;base64,...")
        const base64 = dataUrl.split(',')[1];
        const mimeType = file.type || 'image/jpeg';

        await dispatch(scanReceiptImage({ imageBase64: base64, mimeType }));
        resolve();
      };
      reader.readAsDataURL(file);
    });
  };

  /**
   * Xóa kết quả OCR (khi đóng modal hoặc người dùng muốn nhập tay).
   */
  const handleClearOcr = () => {
    dispatch(clearOcrResult());
  };

  // Khi modal đóng, clear OCR result
  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(clearOcrResult());
  };

  return {
    state: {
      loading,
      meta,
      products,
      partners,
      isModalOpen,
      tabIndex,
      selectedReceipt,
      isDetailModalOpen,
      receipts,
      // OCR state
      ocrLoading,
      ocrResult,
      ocrError,
    },
    actions: {
      setCurrentPage,
      handleSearch,
      handleTabChange,
      setIsModalOpen,
      setSelectedReceipt,
      setIsDetailModalOpen,
      handleCreateReceipt,
      handleConfirm,
      // OCR actions
      handleScanImage,
      handleClearOcr,
      handleCloseModal,
    },
  };
};
