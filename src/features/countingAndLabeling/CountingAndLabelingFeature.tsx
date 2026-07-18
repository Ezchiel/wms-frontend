import { Link } from 'react-router-dom';
import { Tag, Loader2, FileX, Calendar, Boxes, CheckCheck, CheckCircle, ClipboardCheck } from 'lucide-react';
import ItemCard from './components/ItemCard';
import PrintLabelModal from './components/PrintLabelModal';
import ProgressBar from './components/ProgressBar';
import { useCountingAndLabeling } from './useCountingAndLabeling';
import PageHeader from '../../layouts/MobileLayout/PageHeader';

function CountingAndLabelingFeature() {
  const { state, actions } = useCountingAndLabeling();

  if (state.loading) {
    return (
      <div className="bg-wms-bg min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-wms-primary w-8 h-8" />
          <p className="text-[13px] text-wms-muted">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!state.receipt) {
    return (
      <div className="bg-wms-bg min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-white border border-wms-border-color flex items-center justify-center mb-4 shadow-sm">
          <FileX className="w-8 h-8 text-wms-muted opacity-50" />
        </div>
        <h3 className="text-[15px] font-bold text-wms-text-main mb-1">Receipt not found</h3>
        <p className="text-[13px] text-wms-muted mb-5">
          Receipt not found or has been deleted.
        </p>
        <Link
          to="/mobile/tasks"
          className="px-5 py-2.5 bg-wms-primary text-white text-[13px] font-semibold rounded-xl shadow-sm active:scale-95 transition-all"
        >
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-wms-bg min-h-screen font-sans text-wms-text-main pb-28">
      {/* Top App Bar */}
      <PageHeader
        title="Counting & Labeling"
        subtitle={state.receipt!.receiptCode}
        backTo="/mobile/tasks"
        rightSlot={
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-wms-bg border border-wms-border-color rounded-full shrink-0">
            <Tag className="text-wms-primary w-[11px] h-[11px]" />
            <span className="text-[12px] font-bold text-wms-text-main">
              {state.printedCount}/{state.totalCount}
            </span>
          </div>
        }
      />

      <main className="px-5 pt-5 max-w-md mx-auto">
        {/* Receipt summary */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-wms-border-color mb-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-[12px] text-wms-muted font-medium">Supplier</p>
              <p className="text-[14px] font-bold text-wms-text-main">
                {state.receipt!.supplierName}
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-md shrink-0">
              {state.receipt!.status}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-wms-border-color">
            <div className="flex items-center gap-1.5 text-[12px] text-wms-muted font-medium">
              <Calendar className="w-[12px] h-[12px]" />
              {new Date(state.receipt!.createdAt).toLocaleDateString('vi-VN')}
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-wms-muted font-medium">
              <Boxes className="w-[12px] h-[12px]" />
              {state.totalCount} SKUs
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-wms-primary ml-auto">
              <CheckCheck className="w-[12px] h-[12px]" />
              {state.printedCount} printed
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
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-green-700">Counting & Labeling completed!</p>
              <p className="text-[12px] text-green-600">
                All {state.totalCount} items have been assigned LPN
              </p>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-bold text-wms-text-main">List of goods</h2>
          <span className="text-[12px] text-wms-muted font-medium">
            {state.details.length} items
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
            <ClipboardCheck className="w-[18px] h-[18px]" />
            Done & Back
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
