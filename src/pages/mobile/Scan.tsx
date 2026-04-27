import React from 'react';

interface ScannedData {
  lpn: string;
  productName: string;
  quantity: number;
  unit: string;
  batch: string;
}

const LPNScannerPage: React.FC = () => {
  const scannedInfo: ScannedData = {
    lpn: 'LPN-98234-AX',
    productName: 'Màn hình Dell UltraSharp 27" 4K',
    quantity: 12,
    unit: 'Cái',
    batch: 'BN-2024-0512',
  };

  return (
    <div className="bg-wms-bg min-h-screen font-sans text-wms-text-main selection:bg-wms-primary/20 pb-28">
      <style>{`
        .scanner-overlay {
          background: rgba(0, 0, 0, 0.4);
          clip-path: polygon(0% 0%, 0% 100%, 15% 100%, 15% 15%, 85% 15%, 85% 85%, 15% 85%, 15% 100%, 100% 100%, 100% 0%);
        }
        .scanner-line {
          height: 2px;
          background: var(--color-wms-primary, #3b82f6);
          box-shadow: 0 0 8px 2px rgba(59, 130, 246, 0.5);
          animation: scan 3s ease-in-out infinite;
        }
        @keyframes scan {
          0%, 100% { top: 15%; }
          50% { top: 85%; }
        }
      `}</style>

      {/* TopAppBar */}
      <header className="flex items-center justify-between px-5 py-4 w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-wms-border-color shadow-sm">
        <div className="flex items-center gap-3">
          <button className="text-wms-text-main w-9 h-9 active:opacity-70 bg-wms-bg rounded-full flex items-center justify-center transition-colors">
            <i className="fa-solid fa-bars text-[18px]"></i>
          </button>
          <h1 className="font-bold text-wms-text-main text-[17px]">Quét mã LPN</h1>
        </div>
        <button className="text-wms-text-main w-9 h-9 active:opacity-70 bg-wms-bg rounded-full flex items-center justify-center transition-colors">
          <i className="fa-regular fa-user text-[18px]"></i>
        </button>
      </header>

      <main className="pt-6 px-5 max-w-md mx-auto">
        {/* Viewfinder Section (Khu vực Camera) */}
        <section className="relative rounded-2xl overflow-hidden aspect-square bg-black shadow-lg">
          {/* Simulated Camera Feed */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center opacity-80"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop')",
            }}
          ></div>

          {/* Overlays */}
          <div className="absolute inset-0 scanner-overlay"></div>
          <div className="absolute top-[15%] left-[15%] w-[70%] h-[70%] border border-wms-primary/50 rounded-xl">
            {/* Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-wms-primary rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-wms-primary rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-wms-primary rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-wms-primary rounded-br-xl"></div>

            {/* Animated Scan Line */}
            <div className="absolute left-0 w-full scanner-line"></div>
          </div>

          {/* Camera Controls */}
          <div className="absolute bottom-6 left-0 w-full flex justify-center gap-6">
            <button className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center active:scale-90 transition-transform">
              <i className="fa-solid fa-bolt text-[18px]"></i>
            </button>
            <button className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center active:scale-90 transition-transform">
              <i className="fa-solid fa-magnifying-glass-plus text-[18px]"></i>
            </button>
          </div>
        </section>

        {/* Scanned Info Card */}
        <section className="mt-6">
          <div className="bg-white rounded-2xl p-4.5 shadow-sm border border-wms-border-color transition-all">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-xl bg-wms-primary/10 flex items-center justify-center text-wms-primary">
                <i className="fa-solid fa-boxes-stacked text-[20px]"></i>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide font-bold text-wms-muted mb-0.5">
                  {scannedInfo.lpn}
                </p>
                <h2 className="text-[16px] font-bold text-wms-text-main leading-tight">
                  Chi tiết kiện hàng
                </h2>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="flex justify-between items-start border-b border-wms-border-color pb-3">
                <span className="text-[13px] text-wms-muted font-medium">Tên sản phẩm</span>
                <span className="text-[13px] font-semibold text-wms-text-main text-right max-w-[60%]">
                  {scannedInfo.productName}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] text-wms-muted uppercase font-bold tracking-wide">
                    Số lượng
                  </span>
                  <p className="text-[18px] font-bold text-wms-primary">
                    {scannedInfo.quantity}{' '}
                    <span className="text-[14px] font-semibold">{scannedInfo.unit}</span>
                  </p>
                </div>
                <div className="space-y-1 border-l border-wms-border-color pl-4">
                  <span className="text-[11px] text-wms-muted uppercase font-bold tracking-wide">
                    Số lô
                  </span>
                  <p className="text-[14px] font-bold text-wms-text-main mt-0.5">
                    {scannedInfo.batch}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="mt-6 space-y-3">
          <button className="w-full bg-wms-primary hover:bg-wms-primary-hover text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-[0_4px_15px_rgba(59,130,246,0.3)] active:scale-[0.98] transition-all">
            <i className="fa-solid fa-qrcode text-[20px]"></i>
            Tiếp tục quét mã LPN
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white border border-red-200 text-red-500 py-3 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 active:bg-red-50 transition-all shadow-sm">
              <i className="fa-solid fa-triangle-exclamation text-[16px]"></i>
              Báo lỗi tem
            </button>
            <button className="bg-white border border-wms-border-color text-wms-text-main py-3 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 active:bg-gray-50 transition-all shadow-sm">
              <i className="fa-solid fa-keyboard text-[16px]"></i>
              Nhập tay
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LPNScannerPage;
