import { useState } from 'react';
import {
  MOCK_ZONES,
  MOCK_RACKS,
  MOCK_PRODUCTS,
  type Product,
  type StockTakeSheet,
  type StockTakeItem,
} from '../inventoryCheckMobileTypes';
import ScannerSimulator from './ScannerSimulator';

interface CreateStockTakeProps {
  onCreate: (sheet: StockTakeSheet) => void;
  onBack: () => void;
}

export default function CreateStockTake({ onCreate, onBack }: CreateStockTakeProps) {
  const [selectedType, setSelectedType] = useState<'position' | 'product' | 'all'>('position');

  // States of Position mode
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [selectedRack, setSelectedRack] = useState<string>('');

  // States of Product mode
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchingProduct, setIsSearchingProduct] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // General notes state
  const [notes, setNotes] = useState('');

  // Dropdown suggestions for products
  const suggestedProducts = searchQuery
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Generate unique code for sheet
  const generateSheetCode = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `PKK-${rand}`;
  };

  const handleStartInventory = () => {
    // Determine which items should be populated in the stock-take sheet
    let targetProducts: Product[] = [];

    if (selectedType === 'all') {
      targetProducts = [...MOCK_PRODUCTS];
    } else if (selectedType === 'position') {
      targetProducts = MOCK_PRODUCTS.filter((p) => {
        const matchZone = !selectedZone || p.zone === selectedZone;
        const matchRack = !selectedRack || p.rack === selectedRack;
        return matchZone && matchRack;
      });
    } else {
      // product mode
      if (!selectedProduct) {
        alert('Vui lòng quét hoặc chọn một sản phẩm!');
        return;
      }
      targetProducts = [selectedProduct];
    }

    if (targetProducts.length === 0) {
      alert(
        'Không tìm thấy sản phẩm nào khớp với bộ lọc đã chọn. Vui lòng chọn lại khu vực/dãy để tiếp tục!'
      );
      return;
    }

    // Convert products to StockTakeItem
    const items: StockTakeItem[] = targetProducts.map((p) => ({
      productId: p.id,
      sku: p.sku,
      name: p.name,
      unit: p.unit,
      zone: p.zone,
      rack: p.rack,
      shelf: p.shelf,
      expectedQty: p.expectedQty,
      actualQty: null, // pending counting
    }));

    const newSheet: StockTakeSheet = {
      id: `sheet-${Date.now()}`,
      code: generateSheetCode(),
      createdAt: new Date().toISOString(),
      completedAt: null,
      type: selectedType,
      status: 'in_progress', // immediately start counting
      zone: selectedType === 'position' ? selectedZone || 'Tất cả khu vực' : null,
      rack: selectedType === 'position' ? selectedRack || 'Tất cả dãy' : null,
      selectedProductId: selectedType === 'product' && selectedProduct ? selectedProduct.id : null,
      notes: notes.trim(),
      items,
      createdBy: 'Nhân viên kho',
    };

    onCreate(newSheet);
  };

  const handleSelectProductFromText = (product: Product) => {
    setSelectedProduct(product);
    setSearchQuery('');
    setIsSearchingProduct(false);
  };

  const handleScannerScan = (scannedSku: string) => {
    const found = MOCK_PRODUCTS.find((p) => p.sku === scannedSku);
    if (found) {
      setSelectedProduct(found);
      setShowScanner(false);
    } else {
      alert(`Không phát hiện sản phẩm có mã SKU: ${scannedSku}`);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen">
      {/* Top Bar Navigation */}
      <header className="bg-white text-gray-900 border-b border-gray-100 flex items-center justify-between px-4 py-3.5 w-full sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="transition-colors duration-200 active:opacity-70 p-1.5 rounded-full hover:bg-slate-50 border border-slate-100/50"
            id="back-to-dashboard-btn"
          >
            <span className="material-symbols-outlined text-blue-600 block">arrow_back</span>
          </button>
          <h1 className="font-sans antialiased font-semibold text-lg text-gray-900">
            Tạo phiếu kiểm kê
          </h1>
        </div>
        <button className="transition-colors duration-200 active:opacity-70 p-1.5 rounded-full hover:bg-gray-50 text-gray-400">
          <span className="material-symbols-outlined block">more_vert</span>
        </button>
      </header>

      {/* Main Form Canvas */}
      <main className="flex-1 px-4 py-5 pb-32 space-y-6 max-w-md mx-auto w-full">
        {/* Selection Section: 'Chọn loại kiểm kê' */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-base text-slate-800">Chọn loại kiểm kê</h2>
            <span className="text-xs font-semibold text-blue-600 px-2.5 py-0.5 bg-blue-50 rounded-full border border-blue-100 italic">
              Bắt buộc
            </span>
          </div>

          {/* Type Selector buttons grids */}
          <div className="grid grid-cols-3 gap-2">
            {/* Option A: By Location */}
            <button
              onClick={() => setSelectedType('position')}
              className={`flex flex-col items-center justify-center p-3.5 bg-white border rounded-2xl transition-all duration-200 active:scale-95 shadow-xs ${
                selectedType === 'position'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100/60'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              id="type-position-btn"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  selectedType === 'position'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <span className="material-symbols-outlined text-lg">location_on</span>
              </div>
              <span
                className={`text-[12px] font-bold tracking-tight ${selectedType === 'position' ? 'text-blue-700' : 'text-slate-500'}`}
              >
                Theo Vị trí
              </span>
            </button>

            {/* Option B: By Product */}
            <button
              onClick={() => setSelectedType('product')}
              className={`flex flex-col items-center justify-center p-3.5 bg-white border rounded-2xl transition-all duration-200 active:scale-95 shadow-xs ${
                selectedType === 'product'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100/60'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              id="type-product-btn"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  selectedType === 'product'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <span className="material-symbols-outlined text-lg">inventory_2</span>
              </div>
              <span
                className={`text-[12px] font-bold tracking-tight ${selectedType === 'product' ? 'text-blue-700' : 'text-slate-500'}`}
              >
                Theo Sản phẩm
              </span>
            </button>

            {/* Option C: Universal/All */}
            <button
              onClick={() => setSelectedType('all')}
              className={`flex flex-col items-center justify-center p-3.5 bg-white border rounded-2xl transition-all duration-200 active:scale-95 shadow-xs ${
                selectedType === 'all'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100/60'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              id="type-all-btn"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  selectedType === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <span className="material-symbols-outlined text-lg">select_all</span>
              </div>
              <span
                className={`text-[12px] font-bold tracking-tight ${selectedType === 'all' ? 'text-blue-700' : 'text-slate-500'}`}
              >
                Toàn bộ
              </span>
            </button>
          </div>
        </section>

        {/* Dynamic Fields Body container */}
        <div className="space-y-5" id="form-container">
          {/* Position Mode Panel */}
          {selectedType === 'position' && (
            <div className="space-y-3.5 transition-all" id="position-fields-container">
              {/* Dropdown zone selector */}
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-slate-600 tracking-wider inline-block ml-1">
                  Chọn Khu vực (Zone)
                </label>
                <div className="relative">
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-xl px-4 py-3.5 appearance-none outline-none transition-all font-medium text-slate-800"
                    id="select-zone"
                  >
                    <option value="">-- Chọn Khu vực (Zone) --</option>
                    {MOCK_ZONES.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Dropdown Rack selector */}
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-slate-600 tracking-wider inline-block ml-1">
                  Chọn Dãy kệ
                </label>
                <div className="relative">
                  <select
                    value={selectedRack}
                    onChange={(e) => setSelectedRack(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-xl px-4 py-3.5 appearance-none outline-none transition-all font-medium text-slate-800"
                    id="select-rack"
                  >
                    <option value="">-- Tất cả dãy --</option>
                    {MOCK_RACKS.map((rack) => (
                      <option key={rack.id} value={rack.id}>
                        {rack.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Product Mode Panel */}
          {selectedType === 'product' && (
            <div className="space-y-4 transition-all" id="product-fields-container">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-slate-600 tracking-wider inline-block ml-1">
                  Quét hoặc chọn Sản phẩm
                </label>
                <div className="relative">
                  <input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchingProduct(true);
                    }}
                    onFocus={() => setIsSearchingProduct(true)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-xl pl-11 pr-12 py-3.5 outline-none transition-all font-medium text-slate-800"
                    placeholder="Nhập mã SKU hoặc tên sản phẩm..."
                    type="text"
                    id="search-product-input"
                  />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    search
                  </span>

                  {/* Simulated Mobile QR scan button */}
                  <button
                    type="button"
                    onClick={() => setShowScanner(true)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg active:scale-90 transition-transform"
                    title="Mở camera giả lập quét barcode"
                    id="trigger-scan-simulator-btn"
                  >
                    <span className="material-symbols-outlined block">qr_code_scanner</span>
                  </button>
                </div>

                {/* Dropdown Suggestions List for searching products */}
                {isSearchingProduct && searchQuery && (
                  <div className="absolute z-30 max-w-md w-full bg-white border border-slate-100 rounded-xl shadow-xl max-h-56 overflow-y-auto mt-1 p-1">
                    <div className="flex justify-between items-center px-3 py-2 border-b border-slate-50 text-[10px] text-slate-400 uppercase font-semibold">
                      <span>Kết quả tìm kiếm ({suggestedProducts.length})</span>
                      <button
                        onClick={() => setIsSearchingProduct(false)}
                        className="text-blue-500 hover:underline capitalize"
                      >
                        Đóng
                      </button>
                    </div>

                    {suggestedProducts.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">
                        Không tìm thấy sản phẩm trùng khớp
                      </p>
                    ) : (
                      suggestedProducts.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSelectProductFromText(p)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg text-left transition-colors font-sans"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-9 h-9 object-cover rounded-lg shrink-0 border border-slate-100"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {p.name}
                            </p>
                            <p className="text-[10px] font-mono text-slate-400">
                              SKU: <span className="text-blue-600 font-bold">{p.sku}</span> | Vị
                              trí: {p.zone}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Dispaly the currently selected product */}
              {selectedProduct ? (
                <div className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-2xl flex items-start gap-3 relative animate-fadeIn">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-14 h-14 object-cover rounded-xl shrink-0 border border-blue-200/50"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                      Sản phẩm chọn kiểm
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight truncate mt-0.5">
                      {selectedProduct.name}
                    </h4>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[10px] text-slate-500 font-medium">
                      <span>
                        SKU:{' '}
                        <span className="font-mono font-bold text-slate-700">
                          {selectedProduct.sku}
                        </span>
                      </span>
                      <span>
                        Đơn vị: <span className="text-slate-700">{selectedProduct.unit}</span>
                      </span>
                      <span>
                        Hệ thống:{' '}
                        <span className="text-blue-600 font-bold">
                          {selectedProduct.expectedQty} {selectedProduct.unit}
                        </span>
                      </span>
                    </div>

                    <div className="mt-1 text-[10px] inline-flex items-center gap-1 text-slate-400">
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      <span>
                        {selectedProduct.zone} • {selectedProduct.rack}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-zinc-50 border border-dashed border-slate-200 rounded-xl text-center">
                  <span className="material-symbols-outlined text-3xl text-slate-300">
                    inventory
                  </span>
                  <p className="text-xs text-slate-400 mt-1">Chưa chọn sản phẩm kiểm kê.</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Vui lòng nhập tìm hoặc quét mã vạch.
                  </p>
                </div>
              )}

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-600 text-lg">info</span>
                <p className="text-xs text-amber-800 leading-normal">
                  Chế độ này cho phép bạn lên danh sách kiểm kê chỉ cho{' '}
                  <strong>sản phẩm duy nhất</strong> được chỉ định tại tất cả vị trí lưu kho của nó.
                </p>
              </div>
            </div>
          )}

          {/* Full Universal Mode panel */}
          {selectedType === 'all' && (
            <div className="transition-all animate-fadeIn" id="all-fields-container">
              <div className="p-5 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 bg-blue-50/20">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Kiểm kê toàn bộ kho</h3>
                  <p className="text-[11px] text-slate-500 leading-normal mt-1 max-w-70 mx-auto">
                    Hệ thống sẽ kéo tất cả vị trí kệ và toàn bộ sản phẩm hiện có đưa vào danh sách
                    kiểm kê. Thích hợp cho kỳ kiểm kho tổng kết tháng.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Global Note Field */}
          <div className="space-y-1">
            <label className="text-[12px] font-semibold text-slate-600 tracking-wider inline-block ml-1">
              Ghi chú (Tùy chọn)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-xl px-4 py-3 outline-none transition-all text-sm font-medium text-slate-800 resize-none"
              placeholder="Nhập ghi chú hoặc dặn dò cho nhân viên kiểm kho..."
              rows={3}
              id="notes-textarea"
            />
          </div>
        </div>

        {/* Decorative Modern Warehouse Illustration Graphics */}
        <div className="relative w-full h-36 mt-4 rounded-2xl overflow-hidden opacity-35 hover:opacity-50 transition-opacity border border-slate-200 shadow-xs">
          <img
            className="w-full h-full object-cover"
            alt="Seamless elegant warehouse racking logistics schematic decoration"
            referrerPolicy="no-referrer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-GxqcBwu7UwnGHKtqA7DxvUKpT1hMf05_VN3_5u4G9TYItl3pKNNnddwwX4RyqpzE21uz7tAnjYbCkAA16F4c9bDPynrh5yYa7A3PeHFOnew8kHKFWG9a3mv5fiK8P3epUD_uJ6K4nA20AJwPy9FnjhN0_XgJUtFqp1vX1JeBmuxQlfDFLGq0YMb4vgZ7GjZYmjyoKsZEbJi5d0zWeHjo5Xa12I5lTHryCx4auZiPf2mwPNNAkhnBi3NnWGRUg0aJ37qgtIGAPdNc"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-50 to-transparent"></div>
        </div>
      </main>

      {/* Footer Action Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-10 bg-white/90 backdrop-blur-md border-t border-slate-100 px-4 pb-6 pt-3.5 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleStartInventory}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/15 active:scale-95 hover:shadow-blue-500/25 transition-all duration-150 flex items-center justify-center gap-2"
            id="start-inventory-btn"
          >
            <span>Bắt đầu kiểm kê</span>
            <span className="material-symbols-outlined block">play_arrow</span>
          </button>
        </div>
      </footer>

      {/* Barcode scanner Overlay Simulator */}
      {showScanner && (
        <ScannerSimulator onClose={() => setShowScanner(false)} onScan={handleScannerScan} />
      )}
    </div>
  );
}
