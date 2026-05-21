import { useState, useEffect } from 'react';
import type { StockTakeSheet, MOCK_PRODUCTS, StockTakeItem } from './inventoryCheckMobileTypes';
import StockTakeDashboard from './components/StockTakeDashboard';
import CreateStockTake from './components/CreateStockTake';
import ActiveStockTake from './components/ActiveStockTake';
import ReportModal from './components/ReportModal';

export default function InventoryCheckMobileFeature() {
  const [sheets, setSheets] = useState<StockTakeSheet[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'create_sheet' | 'active_sheet'>(
    'dashboard'
  );
  const [selectedSheet, setSelectedSheet] = useState<StockTakeSheet | null>(null);
  const [reportingSheet, setReportingSheet] = useState<StockTakeSheet | null>(null);

  // Load sheets from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('warehouse_stocktake_sheets_data');
    if (stored) {
      try {
        setSheets(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing stored sheets', e);
        initializeDefaultSheets();
      }
    } else {
      initializeDefaultSheets();
    }
  }, []);

  // Save sheets dynamically on update
  const saveSheetsWithSync = (newSheets: StockTakeSheet[]) => {
    setSheets(newSheets);
    localStorage.setItem('warehouse_stocktake_sheets_data', JSON.stringify(newSheets));
  };

  const initializeDefaultSheets = () => {
    const defaultData: StockTakeSheet[] = [
      {
        id: 'sheet-init-1',
        code: 'PKK-5820',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
        type: 'position',
        status: 'completed',
        zone: 'Zone A',
        rack: 'Dãy 01',
        selectedProductId: null,
        notes: 'Kiểm kê định kỳ đầu tuần khu tiêu dùng nhanh.',
        createdBy: 'Trần Văn Bình',
        items: [
          {
            productId: 'prod-1',
            sku: 'SKU-FMCG-01',
            name: 'Nước xả vải Comfort Hương Ban Mai 1.8L',
            unit: 'Túi',
            zone: 'Zone A',
            rack: 'Dãy 01',
            shelf: 'Tầng 1',
            expectedQty: 45,
            actualQty: 45, // Matched
          },
          {
            productId: 'prod-2',
            sku: 'SKU-FMCG-02',
            name: 'Dầu ăn Simply Đậu nành nguyên chất 2L',
            unit: 'Chai',
            zone: 'Zone A',
            rack: 'Dãy 01',
            shelf: 'Tầng 2',
            expectedQty: 120,
            actualQty: 114, // Discrepant (-6)
          },
        ],
      },
      {
        id: 'sheet-init-2',
        code: 'PKK-9401',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        completedAt: null,
        type: 'all',
        status: 'in_progress',
        zone: 'Tất cả khu vực',
        rack: 'Tất cả dãy',
        selectedProductId: null,
        notes: 'Yêu cầu của quản đốc kiểm tra gấp đồ điện tử gia dụng kỹ thuật số.',
        createdBy: 'Lê Văn Nam',
        items: [
          {
            productId: 'prod-4',
            sku: 'SKU-ELEC-01',
            name: 'Ấm đun siêu tốc Panasonic 1.7L',
            unit: 'Chiếc',
            zone: 'Zone B',
            rack: 'Dãy 01',
            shelf: 'Tầng 3',
            expectedQty: 15,
            actualQty: 15, // Matched
          },
          {
            productId: 'prod-5',
            sku: 'SKU-ELEC-02',
            name: 'Nồi cơm điện cao tần Toshiba 1.8L',
            unit: 'Cái',
            zone: 'Zone B',
            rack: 'Dãy 02',
            shelf: 'Tầng 1',
            expectedQty: 8,
            actualQty: null, // Pending count
          },
          {
            productId: 'prod-6',
            sku: 'SKU-ELEC-03',
            name: 'Quạt đứng điện tử Mitsubishi LV16-RA',
            unit: 'Cái',
            zone: 'Zone B',
            rack: 'Dãy 03',
            shelf: 'Tầng 2',
            expectedQty: 24,
            actualQty: 25, // Discrepant (+1)
          },
        ],
      },
    ];

    saveSheetsWithSync(defaultData);
  };

  const handleCreateSheet = (newSheet: StockTakeSheet) => {
    const updated = [newSheet, ...sheets];
    saveSheetsWithSync(updated);

    // Direct worker to start checking immediately
    setSelectedSheet(newSheet);
    setCurrentView('active_sheet');
  };

  const handleSaveSheetDraft = (updatedSheet: StockTakeSheet) => {
    const updated = sheets.map((s) => (s.id === updatedSheet.id ? updatedSheet : s));
    saveSheetsWithSync(updated);
    setSelectedSheet(null);
    setCurrentView('dashboard');
  };

  const handleFinalizeSheet = (finalizedSheet: StockTakeSheet) => {
    const updated = sheets.map((s) => (s.id === finalizedSheet.id ? finalizedSheet : s));
    saveSheetsWithSync(updated);
    setSelectedSheet(null);

    // Smooth transition back to dashboard and immediately show report modal
    setCurrentView('dashboard');
    setTimeout(() => {
      setReportingSheet(finalizedSheet);
    }, 250);
  };

  const handleCancelSheet = (sheetId: string) => {
    const updated = sheets.filter((s) => s.id !== sheetId);
    saveSheetsWithSync(updated);
  };

  const handleSelectSheetFromList = (sheet: StockTakeSheet) => {
    if (sheet.status === 'in_progress') {
      setSelectedSheet(sheet);
      setCurrentView('active_sheet');
    } else {
      setReportingSheet(sheet);
    }
  };

  return (
    <div className="bg-[#f9f9ff] min-h-screen text-slate-800 antialiased font-sans flex flex-col selection:bg-blue-100">
      {/* Dynamic Master Switch View Controller */}
      <div className="flex-1 w-full flex flex-col">
        {currentView === 'dashboard' && (
          <StockTakeDashboard
            sheets={sheets}
            onCreateNewClick={() => setCurrentView('create_sheet')}
            onSelectSheet={handleSelectSheetFromList}
            onCancelSheet={handleCancelSheet}
            onPopulateMockData={initializeDefaultSheets}
          />
        )}

        {currentView === 'create_sheet' && (
          <CreateStockTake
            onCreate={handleCreateSheet}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'active_sheet' && selectedSheet && (
          <ActiveStockTake
            sheet={selectedSheet}
            onSaveDraft={handleSaveSheetDraft}
            onFinalize={handleFinalizeSheet}
            onCancel={() => {
              setSelectedSheet(null);
              setCurrentView('dashboard');
            }}
          />
        )}
      </div>

      {/* Analysis Report full screen Overlay modal */}
      {reportingSheet && (
        <ReportModal sheet={reportingSheet} onClose={() => setReportingSheet(null)} />
      )}
    </div>
  );
}
