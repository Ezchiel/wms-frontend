import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchStorageLocations } from '../../storageLocation/storageLocationThunks';

interface LocationFilterProps {
  selectedLocationId: number | null;
  onSelect: (locationId: number | null) => void;
  disabled?: boolean;
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedLocationId,
  onSelect,
  disabled = false,
}) => {
  const dispatch = useAppDispatch();
  const { storageLocations } = useAppSelector((state) => state.storageLocations);

  useEffect(() => {
    if (storageLocations.length === 0) {
      dispatch(fetchStorageLocations({ size: 1000 }));
    }
  }, [dispatch, storageLocations.length]);

  return (
    <div className="flex items-center gap-2">
      <MapPin size={14} className="text-wms-muted shrink-0" />
      <select
        disabled={disabled}
        value={selectedLocationId ?? ''}
        onChange={(e) => onSelect(e.target.value ? Number(e.target.value) : null)}
        className={`px-3 py-2 bg-white border border-wms-border-color rounded-xl text-[13px] text-wms-text-main outline-none cursor-pointer hover:border-wms-primary transition-colors shadow-xs min-w-[180px] ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        id="location-filter-select"
      >
        <option value="">All locations</option>
        {storageLocations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.description}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationFilter;
