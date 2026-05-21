import React, { useState } from 'react';
import {
  Plus,
  Search,
  Layers,
  RefreshCw,
  ClipboardCheck,
  Edit3,
  ArrowRight,
  Image as ImageIcon,
} from 'lucide-react';
import type { Product } from '../inventoryCheckScannerMobileTypes';

interface InventoryTabProps {
  products: Product[];
  onRefreshProducts: () => void;
  onSetTab: (tab: string) => void;
  onSelectProductForScan: (product: Product) => void;
}

export default function InventoryTab({
  products,
  onRefreshProducts,
  onSetTab,
  onSelectProductForScan,
}: InventoryTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductSku, setNewProductSku] = useState('');
  const [newProductSystemQty, setNewProductSystemQty] = useState(10);
  const [newProductImageUrl, setNewProductImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search filter
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductSku) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProductName,
          sku: newProductSku.toUpperCase().trim(),
          systemQty: newProductSystemQty,
          imageUrl: newProductImageUrl,
        }),
      });

      if (res.ok) {
        onRefreshProducts();
        setShowAddModal(false);
        setNewProductName('');
        setNewProductSku('');
        setNewProductSystemQty(10);
        setNewProductImageUrl('');
      } else {
        const err = await res.json();
        alert(err.error || 'Không thể khởi tạo mã sản phẩm này');
      }
    } catch (e) {
      alert('Lỗi kết nối máy chủ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSystemQty = async (sku: string, currentQty: number) => {
    const newQtyStr = prompt(
      `Cập nhật số lượng Hệ Thống ban đầu cho SKU ${sku}:`,
      currentQty.toString()
    );
    if (newQtyStr === null) return;
    const newQty = parseInt(newQtyStr, 10);
    if (isNaN(newQty)) return;

    try {
      const res = await fetch(`/api/products/${sku}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemQty: newQty }),
      });
      if (res.ok) {
        onRefreshProducts();
      }
    } catch (err) {
      alert('Không thể lưu thay đổi');
    }
  };

  const handleSelectToScan = (product: Product) => {
    onSelectProductForScan(product);
    onSetTab('scan');
  };

  // Quick state calculators
  const totalItems = products.length;
  const checkedItems = products.filter((p) => p.checked).length;
  const uncheckedItems = products.filter((p) => !p.checked).length;
  const discrepancyItems = products.filter((p) => p.checked && p.status !== 'matched').length;

  return (
    <div className="space-y-6">
      {/* Dashboard metrics overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-neutral-100 rounded-xl text-neutral-500">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">
              Tổng Mặt Hàng
            </span>
            <span className="text-xl font-black text-neutral-900">{totalItems}</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">
              Đã Kiểm Kê
            </span>
            <span className="text-xl font-black text-neutral-900">
              {checkedItems}{' '}
              <span className="text-xs font-semibold text-neutral-400">/ {totalItems}</span>
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">
              Chưa Kiểm Kê
            </span>
            <span className="text-xl font-black text-neutral-900">{uncheckedItems}</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">
              Mã Lệch Kho
            </span>
            <span className="text-xl font-black text-neutral-900">{discrepancyItems}</span>
          </div>
        </div>
      </div>

      {/* Action triggers and filter inputs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Tìm theo sản phẩm, mã SKU sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-neutral-700 placeholder-neutral-400"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-sm active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* Grid displays */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className={`rounded-2xl p-4 border transition-all flex gap-4 bg-white ${
              p.checked
                ? 'border-neutral-200 hover:border-neutral-300'
                : 'border-neutral-200 bg-neutral-50/50 hover:bg-white hover:border-neutral-300'
            }`}
          >
            {/* Embedded illustration */}
            <div className="w-16 h-16 md:w-18 md:h-18 rounded-xl bg-neutral-100 border border-neutral-200 shrink-0 overflow-hidden flex items-center justify-center text-neutral-400">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-5 h-5 text-neutral-300" />
              )}
            </div>

            {/* Product description content */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 space-y-1">
              <div className="space-y-0.5">
                <div className="flex items-start justify-between gap-2">
                  <h4
                    className="font-bold text-neutral-900 text-[13px] md:text-sm tracking-tight truncate"
                    title={p.name}
                  >
                    {p.name}
                  </h4>
                  {p.checked ? (
                    p.status === 'matched' ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full shrink-0">
                        Khớp
                      </span>
                    ) : p.status === 'reported' ? (
                      <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold rounded-full shrink-0">
                        Hỏng/Mất
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold rounded-full shrink-0">
                        Lệch
                      </span>
                    )
                  ) : (
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 border border-neutral-200 text-[10px] font-bold rounded-full shrink-0">
                      Chưa Kiểm
                    </span>
                  )}
                </div>
                <p className="font-mono text-[11px] text-neutral-400 font-semibold uppercase">
                  {p.sku}
                </p>
              </div>

              {/* Counts section */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 block uppercase tracking-wider">
                      Hệ Thống
                    </span>
                    <button
                      onClick={() => handleEditSystemQty(p.sku, p.systemQty)}
                      className="text-neutral-800 hover:text-blue-600 transition flex items-center gap-1 font-extrabold"
                      title="Click để sửa số lượng hệ thống"
                    >
                      {p.systemQty}
                      <Edit3 className="w-3 h-3 text-neutral-300 pointer-events-none" />
                    </button>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 block uppercase tracking-wider">
                      Thực Tế
                    </span>
                    <span
                      className={`font-black ${p.physicalQty === null ? 'text-neutral-300 italic' : 'text-neutral-900'}`}
                    >
                      {p.physicalQty !== null ? p.physicalQty : '--'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectToScan(p)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white transition rounded-lg text-[11px] font-bold flex items-center gap-1 shrink-0"
                >
                  Kiểm Kê
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-neutral-200">
            <Layers className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-800">
              Không tìm thấy sản phẩm phù hợp
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">
              Nhấp vào "Thêm Sản Phẩm Mới" để tạo sản phẩm của riêng bạn.
            </p>
          </div>
        )}
      </section>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4 border border-neutral-105 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-lg text-neutral-900">Thêm Mã Sản Phẩm Mới Vào Kho</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-600 font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1 block">
                  Tên Sản Phẩm *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bàn phím cơ Keychron K2 Pro"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full h-11 px-3.5 bg-neutral-100 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-neutral-800 placeholder-neutral-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-500 mb-1 block">
                    Mã SKU / Barcode *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: KEYC-K2PRO-003"
                    value={newProductSku}
                    onChange={(e) => setNewProductSku(e.target.value)}
                    className="w-full h-11 px-3.5 bg-neutral-100 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-mono uppercase font-bold text-neutral-800 placeholder-neutral-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-500 mb-1 block">
                    Số Hệ Thống Ban Đầu
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProductSystemQty}
                    onChange={(e) => setNewProductSystemQty(parseInt(e.target.value) || 0)}
                    className="w-full h-11 px-3.5 bg-neutral-100 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-black text-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-500 mb-1 block">
                  Liên kết ảnh sản phẩm (Tùy chọn)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newProductImageUrl}
                  onChange={(e) => setNewProductImageUrl(e.target.value)}
                  className="w-full h-11 px-3.5 bg-neutral-100 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-neutral-800 placeholder-neutral-400"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-neutral-500 hover:bg-neutral-100 rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg"
                >
                  {isSubmitting ? 'Đang thêm...' : 'Khởi tạo sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
