import React, { useState } from 'react';

const receiptDetail = {
  receiptCode: '#RCV-2604-001',
  supplier: 'Global Logistics Co.',
  totalItems: 3,
  items: [
    {
      id: 1,
      name: 'Màn hình Dell UltraSharp 27" 4K',
      sku: 'DELL-U2723QE',
      expectedQty: 12,
      countedQty: 0,
      unit: 'Cái',
      status: 'pending', // pending, printed
    },
    {
      id: 2,
      name: 'Bàn phím cơ Keychron K8 Pro',
      sku: 'KEY-K8P-BL',
      expectedQty: 20,
      countedQty: 20,
      unit: 'Hộp',
      status: 'printed',
    },
    {
      id: 3,
      name: 'Chuột không dây Logitech MX Master 3S',
      sku: 'LOGI-MX3S-GR',
      expectedQty: 15,
      countedQty: 5,
      unit: 'Cái',
      status: 'pending',
    },
  ],
};

const CountingAndLabeling: React.FC = () => {
  const [items, setItems] = useState(receiptDetail.items);

  // Hàm tăng giảm số lượng đếm
  const handleQuantityChange = (id: number, delta: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.countedQty + delta);
          return { ...item, countedQty: newQty };
        }
        return item;
      })
    );
  };

  return (
    <div className="bg-wms-bg min-h-screen font-sans text-wms-text-main pb-24">
      {/* TopAppBar */}
      <header className="flex items-center justify-between px-5 py-4 w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-wms-border-color shadow-sm">
        <div className="flex items-center gap-3">
          <button className="text-wms-text-main w-9 h-9 active:opacity-70 bg-wms-bg rounded-full flex items-center justify-center transition-colors">
            <i className="fa-solid fa-arrow-left text-[16px]"></i>
          </button>
          <h1 className="font-bold text-wms-text-main text-[17px]">Kiểm đếm & Tạo tem</h1>
        </div>
        <button className="text-wms-primary w-9 h-9 active:opacity-70 bg-wms-primary/10 rounded-full flex items-center justify-center transition-colors">
          <i className="fa-solid fa-print text-[16px]"></i>
        </button>
      </header>

      <main className="px-5 pt-6 max-w-md mx-auto">
        {/* Receipt Summary Card */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-wms-border-color mb-6 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-wms-primary font-bold text-[14px]">
              {receiptDetail.receiptCode}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-md">
              Đang xử lý
            </span>
          </div>
          <h2 className="text-[16px] font-bold text-wms-text-main">{receiptDetail.supplier}</h2>
          <div className="flex items-center gap-2 mt-1 text-[13px] text-wms-muted font-medium">
            <i className="fa-solid fa-boxes-stacked text-[14px]"></i>
            Tổng mặt hàng: {receiptDetail.totalItems} SKUs
          </div>
        </section>

        {/* List of Items to Count */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-wms-text-main">Danh sách hàng hóa</h3>
          <span className="text-[12px] font-medium text-wms-muted">
            Đã in: {items.filter((i) => i.status === 'printed').length}/{items.length}
          </span>
        </div>

        <section className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-4.5 shadow-sm border transition-all ${
                item.status === 'printed'
                  ? 'border-green-200 bg-green-50/30'
                  : 'border-wms-border-color'
              }`}
            >
              {/* Product Info */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-3">
                  <h4 className="text-[14px] font-bold text-wms-text-main leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-[12px] text-wms-muted font-medium mt-1">SKU: {item.sku}</p>
                </div>
                {item.status === 'printed' && (
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-check text-[12px]"></i>
                  </div>
                )}
              </div>

              {/* Counting Area */}
              <div className="bg-wms-bg rounded-xl p-3 flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase font-bold text-wms-muted mb-0.5">
                    Cần nhập
                  </span>
                  <span className="text-[15px] font-bold text-wms-text-main">
                    {item.expectedQty} <span className="text-[12px]">{item.unit}</span>
                  </span>
                </div>

                {/* Stepper / Counter */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    disabled={item.status === 'printed' || item.countedQty === 0}
                    className="w-8 h-8 bg-white border border-wms-border-color rounded-lg flex items-center justify-center text-wms-text-main active:scale-95 disabled:opacity-50"
                  >
                    <i className="fa-solid fa-minus text-[12px]"></i>
                  </button>
                  <div className="w-12 text-center text-[16px] font-bold text-wms-primary">
                    {item.countedQty}
                  </div>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    disabled={item.status === 'printed'}
                    className="w-8 h-8 bg-white border border-wms-border-color rounded-lg flex items-center justify-center text-wms-text-main active:scale-95 disabled:opacity-50"
                  >
                    <i className="fa-solid fa-plus text-[12px]"></i>
                  </button>
                </div>
              </div>

              {/* Action: Generate QR / Print */}
              {item.status === 'pending' ? (
                <button className="w-full bg-wms-primary hover:bg-wms-primary-hover text-white py-3 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all">
                  <i className="fa-solid fa-qrcode text-[16px]"></i>
                  Tạo mã LPN & In tem
                </button>
              ) : (
                <button className="w-full bg-white border border-wms-border-color text-wms-text-main py-3 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 active:bg-gray-50 transition-all">
                  <i className="fa-solid fa-rotate-right text-[16px]"></i>
                  In lại tem
                </button>
              )}
            </div>
          ))}
        </section>

        {/* Finish Receipt Button */}
        <button className="mt-8 w-full bg-wms-text-main text-white py-4 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all">
          <i className="fa-solid fa-clipboard-check text-[18px]"></i>
          Hoàn tất Kiểm đếm phiếu
        </button>
      </main>
    </div>
  );
};

export default CountingAndLabeling;
