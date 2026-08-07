import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ClipboardList, Loader2 } from 'lucide-react';
import PageHeader from '../../layouts/MobileLayout/PageHeader';
import TransactionTimelineItem from '../../features/stockCard/components/TransactionTimelineItem';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchStockCardByProduct } from '../../features/stockCard/stockCardThunks';
import { clearTransactions } from '../../features/stockCard/stockCardSlice';

export default function StockCardMobilePage() {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();

  const { transactions, loading, error } = useAppSelector((state) => state.stockCard);

  useEffect(() => {
    if (!productId) return;
    dispatch(fetchStockCardByProduct(Number(productId)));

    return () => {
      dispatch(clearTransactions());
    };
  }, [dispatch, productId]);

  // Derive product name from first transaction if available
  const productName =
    transactions.length > 0 ? transactions[0].product.productName : 'Stock Card';

  const productCode =
    transactions.length > 0 ? transactions[0].product.productCode : undefined;

  return (
    <div className="bg-wms-bg min-h-screen flex flex-col font-sans text-neutral-800">
      {/* Header */}
      <PageHeader
        title={productName}
        subtitle={productCode}
        backTo="/mobile/scan"
      />

      {/* Main */}
      <main className="flex-1 max-w-md mx-auto w-full px-5 py-5 pb-32">

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-wms-primary" />
            <p className="text-xs text-slate-500 font-semibold">Loading history...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center bg-white border border-wms-border-color rounded-2xl p-6 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-wms-bg border-2 border-dashed border-wms-border-color flex items-center justify-center">
              <ClipboardList className="w-8 h-8 text-wms-muted" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-extrabold text-slate-700">No transactions</p>
              <p className="text-xs text-slate-400 font-medium">
                This product has no recorded transactions yet.
              </p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {!loading && transactions.length > 0 && (
          <div>
            {/* Summary row */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400">
                Transaction History
              </span>
              <span className="text-[10px] bg-wms-primary/10 text-wms-primary font-bold px-2 py-0.5 rounded-full">
                {transactions.length} records
              </span>
            </div>

            {/* Timeline items */}
            <div>
              {transactions.map((tx, index) => (
                <TransactionTimelineItem
                  key={tx.id}
                  transaction={tx}
                  isLast={index === transactions.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
