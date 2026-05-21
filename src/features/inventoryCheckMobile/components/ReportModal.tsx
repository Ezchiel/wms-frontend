import { type StockTakeSheet, MOCK_PRODUCTS } from '../inventoryCheckMobileTypes';

interface ReportModalProps {
  sheet: StockTakeSheet;
  onClose: () => void;
}

export default function ReportModal({ sheet, onClose }: ReportModalProps) {
  const totalItems = sheet.items.length;
  const matcheditems = sheet.items.filter((item) => item.actualQty === item.expectedQty);
  const discrepantItems = sheet.items.filter((item) => item.actualQty !== item.expectedQty);

  // Calculate stats
  const accuracyPercent = totalItems > 0 ? Math.round((matcheditems.length / totalItems) * 100) : 0;

  let totalExpected = 0;
  let totalActual = 0;
  let positiveDiff = 0;
  let negativeDiff = 0;

  sheet.items.forEach((item) => {
    const expected = item.expectedQty;
    const actual = item.actualQty ?? 0;
    totalExpected += expected;
    totalActual += actual;

    const diff = actual - expected;
    if (diff > 0) {
      positiveDiff += diff;
    } else if (diff < 0) {
      negativeDiff += Math.abs(diff);
    }
  });

  const totalDiff = positiveDiff + negativeDiff;

  // Helper date renderer
  const formatDate = (isoStr: string | null) => {
    if (!isoStr) return '';
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-md my-8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn">
        {/* Banner header inside card */}
        <div className="bg-slate-900 text-white p-5 shrink-0 relative">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">
                Kết quả báo cáo
              </span>
              <h2 className="text-lg font-black tracking-tight">{sheet.code}</h2>
              <p className="text-[10px] text-slate-300">
                Thực hiện: {formatDate(sheet.completedAt)}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 active:scale-95 transition-all"
              id="report-close-btn"
            >
              <span className="material-symbols-outlined block text-sm">close</span>
            </button>
          </div>

          {/* Quick type metrics details */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-white/10 text-[11px] text-slate-300 font-medium">
            <span>
              Hình thức:{' '}
              <strong className="text-white">
                {sheet.type === 'position'
                  ? 'Theo Vị trí'
                  : sheet.type === 'product'
                    ? 'Theo Sản phẩm'
                    : 'Toàn kho'}
              </strong>
            </span>
            {sheet.zone && (
              <span>
                Khu vực: <strong className="text-white">{sheet.zone}</strong>
              </span>
            )}
            {sheet.rack && (
              <span>
                Dãy: <strong className="text-white">{sheet.rack}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Report Analysis Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 hide-scrollbar">
          {/* Circular/Large metric accuracy indicator */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
            {/* Accuracy Radial Circle representation */}
            <div className="relative shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-slate-100 shadow-xs">
              <svg className="absolute w-full h-full -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-slate-100 fill-none"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className={`fill-none ${accuracyPercent >= 80 ? 'stroke-emerald-500' : 'stroke-amber-500'}`}
                  strokeWidth="4"
                  strokeDasharray="163"
                  strokeDashoffset={163 - (163 * accuracyPercent) / 100}
                />
              </svg>
              <span className="text-xs font-black text-slate-800">{accuracyPercent}%</span>
            </div>

            <div>
              <h3 className="text-xs font-extrabold text-slate-800">Độ chính xác tồn kho</h3>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                Tỷ lệ khớp giữa số liệu đếm số lượng thực tế với số liệu quản lý trên hệ thống.
              </p>
            </div>
          </div>

          {/* Bento summary stats rows */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 bg-slate-50 rounded-xl text-center border border-slate-100/60">
              <p className="text-[9px] uppercase tracking-wide font-extrabold text-slate-400">
                Yêu cầu kiểm
              </p>
              <p className="text-base font-black text-slate-700 font-mono mt-0.5">{totalItems}</p>
              <p className="text-[8px] text-slate-400">mặt hàng</p>
            </div>

            <div className="p-2.5 bg-emerald-50 rounded-xl text-center border border-emerald-100/30">
              <p className="text-[9px] uppercase tracking-wide font-extrabold text-emerald-600">
                Đã khớp
              </p>
              <p className="text-base font-black text-emerald-700 font-mono mt-0.5">
                {matcheditems.length}
              </p>
              <p className="text-[8px] text-emerald-500">{accuracyPercent}% khớp</p>
            </div>

            <div className="p-2.5 bg-rose-50 rounded-xl text-center border border-rose-100/30">
              <p className="text-[9px] uppercase tracking-wide font-extrabold text-rose-500">
                Sai lệch
              </p>
              <p className="text-base font-black text-rose-700 font-mono mt-0.5">
                {discrepantItems.length}
              </p>
              <p className="text-[8px] text-rose-500">{100 - accuracyPercent}% lệch</p>
            </div>
          </div>

          {/* Total quantities analysis */}
          <div className="bg-[#f9f9ff] border border-slate-100 rounded-xl p-3 text-xs leading-normal space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Tổng tồn hệ thống:</span>
              <strong className="text-slate-700 font-mono">{totalExpected} cái / túi</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Tổng thực tế ghi nhận:</span>
              <strong className="text-slate-700 font-mono">{totalActual} cái / túi</strong>
            </div>
            <div className="pt-2 border-t border-slate-200/50 flex justify-between items-center text-[10px]">
              <span className="text-slate-400 font-semibold">Chi tiết sai lệnh tích lũy:</span>
              <span className="font-semibold text-slate-600">
                Thừa: <strong className="text-emerald-600 font-mono">+{positiveDiff}</strong> |
                Thiếu: <strong className="text-rose-600 font-mono">-{negativeDiff}</strong>
              </span>
            </div>
          </div>

          {/* List items block by groups */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1">
              Chi tiết mặt hàng sai lệch ({discrepantItems.length})
            </h4>

            {discrepantItems.length === 0 ? (
              <div className="p-4 border border-dashed border-emerald-100 bg-emerald-50/20 text-emerald-700 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5Box">
                <span className="material-symbols-outlined text-sm block">verified</span>
                <span>Tuyệt vời! Không phát hiện mặt hàng sai lệch nào!</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {discrepantItems.map((item) => {
                  const actualProd = MOCK_PRODUCTS.find((p) => p.id === item.productId);
                  const img =
                    actualProd?.image ||
                    'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=100';
                  const diff = (item.actualQty ?? 0) - item.expectedQty;

                  return (
                    <div
                      key={item.productId}
                      className="p-2.5 bg-rose-50/20 border border-rose-100 rounded-xl flex items-center justify-between text-xs gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={img}
                          alt={item.name}
                          className="w-8 h-8 object-cover rounded-lg border border-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate leading-tight">
                            {item.name}
                          </p>
                          <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                            SKU: {item.sku} • Vị trí: {item.rack}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-bold text-rose-600 font-mono pr-1">
                          {diff > 0 ? `+${diff}` : diff} {item.unit}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          đếm: {item.actualQty}/{item.expectedQty}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-1">
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1">
              Mặt hàng khớp tuyệt đối ({matcheditems.length})
            </h4>

            {matcheditems.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic text-center py-2">
                Không có mặt hàng khớp hoàn hảo.
              </p>
            ) : (
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-slate-500">
                {matcheditems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center text-[11px] p-2 bg-slate-50/80 rounded-lg border border-slate-100"
                  >
                    <span className="truncate max-w-60 font-medium text-slate-700">
                      {item.name}
                    </span>
                    <span className="font-bold text-emerald-600 font-mono shrink-0">
                      {item.expectedQty} {item.unit} (Khớp)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Virtual signing blocks for physical accountability realism */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-[10px]">
            <div className="text-center p-3 border border-slate-100 rounded-xl bg-slate-50/25">
              <span className="text-slate-400 font-medium">Nhân viên tạo kiểm</span>
              <p className="text-slate-700 font-bold mt-2.5 italic">Nhân viên kho</p>
              <p className="text-[8px] text-slate-400 mt-1">Đã ký qua App</p>
            </div>

            <div className="text-center p-3 border border-slate-100 rounded-xl bg-slate-50/25">
              <span className="text-slate-400 font-medium">Giám sát kho hàng</span>
              <div className="w-16 h-0.5 bg-dashed bg-slate-200 mx-auto mt-4" />
              <p className="text-[8px] text-slate-400 mt-2">Chờ duyệt chữ ký</p>
            </div>
          </div>
        </div>

        {/* Footer actions tab */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0 flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-3 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-all text-xs font-bold"
            title="In trang báo cáo này"
            id="print-report-btn"
          >
            <span className="material-symbols-outlined block text-sm">print</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl hover:shadow-lg hover:shadow-slate-900/10 active:scale-95 transition-all text-xs flex items-center justify-center gap-1"
            id="return-to-dashboard-btn"
          >
            <span>Đóng Báo Cáo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
