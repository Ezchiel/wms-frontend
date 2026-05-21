import { useState, useEffect } from 'react';
import { QrCode, ClipboardList, History, LogOut, CheckCircle, Package, User } from 'lucide-react';
import ScanTab from './components/ScanTab';
import HistoryTab from './components/HistoryTab';
import InventoryTab from './components/InventoryTab';
import type { Product } from './inventoryCheckScannerMobileTypes';

export default function InventoryCheckScannerMobileFeature() {
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductForScan, setSelectedProductForScan] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial products
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSelectProductForScan = (product: Product) => {
    setSelectedProductForScan(product);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-neutral-800 flex flex-col max-w-lg mx-auto shadow-2xl relative border-x border-neutral-200">
      {/* Dynamic Header Appbar */}
      <header className="bg-white border-b border-neutral-200 px-4 h-14 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm md:text-base text-neutral-900 tracking-tight leading-none">
              Quét mã &amp; Kiểm kê
            </h1>
            <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wide">
              Logistics WMS
            </span>
          </div>
        </div>

        {/* Profile indicator */}
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-xl transition cursor-help shrink-0"
          title="hoangquocluat88@gmail.com"
        >
          <User className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[10px] font-bold text-neutral-600 truncate max-w-27.5">
            Quốc Luật
          </span>
        </div>
      </header>

      {/* Main Container Viewport */}
      <main className="flex-1 px-4 py-6 pb-24 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-xs text-neutral-500 font-semibold">
              Đang chuẩn bị bộ dữ liệu kho...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'scan' && (
              <ScanTab
                products={products}
                onRefreshProducts={fetchProducts}
                onSetTab={setActiveTab}
                onRequestProductCount={(sku) => {
                  const found = products.find((p) => p.sku === sku);
                  if (found) handleSelectProductForScan(found);
                }}
                selectedProductFromInventory={selectedProductForScan}
              />
            )}

            {activeTab === 'history' && <HistoryTab onRefreshProducts={fetchProducts} />}

            {activeTab === 'inventory' && (
              <InventoryTab
                products={products}
                onRefreshProducts={fetchProducts}
                onSetTab={setActiveTab}
                onSelectProductForScan={handleSelectProductForScan}
              />
            )}
          </>
        )}
      </main>

      {/* Persistent Bottom Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-lg w-full h-16 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-6 flex justify-around items-center z-40 shadow-lg">
        {/* Scan Barcode Tab Trigger */}
        <button
          onClick={() => {
            setActiveTab('scan');
            setSelectedProductForScan(null); // Clear selected if direct click
          }}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 select-none ${
            activeTab === 'scan'
              ? 'text-blue-600 scale-102 font-bold'
              : 'text-neutral-400 hover:text-neutral-600 font-medium'
          }`}
        >
          <QrCode className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider font-extrabold">Scan</span>
        </button>

        {/* Audit Log History Tab Trigger */}
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 select-none ${
            activeTab === 'history'
              ? 'text-blue-600 scale-102 font-bold'
              : 'text-neutral-400 hover:text-neutral-600 font-medium'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider font-extrabold">Lịch Sử</span>
        </button>

        {/* Database Inventory Tab Trigger */}
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 select-none ${
            activeTab === 'inventory'
              ? 'text-blue-600 scale-102 font-bold'
              : 'text-neutral-400 hover:text-neutral-600 font-medium'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider font-extrabold">Kho Hàng</span>
        </button>
      </nav>
    </div>
  );
}
