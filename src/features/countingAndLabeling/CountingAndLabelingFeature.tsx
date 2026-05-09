import { Link } from 'react-router-dom';
import ItemCard from './components/ItemCard';
import PrintLabelModal from './components/PrintLabelModal';
import ProgressBar from './components/ProgressBar';
import { useCountingAndLabeling } from './useCountingAndLabeling';

function CountingAndLabelingFeature() {
  const { state, actions } = useCountingAndLabeling();

  if (state.loading) {
    return (
      <div className="bg-wms-bg min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="fa-solid fa-circle-notch fa-spin text-wms-primary text-2xl" />
          <p className="text-[13px] text-wms-muted">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!state.receipt) {
    return (
      <div className="bg-wms-bg min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-white border border-wms-border-color flex items-center justify-center mb-4 shadow-sm">
          <i className="fa-solid fa-file-circle-xmark text-3xl text-wms-muted opacity-50" />
        </div>
        <h3 className="text-[15px] font-bold text-wms-text-main mb-1">Không tìm thấy phiếu</h3>
        <p className="text-[13px] text-wms-muted mb-5">
          Phiếu nhập kho không tồn tại hoặc đã bị xoá.
        </p>
        <Link
          to="/mobile/tasks"
          className="px-5 py-2.5 bg-wms-primary text-white text-[13px] font-semibold rounded-xl shadow-sm active:scale-95 transition-all"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-wms-bg min-h-screen font-sans text-wms-text-main pb-28">
      {/* Top App Bar */}
      <header className="flex items-center justify-between px-5 py-4 w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-wms-border-color shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/mobile/tasks"
            className="text-wms-text-main w-9 h-9 active:opacity-70 bg-wms-bg rounded-full flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-[16px]" />
          </Link>
          <div>
            <h1 className="font-bold text-wms-text-main text-[17px] leading-tight">
              Kiểm đếm & Tạo tem
            </h1>
            <p className="text-[11px] text-wms-primary font-semibold -mt-0.5">
              {state.receipt!.receiptCode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-wms-bg border border-wms-border-color rounded-full">
          <i className="fa-solid fa-tag text-wms-primary text-[11px]" />
          <span className="text-[12px] font-bold text-wms-text-main">
            {state.printedCount}/{state.totalCount}
          </span>
        </div>
      </header>

      <main className="px-5 pt-5 max-w-md mx-auto">
        {/* Receipt summary */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-wms-border-color mb-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-[12px] text-wms-muted font-medium">Nhà cung cấp</p>
              <p className="text-[14px] font-bold text-wms-text-main">
                {state.receipt!.supplierName}
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-md shrink-0">
              {state.receipt!.status}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-wms-border-color">
            <div className="flex items-center gap-1.5 text-[12px] text-wms-muted font-medium">
              <i className="fa-regular fa-calendar text-[12px]" />
              {new Date(state.receipt!.createdAt).toLocaleDateString('vi-VN')}
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-wms-muted font-medium">
              <i className="fa-solid fa-boxes-stacked text-[12px]" />
              {state.totalCount} SKUs
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-wms-primary ml-auto">
              <i className="fa-solid fa-check-double text-[12px]" />
              {state.printedCount} đã in
            </div>
          </div>

          <div className="mt-3">
            <ProgressBar value={state.printedCount} total={state.totalCount} />
          </div>
        </section>

        {/* Completion banner */}
        {state.allDone && (
          <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-circle-check text-xl" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-green-700">Kiểm đếm hoàn tất!</p>
              <p className="text-[12px] text-green-600">
                Tất cả {state.totalCount} mặt hàng đã được gán LPN
              </p>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-bold text-wms-text-main">Danh sách hàng hóa</h2>
          <span className="text-[12px] text-wms-muted font-medium">
            {state.details.length} mặt hàng
          </span>
        </div>

        <div className="space-y-3">
          {state.details.map((detail) => {
            const st = state.itemStates[detail.id];
            if (!st) return null;
            return (
              <ItemCard
                key={detail.id}
                detail={detail}
                state={st}
                onQtyChange={(delta) => actions.handleQtyChange(detail.id, delta)}
                onFieldChange={(field, val) => actions.handleFieldChange(detail.id, field, val)}
                onPrint={() => actions.handlePrint(detail.id)}
                receiptStatus={state.receipt!.status}
              />
            );
          })}
        </div>

        {/* Finish */}
        {state.allDone && (
          <Link
            to="/mobile/tasks"
            className="mt-6 mb-4 w-full bg-wms-text-main text-white py-4 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
          >
            <i className="fa-solid fa-clipboard-check text-[18px]" />
            Hoàn tất & Quay về
          </Link>
        )}
      </main>

      {/* Print QR */}
      <PrintLabelModal
        isOpen={!!state.printData}
        onClose={() => actions.setPrintData(null)}
        data={state.printData}
      />
    </div>
  );
}

export default CountingAndLabelingFeature;
