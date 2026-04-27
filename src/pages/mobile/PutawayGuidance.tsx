import React from 'react';

interface ProductInfo {
  name: string;
  sku: string;
  quantity: number;
  unit: string;
}

interface PutawayLocation {
  shelfCode: string;
  description: string;
}

const PutawayGuidance: React.FC = () => {
  const product: ProductInfo = {
    name: 'Mạch điều khiển X-200',
    sku: 'MC-200-BL-01',
    quantity: 24,
    unit: 'THÙNG',
  };

  const targetLocation: PutawayLocation = {
    shelfCode: 'A-01-02',
    description: 'Di chuyển đến kệ và quét mã QR dán trên kệ để xác nhận',
  };

  return (
    <div className="bg-wms-bg min-h-screen font-sans text-wms-text-main flex flex-col">
      {/* CSS cho Scanner Frame & Animation */}
      <style>{`
        .scanner-frame {
          background: 
            linear-gradient(to right, var(--color-wms-primary, #3b82f6) 4px, transparent 4px) 0 0,
            linear-gradient(to right, var(--color-wms-primary, #3b82f6) 4px, transparent 4px) 0 100%,
            linear-gradient(to left, var(--color-wms-primary, #3b82f6) 4px, transparent 4px) 100% 0,
            linear-gradient(to left, var(--color-wms-primary, #3b82f6) 4px, transparent 4px) 100% 100%,
            linear-gradient(to bottom, var(--color-wms-primary, #3b82f6) 4px, transparent 4px) 0 0,
            linear-gradient(to bottom, var(--color-wms-primary, #3b82f6) 4px, transparent 4px) 100% 0,
            linear-gradient(to top, var(--color-wms-primary, #3b82f6) 4px, transparent 4px) 0 100%,
            linear-gradient(to top, var(--color-wms-primary, #3b82f6) 4px, transparent 4px) 100% 100%;
          background-repeat: no-repeat;
          background-size: 30px 30px;
        }
      `}</style>

      {/* TopAppBar */}
      <header className="flex items-center justify-between px-5 py-4 w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-wms-border-color shadow-sm">
        <button className="text-wms-text-main w-9 h-9 active:opacity-70 bg-wms-bg rounded-full flex items-center justify-center transition-colors">
          <i className="fa-solid fa-arrow-left text-[16px]"></i>
        </button>
        <h1 className="font-bold text-wms-text-main text-[17px]">Cất hàng (Putaway)</h1>
        <button className="text-red-500 w-9 h-9 active:opacity-70 bg-red-50 rounded-full flex items-center justify-center transition-colors">
          <i className="fa-solid fa-circle-exclamation text-[18px]"></i>
        </button>
      </header>

      <main className="flex-1 flex flex-col px-5 pt-6 pb-8 max-w-md mx-auto w-full">
        {/* Target Location Card (Highlight Box) */}
        <section className="bg-wms-primary text-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-md relative overflow-hidden">
          {/* Vòng tròn trang trí nền */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <p className="text-[12px] uppercase font-bold tracking-widest text-white/80 mb-2 relative z-10">
            Vị trí chỉ định
          </p>
          <h2 className="text-[44px] font-black tracking-tight leading-none mb-1 relative z-10 drop-shadow-sm">
            {targetLocation.shelfCode}
          </h2>
          <p className="text-[13px] text-white/90 text-center max-w-[85%] mt-3 font-medium relative z-10">
            {targetLocation.description}
          </p>
        </section>

        {/* QR Scanner Area */}
        <section className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="w-56 h-56 scanner-frame rounded-2xl relative flex items-center justify-center bg-white shadow-sm border border-wms-border-color/50">
            <div className="w-48 h-48 bg-wms-bg/50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-wms-border-color">
              <i className="fa-solid fa-qrcode text-[48px] text-wms-muted mb-3 opacity-50"></i>
              <span className="text-[12px] font-bold text-wms-muted w-2/3 text-center opacity-80">
                Quét mã kệ để xác nhận
              </span>
            </div>
          </div>
        </section>

        {/* Product Info Card */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-wms-border-color mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-wms-bg border border-wms-border-color flex items-center justify-center">
              <i className="fa-solid fa-boxes-stacked text-wms-muted text-[20px]"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] font-bold text-wms-text-main leading-tight">
                {product.name}
              </h3>
              <p className="text-[12px] font-medium text-wms-muted mt-1">SKU: {product.sku}</p>
              <div className="mt-1.5 inline-flex items-center px-2 py-0.5 bg-wms-bg border border-wms-border-color text-wms-text-main rounded text-[11px] font-bold">
                SL: {product.quantity} {product.unit}
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <button
            className="w-full h-14 bg-gray-100 text-gray-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-gray-200 transition-all"
            disabled
          >
            <i className="fa-solid fa-circle-check text-[20px]"></i>
            Xác nhận Vị trí
          </button>

          <button className="w-full h-14 border-2 border-wms-primary text-wms-primary bg-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-wms-primary/5 active:scale-[0.98] transition-all">
            <i className="fa-solid fa-qrcode text-[18px]"></i>
            Quét lại mã LPN
          </button>
        </div>
      </main>
    </div>
  );
};

export default PutawayGuidance;
