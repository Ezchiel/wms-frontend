import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchReceipts, approveDraftReceipt } from '../inventoryReceipt/inventoryReceiptThunks';
import { fetchAllPartners } from '../partners/partnerThunks';
import { fetchAllProducts } from '../products/productThunks';
import type { Partner } from '../partners/partnerTypes';
import type { InventoryReceipt, ReceiptDetailPayload, InventoryReceiptPayload } from '../inventoryReceipt/inventoryReceiptTypes';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';

export const PendingReceiptsFeature: React.FC = () => {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { receipts, loading, meta } = useAppSelector((state) => state.inventoryReceipts);
  const { partners } = useAppSelector((state) => state.partners);
  const { products } = useAppSelector((state) => state.products);

  const suppliers = partners.filter((p: Partner) => p.type === 'SUPPLIER');

  // Search & Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Review Modal States
  const [selectedReceipt, setSelectedReceipt] = useState<InventoryReceipt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewSupplierId, setReviewSupplierId] = useState<number>(0);
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [reviewDetails, setReviewDetails] = useState<ReceiptDetailPayload[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch function
  const fetchDrafts = () => {
    dispatch(
      fetchReceipts({
        keyword: searchKeyword,
        page: currentPage,
        size: pageSize,
        status: 'DRAFT',
      })
    );
  };

  // Keep a stable ref to fetchDrafts so the WebSocket callback
  // always has access to the latest version without triggering reconnects
  const fetchDraftsRef = useRef(fetchDrafts);
  useEffect(() => {
    fetchDraftsRef.current = fetchDrafts;
  });

  // Fetch initial data whenever search/pagination changes
  useEffect(() => {
    fetchDrafts();
    dispatch(fetchAllPartners());
    dispatch(fetchAllProducts());
  }, [currentPage, pageSize, searchKeyword]);

  // Setup WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    // Build a native WebSocket URL (ws:// or wss://) — avoids SockJS HTTP /ws/info CORS preflight
    const baseUrl = apiBase.replace(/\/api\/?$/, '');
    const wsUrl = baseUrl.replace(/^https/, 'wss').replace(/^http/, 'ws') + `/ws-native?token=${encodeURIComponent(token)}&ngrok-skip-browser-warning=true`;

    console.log('[WebSocket] Connecting to:', wsUrl);

    const stompClient = new Client({
      // Use native WebSocket directly — avoids the SockJS HTTP /info CORS preflight
      webSocketFactory: () => new WebSocket(wsUrl),
      debug: (str) => console.log('[STOMP]', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log('[STOMP] Connected to WebSocket');
      stompClient.subscribe('/topic/drafts', (message) => {
        console.log('[STOMP] Received draft event:', message.body);
        if (message.body === 'new_draft' || message.body === 'approved_draft') {
          // Use ref to always call the latest fetchDrafts without reconnecting
          fetchDraftsRef.current();
          toast.info(
            message.body === 'new_draft'
              ? 'Có phiếu nháp mới được tải lên từ mobile!'
              : 'Một phiếu nháp đã được phê duyệt!'
          );
        }
      });
    };

    stompClient.onStompError = (frame) => {
      console.error('[STOMP] Broker error:', frame.headers['message']);
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open review modal and prefill data
  const handleOpenReview = (receipt: InventoryReceipt) => {
    setSelectedReceipt(receipt);
    setReviewSupplierId(receipt.supplierId || 0);
    setReviewNotes(receipt.notes || '');

    // Map existing details to edit payload
    const details: ReceiptDetailPayload[] = receipt.details.map((d) => ({
      productId: d.productId || 0,
      productNameRaw: d.productNameRaw || '', // Giữ lại tên OCR thô để hiển thị gợi ý
      quantity: d.quantity || 1,
      unitPrice: d.unitPrice || 0,
      batchNo: d.batchNo || '',
      expiryDate: d.expiryDate || '',
      serialNumber: d.serialNumber || '',
    }));

    setReviewDetails(details);
    setIsModalOpen(true);
  };

  const handleCloseReview = () => {
    setSelectedReceipt(null);
    setIsModalOpen(false);
    setReviewDetails([]);
  };

  // Add detail row
  const handleAddRow = () => {
    setReviewDetails([
      ...reviewDetails,
      {
        productId: 0,
        quantity: 1,
        unitPrice: 0,
        batchNo: '',
        expiryDate: '',
        serialNumber: '',
      },
    ]);
  };

  // Remove detail row
  const handleRemoveRow = (index: number) => {
    setReviewDetails(reviewDetails.filter((_, i) => i !== index));
  };

  // Update detail row field
  const handleUpdateRow = (index: number, field: keyof ReceiptDetailPayload, value: any) => {
    const updated = [...reviewDetails];
    updated[index] = { ...updated[index], [field]: value };
    setReviewDetails(updated);
  };

  // Approve draft receipt
  const handleApprove = async () => {
    if (!selectedReceipt) return;
    if (reviewSupplierId === 0) {
      alert('Vui lòng chọn nhà cung cấp!');
      return;
    }
    if (reviewDetails.length === 0) {
      alert('Phiếu nhập phải có ít nhất một dòng hàng!');
      return;
    }
    const hasUnselectedProduct = reviewDetails.some((d) => d.productId === 0);
    if (hasUnselectedProduct) {
      alert('Vui lòng chọn sản phẩm đầy đủ cho toàn bộ các dòng hàng!');
      return;
    }

    const cleanedDetails = reviewDetails.map((d) => ({
      ...d,
      expiryDate: d.expiryDate && d.expiryDate.trim() !== '' ? d.expiryDate : null,
    }));

    const payload: InventoryReceiptPayload = {
      supplierId: reviewSupplierId,
      notes: reviewNotes,
      details: cleanedDetails,
    };

    try {
      setIsSubmitting(true);
      await dispatch(approveDraftReceipt({ id: selectedReceipt.id, payload })).unwrap();
      toast.success('Duyệt và tạo phiếu nhập kho thành công!');
      handleCloseReview();
      fetchDrafts();
    } catch (err: any) {
      toast.error(err || 'Duyệt phiếu nháp thất bại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full pl-75 pr-10 min-h-screen pb-6 font-sans">
      {/* Main Work Area */}
      <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-100 overflow-x-auto">

        {/* Search filter row */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="relative w-72">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[14px]"></i>
            <input
              type="text"
              placeholder="Search by code..."
              value={searchKeyword}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchKeyword(e.target.value);
              }}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="text-[12px] bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 animate-pulse">
            <i className="fa-solid fa-circle text-[8px]"></i>
            <span>Real-time Sync Active</span>
          </div>
        </div>

        {/* Table of Drafts */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-[13px]">
            <i className="fa-solid fa-spinner fa-spin mr-2"></i> Loading pending drafts...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full border-collapse text-[13px] text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-left">
                    <th className="py-3.5 px-4">Receipt Code</th>
                    <th className="py-3.5 px-4">Scanned By</th>
                    <th className="py-3.5 px-4">Scanned At</th>
                    <th className="py-3.5 px-4">Supplier</th>
                    <th className="py-3.5 px-4 text-right">Total Amount</th>
                    <th className="py-3.5 px-4">Notes</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 text-[13px]">
                        No pending draft receipts. Try scanning a delivery note from the mobile app!
                      </td>
                    </tr>
                  ) : (
                    receipts.map((receipt) => (
                      <tr
                        key={receipt.id}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{receipt.receiptCode}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-full text-[11px] font-medium">
                            <i className="fa-solid fa-user-circle text-slate-400"></i>
                            {receipt.scannedBy || receipt.createdBy}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {receipt.scannedAt ? new Date(receipt.scannedAt).toLocaleString() : new Date(receipt.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-medium">
                          {receipt.supplierName ? (
                            receipt.supplierName
                          ) : (
                            <span className="text-red-400 italic">Unmatched</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-slate-900">
                          đ{receipt.totalAmount ? receipt.totalAmount.toLocaleString() : '0'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 max-w-[200px] truncate" title={receipt.notes}>
                          {receipt.notes || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleOpenReview(receipt)}
                            className="mr-2 px-4 py-1 border border-wms-primary rounded-[7px] text-wms-primary hover:bg-wms-primary hover:text-white transition-all cursor-pointer"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {meta && <Pagination meta={meta} onPageChange={setCurrentPage} />}
          </>
        )}
      </div>

      {/* Review Modal */}
      {isModalOpen && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl flex flex-col overflow-hidden max-h-[92vh] border border-slate-100">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4.5 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-file-shield text-blue-500"></i>
                  Review & Approve Draft Receipt
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Source Code: <strong className="font-mono text-slate-600">{selectedReceipt.receiptCode}</strong> | Scanned By: <strong>{selectedReceipt.scannedBy || selectedReceipt.createdBy}</strong>
                </p>
              </div>
              <button
                onClick={handleCloseReview}
                disabled={isSubmitting}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">

              {/* Header Info Section */}
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 text-[13px]">
                  <label className="font-semibold text-slate-600">Supplier <span className="text-red-500">*</span></label>
                  <select
                    value={reviewSupplierId}
                    onChange={(e) => setReviewSupplierId(Number(e.target.value))}
                    className="py-2 px-3 border border-slate-200 rounded-lg outline-none text-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
                  >
                    <option value={0}>-- Select Supplier --</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 text-[13px]">
                  <label className="font-semibold text-slate-600">Notes / Remarks</label>
                  <input
                    type="text"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="py-2 px-3 border border-slate-200 rounded-lg outline-none text-slate-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    placeholder="E.g. Approved delivery note scan corrections"
                  />
                </div>
              </div>

              {/* Items List Table */}
              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-[13px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-slate-500 font-semibold text-left">
                      <th className="p-3 w-1/3">Product <span className="text-red-500">*</span></th>
                      <th className="p-3 w-20 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price (đ)</th>
                      <th className="p-3">Batch No</th>
                      <th className="p-3">Serial No</th>
                      <th className="p-3">Expiry Date</th>
                      <th className="p-3 w-12 text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewDetails.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                          No items in this draft receipt. Add products below.
                        </td>
                      </tr>
                    ) : (
                      reviewDetails.map((item, index) => (
                        <tr key={index} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/20">
                          {/* Product Selection */}
                          <td className="p-3">
                            {/* Hint: tên OCR thô nếu product chưa khớp */}
                            {item.productId === 0 && item.productNameRaw && (
                              <p className="text-[10px] text-amber-600 font-semibold mb-1 flex items-center gap-1">
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                                OCR đọc: "{item.productNameRaw}"
                              </p>
                            )}
                            <select
                              value={item.productId}
                              onChange={(e) => handleUpdateRow(index, 'productId', Number(e.target.value))}
                              className={`w-full py-1.5 px-2 border rounded-lg outline-none text-xs ${item.productId === 0
                                ? 'border-red-300 bg-red-50/10 text-red-600 font-medium'
                                : 'border-slate-200 text-slate-700 bg-white'
                                }`}
                            >
                              <option value={0}>-- Select Product --</option>
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.productName} ({p.productCode})
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Quantity */}
                          <td className="p-3">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateRow(index, 'quantity', Number(e.target.value))}
                              className="w-full py-1.5 px-2 border border-slate-200 rounded-lg outline-none text-center"
                            />
                          </td>

                          {/* Unit Price */}
                          <td className="p-3">
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleUpdateRow(index, 'unitPrice', Number(e.target.value))}
                              className="w-full py-1.5 px-2 border border-slate-200 rounded-lg outline-none text-right font-mono"
                            />
                          </td>

                          {/* Batch No */}
                          <td className="p-3">
                            <input
                              type="text"
                              value={item.batchNo || ''}
                              onChange={(e) => handleUpdateRow(index, 'batchNo', e.target.value)}
                              className="w-full py-1.5 px-2 border border-slate-200 rounded-lg outline-none"
                              placeholder="Batch#"
                            />
                          </td>

                          {/* Serial No */}
                          <td className="p-3">
                            <input
                              type="text"
                              value={item.serialNumber || ''}
                              onChange={(e) => handleUpdateRow(index, 'serialNumber', e.target.value)}
                              className="w-full py-1.5 px-2 border border-slate-200 rounded-lg outline-none"
                              placeholder="S/N"
                            />
                          </td>

                          {/* Expiry Date */}
                          <td className="p-3">
                            <input
                              type="date"
                              value={item.expiryDate || ''}
                              onChange={(e) => handleUpdateRow(index, 'expiryDate', e.target.value)}
                              className="w-full py-1.5 px-2 border border-slate-200 rounded-lg outline-none text-slate-600"
                            />
                          </td>

                          {/* Delete Action */}
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleRemoveRow(index)}
                              className="text-red-400 hover:text-red-600 active:scale-90 transition-transform"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Footer Add Action */}
                <div className="p-3 bg-slate-50/50 flex justify-start">
                  <button
                    onClick={handleAddRow}
                    className="text-[12px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <i className="fa-solid fa-plus text-[10px]"></i> Add Product Line
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/30 sticky bottom-0 z-10">
              <button
                onClick={handleCloseReview}
                disabled={isSubmitting}
                className="py-2 px-5 rounded-lg text-[13px] font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="py-2 px-5 rounded-lg text-[13px] font-bold bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <i className="fa-solid fa-spinner animate-spin"></i>
                ) : (
                  <i className="fa-solid fa-circle-check"></i>
                )}
                Approve & Create Receipt
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default PendingReceiptsFeature;
