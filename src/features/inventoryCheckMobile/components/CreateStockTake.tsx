import { useState } from 'react';
import QrCameraScanner from './QrCameraScanner';
import { ChevronLeft, Delete, MapPin, ScanQrCode } from 'lucide-react';
import type { StorageLocation as Location } from '../../storageLocation/storageLocationTypes';
import { useAppDispatch } from '../../../app/hooks';
import { fetchLocationByBarcode } from '../../storageLocation/storageLocationThunks';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface CreateCheckSetup {
  locationId: number;
  notes: string;
}

interface CreateStockTakeProps {
  locations: Location[];
  onCreate: (setup: CreateCheckSetup) => void;
  onBack: () => void;
}

export default function CreateStockTake({ locations, onCreate, onBack }: CreateStockTakeProps) {
  const dispatch = useAppDispatch();

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

  const displaySelectedLocation = locations.find((l) => l.id.toString() === selectedLocationId);

  const handleStartInventory = () => {
    if (!selectedLocationId) {
      toast.error('Please scan or select an inventory location!');
      return;
    }
    onCreate({ locationId: Number(selectedLocationId), notes: notes.trim() });
  };

  const handleScannerScan = async (barcode: string) => {
    try {
      const location = await dispatch(fetchLocationByBarcode(barcode)).unwrap();
      setSelectedLocationId(location.id.toString());
      setShowScanner(false);
    } catch (error: unknown) {
      setShowScanner(false);
      if (axios.isAxiosError(error) && error.response) {
        toast.error('Error finding location with this barcode!');
      } else {
        toast.error('Location not found for this barcode!');
      }
    }
  };

  return (
    <div className="bg-slate-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white px-4 py-3.5 flex items-center gap-3 sticky top-0 z-10 border-b border-slate-100 shadow-xs">
        <button onClick={onBack} className="p-1 active:opacity-70 transition-opacity">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-semibold text-lg">Create Stock Take</h1>
      </header>

      {/* ── Body ── */}
      <main className="p-4 space-y-6 max-w-md mx-auto w-full flex-1">
        {/* Hero card */}
        <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-200 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold">Identify Stock Take Location</h2>
            <p className="text-sm text-blue-100 mt-2 opacity-80">
              Scan the location barcode or search by name/code.
            </p>
          </div>
          <MapPin className="absolute -right-4 -bottom-4 text-white/10" size={120} />
        </div>

        <div className="space-y-4">
          {/* Scan button */}
          <button
            onClick={() => setShowScanner(true)}
            className="w-full bg-white border-2 border-dashed border-blue-300 p-8 rounded-2xl flex flex-col items-center gap-2 text-blue-600 hover:bg-blue-50 transition-colors active:scale-98"
            id="scan-location-btn"
          >
            <ScanQrCode size={32} />
            <span className="font-bold">Scan Location Barcode</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-bold uppercase">Or search</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Location search */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase">
              Inventory Location
            </label>

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
                    : 'Enter location name, rack, or zone...'
                }
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-medium"
                id="location-search-input"
              />
              {locationSearch && (
                <button
                  onClick={() => {
                    setLocationSearch('');
                    setIsSearchingLocation(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <Delete />
                </button>
              )}

              {/* Dropdown */}
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
                        id={`location-option-${loc.id}`}
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
                      No matching location found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected location chip */}
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
                  id="clear-location-btn"
                >
                  <Delete />
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 min-h-24 resize-none text-sm"
              placeholder="Enter notes or instructions for stock taking..."
              id="notes-textarea"
            />
          </div>
        </div>
      </main>

      {/* ── Footer CTA ── */}
      <footer className="p-4 bg-white border-t border-slate-100 sticky bottom-0">
        <button
          onClick={handleStartInventory}
          disabled={!selectedLocationId}
          className="w-full bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-98 disabled:cursor-not-allowed"
          id="start-inventory-btn"
        >
          {selectedLocationId ? 'Start Inventory' : 'Select location to continue'}
        </button>
      </footer>

      {/* ── Scanner ── */}
      {showScanner && (
        <QrCameraScanner onClose={() => setShowScanner(false)} onScan={handleScannerScan} />
      )}
    </div>
  );
}
