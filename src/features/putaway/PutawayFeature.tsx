import React from 'react';
import { Link } from 'react-router-dom';
import { usePutaway } from './usePutaway';

export const PutawayFeature: React.FC = () => {
  const { state, actions, lpnInputRef, shelfInputRef } = usePutaway();

  return (
    <div className="bg-wms-bg min-h-screen font-sans text-wms-text-main flex flex-col">
      {/* TopAppBar */}
      <header className="flex items-center justify-between px-5 py-4 w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-wms-border-color shadow-sm">
        <div className="flex items-center gap-3">
          {state.step !== 'scan_lpn' && state.step !== 'success' ? (
            <button
              onClick={actions.handleBack}
              className="text-wms-text-main w-9 h-9 active:opacity-70 bg-wms-bg rounded-full flex items-center justify-center transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-[16px]"></i>
            </button>
          ) : (
            <Link
              to="/mobile/tasks"
              className="text-wms-text-main w-9 h-9 active:opacity-70 bg-wms-bg rounded-full flex items-center justify-center transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-[16px]"></i>
            </Link>
          )}
          <div>
            <h1 className="font-bold text-wms-text-main text-[17px] leading-tight">
              Cất hàng (Putaway)
            </h1>
            {state.completedCount > 0 && (
              <p className="text-[11px] text-wms-primary font-semibold -mt-0.5">
                {state.completedCount} kiện đã cất xong
              </p>
            )}
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5">
          {(['scan_lpn', 'show_guidance', 'scan_shelf'] as const).map((s, i) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                state.step === 'success'
                  ? 'w-2 bg-green-500'
                  : state.step === s
                    ? 'w-5 bg-wms-primary'
                    : i < (['scan_lpn', 'show_guidance', 'scan_shelf'] as const).indexOf(state.step)
                      ? 'w-2 bg-wms-primary/40'
                      : 'w-2 bg-wms-border-color'
              }`}
            />
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col px-5 pt-6 pb-8 max-w-md mx-auto w-full">
        {/* ── Step 1: Scan LPN ── */}
        {state.step === 'scan_lpn' && (
          <div className="flex flex-col gap-5">
            {/* Scanner area */}
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-black shadow-lg">
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center opacity-70"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop')",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  clipPath:
                    'polygon(0% 0%, 0% 100%, 15% 100%, 15% 15%, 85% 15%, 85% 85%, 15% 85%, 15% 100%, 100% 100%, 100% 0%)',
                }}
              />
              <div className="absolute top-[15%] left-[15%] w-[70%] h-[70%] border border-wms-primary/50 rounded-xl">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-wms-primary rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-wms-primary rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-wms-primary rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-wms-primary rounded-br-xl" />
              </div>
              <div className="absolute inset-x-0 bottom-6 flex justify-center">
                <p className="text-white/80 text-[12px] font-medium bg-black/30 px-3 py-1 rounded-full">
                  Hướng camera vào mã LPN trên kiện hàng
                </p>
              </div>
            </div>

            {/* Manual input */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-wms-border-color">
              <p className="text-[11px] uppercase font-bold text-wms-muted mb-2 tracking-wide">
                Hoặc nhập thủ công
              </p>
              <div className="flex gap-2">
                <input
                  ref={lpnInputRef}
                  type="text"
                  placeholder="VD: LPN-250101-001"
                  value={state.lpnInput}
                  onChange={(e) => actions.setLpnInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && actions.handleScanLpn()}
                  className="flex-1 py-2.5 px-3 border border-wms-border-color rounded-xl text-[13px] text-wms-text-main placeholder:text-wms-muted outline-none focus:border-wms-primary transition-colors"
                />
                <button
                  onClick={actions.handleScanLpn}
                  disabled={!state.lpnInput.trim() || state.loading}
                  className="px-4 bg-wms-primary text-white rounded-xl font-bold text-[13px] disabled:opacity-50 active:scale-95 transition-all"
                >
                  {state.loading ? (
                    <i className="fa-solid fa-circle-notch fa-spin" />
                  ) : (
                    <i className="fa-solid fa-search" />
                  )}
                </button>
              </div>

              {state.error && (
                <div className="mt-3 flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl">
                  <i className="fa-solid fa-triangle-exclamation text-red-500 text-[13px] mt-0.5" />
                  <p className="text-[12px] text-red-600">{state.error}</p>
                </div>
              )}
            </div>

            {/* Hint card */}
            <div className="flex items-start gap-3 p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
              <i className="fa-solid fa-circle-info text-blue-500 text-[16px] mt-0.5 shrink-0" />
              <p className="text-[12px] text-blue-700 leading-relaxed">
                Quét mã LPN dán trên kiện hàng vừa được kiểm đếm để hệ thống gợi ý vị trí cất hàng
                tối ưu.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 2: Show Guidance ── */}
        {state.step === 'show_guidance' && state.suggestion && (
          <div className="flex flex-col gap-5">
            {/* Target location card */}
            <section className="bg-wms-primary text-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <p className="text-[12px] uppercase font-bold tracking-widest text-white/80 mb-2 relative z-10">
                Vị trí chỉ định
              </p>
              <h2 className="text-[48px] font-black tracking-tight leading-none mb-1 relative z-10 drop-shadow-sm">
                {state.suggestion.suggestedLocationCode}
              </h2>
              <p className="text-[13px] text-white/90 text-center max-w-[85%] mt-3 font-medium relative z-10">
                Di chuyển đến kệ và quét mã QR để xác nhận
              </p>
            </section>

            {/* Product info */}
            <section className="bg-white rounded-2xl p-4 shadow-sm border border-wms-border-color">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-wms-bg border border-wms-border-color flex items-center justify-center">
                  <i className="fa-solid fa-boxes-stacked text-wms-muted text-[20px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-wms-muted font-bold uppercase tracking-wide mb-0.5">
                    Kiện hàng
                  </p>
                  <h3 className="text-[14px] font-bold text-wms-text-main leading-tight truncate">
                    {state.suggestion.productName}
                  </h3>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 bg-wms-bg border border-wms-border-color rounded text-[11px] font-bold text-wms-text-main">
                    <i className="fa-solid fa-tag text-wms-muted text-[10px]" />
                    {state.suggestion.lpnCode}
                  </div>
                </div>
              </div>
            </section>

            {/* Map hint */}
            <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
              <i className="fa-solid fa-route text-amber-600 text-[16px] mt-0.5 shrink-0" />
              <p className="text-[12px] text-amber-800 leading-relaxed">
                Hệ thống đã chọn vị trí tối ưu dựa trên cùng loại sản phẩm đã có sẵn tại kệ và trình
                tự đường đi ngắn nhất.
              </p>
            </div>

            {/* Action */}
            <button
              onClick={actions.handleProceedToScan}
              className="w-full h-14 bg-wms-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-wms-primary-hover active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(59,130,246,0.3)]"
            >
              <i className="fa-solid fa-qrcode text-[20px]" />
              Xác nhận & Quét mã kệ
            </button>
          </div>
        )}

        {/* ── Step 3: Scan Shelf ── */}
        {state.step === 'scan_shelf' && state.suggestion && (
          <div className="flex flex-col gap-5">
            {/* Target reminder */}
            <div className="flex items-center gap-3 p-4 bg-wms-primary/5 border border-wms-primary/20 rounded-2xl">
              <div className="w-11 h-11 rounded-xl bg-wms-primary/10 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-location-dot text-wms-primary text-[18px]" />
              </div>
              <div>
                <p className="text-[11px] text-wms-muted font-bold uppercase tracking-wide">
                  Cần quét kệ
                </p>
                <p className="text-[20px] font-black text-wms-primary leading-tight">
                  {state.suggestion.suggestedLocationCode}
                </p>
              </div>
            </div>

            {/* QR scanner area */}
            <div className="flex flex-col items-center py-6">
              <div
                className="w-52 h-52 rounded-2xl relative flex items-center justify-center bg-white shadow-sm border border-wms-border-color/50"
                style={{
                  background: `
                    linear-gradient(to right, #3b82f6 4px, transparent 4px) 0 0,
                    linear-gradient(to right, #3b82f6 4px, transparent 4px) 0 100%,
                    linear-gradient(to left, #3b82f6 4px, transparent 4px) 100% 0,
                    linear-gradient(to left, #3b82f6 4px, transparent 4px) 100% 100%,
                    linear-gradient(to bottom, #3b82f6 4px, transparent 4px) 0 0,
                    linear-gradient(to bottom, #3b82f6 4px, transparent 4px) 100% 0,
                    linear-gradient(to top, #3b82f6 4px, transparent 4px) 0 100%,
                    linear-gradient(to top, #3b82f6 4px, transparent 4px) 100% 100%
                  `,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '30px 30px',
                }}
              >
                <div className="w-44 h-44 bg-wms-bg/50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-wms-border-color">
                  <i className="fa-solid fa-qrcode text-[48px] text-wms-muted mb-3 opacity-50" />
                  <span className="text-[12px] font-bold text-wms-muted w-2/3 text-center opacity-80">
                    Quét mã QR trên kệ
                  </span>
                </div>
              </div>
            </div>

            {/* Manual shelf input */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-wms-border-color">
              <p className="text-[11px] uppercase font-bold text-wms-muted mb-2 tracking-wide">
                Hoặc nhập mã kệ thủ công
              </p>
              <div className="flex gap-2">
                <input
                  ref={shelfInputRef}
                  type="text"
                  placeholder={`VD: ${state.suggestion.suggestedLocationCode}`}
                  value={state.shelfInput}
                  onChange={(e) => {
                    actions.setShelfInput(e.target.value.toUpperCase());
                    if (state.shelfError) actions.handleBack();
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && actions.handleScanShelf()}
                  className="flex-1 py-2.5 px-3 border border-wms-border-color rounded-xl text-[13px] font-mono font-bold text-wms-text-main placeholder:text-wms-muted placeholder:font-normal outline-none focus:border-wms-primary transition-colors"
                />
                <button
                  onClick={actions.handleScanShelf}
                  disabled={!state.shelfInput.trim() || state.confirming}
                  className="px-4 bg-wms-primary text-white rounded-xl font-bold text-[13px] disabled:opacity-50 active:scale-95 transition-all"
                >
                  {state.confirming ? (
                    <i className="fa-solid fa-circle-notch fa-spin" />
                  ) : (
                    <i className="fa-solid fa-check" />
                  )}
                </button>
              </div>

              {state.shelfError && (
                <div className="mt-3 flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl">
                  <i className="fa-solid fa-triangle-exclamation text-red-500 text-[13px] mt-0.5" />
                  <p className="text-[12px] text-red-600">{state.shelfError}</p>
                </div>
              )}

              {state.error && (
                <div className="mt-3 flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl">
                  <i className="fa-solid fa-triangle-exclamation text-red-500 text-[13px] mt-0.5" />
                  <p className="text-[12px] text-red-600">{state.error}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Step 4: Success ── */}
        {state.step === 'success' && state.successData && (
          <div className="flex flex-col items-center gap-5 pt-4">
            {/* Success animation */}
            <div className="w-24 h-24 rounded-3xl bg-green-100 border-2 border-green-300 flex items-center justify-center">
              <i className="fa-solid fa-circle-check text-green-600 text-[44px]" />
            </div>

            <div className="text-center">
              <h2 className="text-[22px] font-black text-wms-text-main mb-1">
                Cất hàng thành công!
              </h2>
              <p className="text-[13px] text-wms-muted">Kiện hàng đã được ghi nhận vào kho</p>
            </div>

            {/* Summary card */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-wms-border-color">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between py-2.5 border-b border-wms-border-color">
                  <span className="text-[12px] text-wms-muted font-medium flex items-center gap-2">
                    <i className="fa-solid fa-tag text-[12px]" />
                    Mã LPN
                  </span>
                  <span className="text-[13px] font-bold font-mono text-wms-primary">
                    {state.successData.lpnCode}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-wms-border-color">
                  <span className="text-[12px] text-wms-muted font-medium flex items-center gap-2">
                    <i className="fa-solid fa-box text-[12px]" />
                    Sản phẩm
                  </span>
                  <span className="text-[13px] font-bold text-wms-text-main max-w-[55%] text-right leading-tight">
                    {state.successData.productName}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <span className="text-[12px] text-wms-muted font-medium flex items-center gap-2">
                    <i className="fa-solid fa-location-dot text-[12px]" />
                    Vị trí đã cất
                  </span>
                  <span className="text-[16px] font-black text-green-600">
                    {state.successData.locationCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Session counter */}
            {state.completedCount > 1 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-wms-bg border border-wms-border-color rounded-full">
                <i className="fa-solid fa-check-double text-wms-primary text-[13px]" />
                <span className="text-[13px] font-bold text-wms-text-main">
                  {state.completedCount} kiện đã cất trong phiên này
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="w-full grid grid-cols-1 gap-3 mt-2">
              <button
                onClick={actions.handleReset}
                className="w-full h-14 bg-wms-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-wms-primary-hover active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(59,130,246,0.3)]"
              >
                <i className="fa-solid fa-qrcode text-[20px]" />
                Cất kiện hàng tiếp theo
              </button>

              <Link
                to="/mobile/tasks"
                className="w-full h-12 border-2 border-wms-text-main/20 text-wms-text-main bg-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-wms-bg active:scale-[0.98] transition-all"
              >
                <i className="fa-solid fa-clipboard-list text-[16px]" />
                Về danh sách nhiệm vụ
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
