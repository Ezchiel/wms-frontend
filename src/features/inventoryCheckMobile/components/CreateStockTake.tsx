import { useState } from 'react';
import ScannerSimulator from './ScannerSimulator';
import { ChevronDown, ChevronLeft, MapPin, ScanQrCode } from 'lucide-react';
import type { Product } from '../../products/productTypes';
import type { StorageLocation as Location } from '../../storageLocation/storageLocationTypes';
import { useAppDispatch } from '../../../app/hooks';
import { fetchLocationByBarcode } from '../../storageLocation/storageLocationThunks';
import axios from 'axios';

// Giữ nguyên các interface DTO
export interface CheckRequestDTO {
  notes: string;
  details: CheckDetailDTO[];
}

export interface CheckDetailDTO {
  productId: number;
  locationId: number;
  batchNo: string;
  actualQuantity: number | null;
  reason: string;
}

interface CreateStockTakeProps {
  locations: Location[];
  products: Product[];
  onCreate: (payload: CheckRequestDTO) => void;
  onBack: () => void;
}

export default function CreateStockTake({
  locations,
  products,
  onCreate,
  onBack,
}: CreateStockTakeProps) {
  const dispatch = useAppDispatch();

  // State
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [showScanner, setShowScanner] = useState(false);
  const [notes, setNotes] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  // Filter location list based on input
  const filteredLocations = locationSearch
    ? locations
        .filter((loc) => {
          const fullPath = `${loc.zone} - ${loc.rack} - ${loc.shelf}`.toLowerCase();
          return (
            fullPath.includes(locationSearch.toLowerCase()) ||
            loc.barcode.toLowerCase().includes(locationSearch.toLowerCase())
          );
        })
        .slice(0, 10)
    : [];

  // Find the selected location information to display the label
  const displaySelectedLocation = locations.find((l) => l.id.toString() === selectedLocationId);

  const handleStartInventory = () => {
    if (!selectedLocationId) {
      alert('Vui lòng quét hoặc chọn vị trí kiểm kê!');
      return;
    }

    const payload: CheckRequestDTO = {
      notes: notes.trim(),
      details: [
        {
          productId: 0,
          locationId: Number(selectedLocationId),
          batchNo: '',
          actualQuantity: null,
          reason: 'Initial check by location',
        },
      ],
    };

    onCreate(payload);
  };

  const handleScannerScan = async (barcode: string) => {
    try {
      const location = await dispatch(fetchLocationByBarcode(barcode)).unwrap();
      setSelectedLocationId(location.id.toString());
      setShowScanner(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        alert('Lỗi khi tìm vị trí ứng với mã vạch này!');
      }
      alert('Không tìm thấy vị trí ứng với mã vạch này!');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <header className="bg-white px-4 py-3.5 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-semibold text-lg">Create inventory check</h1>
      </header>

      <main className="p-4 space-y-6 max-w-md mx-auto w-full">
        <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-200 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold">Determine inventory location</h2>
            <p className="text-sm text-blue-100 mt-2 opacity-80">
              Scan location's Barcode or search for location based on barcode.
            </p>
          </div>
          <MapPin className="absolute -right-4 -bottom-4 text-white/10" size={120} />
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowScanner(true)}
            className="w-full bg-white border-2 border-dashed border-blue-300 p-8 rounded-2xl flex flex-col items-center gap-2 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <ScanQrCode />
            <span className="font-bold">Scan Barcode</span>
          </button>

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs text-slate-400 font-bold uppercase">Or search</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Search location */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase">
              Inventory location
            </label>

            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    setIsSearchingLocation(true);
                  }}
                  onFocus={() => setIsSearchingLocation(true)}
                  placeholder={
                    displaySelectedLocation
                      ? `${displaySelectedLocation.zone} - ${displaySelectedLocation.rack} - ${displaySelectedLocation.shelf}`
                      : 'Enter location barcode...'
                  }
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium"
                />
                {locationSearch && (
                  <button
                    onClick={() => {
                      setLocationSearch('');
                      setIsSearchingLocation(false);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>

              {/* Dropdown custom */}
              {isSearchingLocation && locationSearch && (
                <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 overflow-hidden max-h-60 overflow-y-auto">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          setSelectedLocationId(loc.id.toString());
                          setLocationSearch('');
                          setIsSearchingLocation(false);
                        }}
                        className="w-full flex flex-col px-4 py-3 hover:bg-blue-50 text-left border-b border-slate-50 last:border-0"
                      >
                        <span className="text-sm font-bold text-slate-800">
                          {`${loc.zone} - ${loc.rack} - ${loc.shelf}`}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Barcode: {loc.barcode}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-400">
                      No matching locations found
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isSearchingLocation && selectedLocationId && displaySelectedLocation && (
              <div className="mt-2 flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <MapPin size={16} />
                  <span className="text-sm font-bold">
                    {`${displaySelectedLocation.zone} - ${displaySelectedLocation.rack} - ${displaySelectedLocation.shelf}`}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedLocationId('')}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none min-h-25"
              placeholder="Notes or instructions..."
            />
          </div>
        </div>
      </main>

      <footer className="p-4 bg-white">
        <button
          onClick={handleStartInventory}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100"
        >
          Start checking
        </button>
      </footer>

      {showScanner && (
        <ScannerSimulator onClose={() => setShowScanner(false)} onScan={handleScannerScan} />
      )}
    </div>
  );
}
