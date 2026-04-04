import { create } from 'zustand';
import type { CitiesType, CitiesTypeGrouped, TimeZoneType } from '@/types';

interface MapStore {
    isRecentre: boolean;
    setIsRecentre: (value: boolean) => void;

    currentZoomLevel: number;
    setCurrentZoomLevel: (value: number) => void;

    selectedCity: CitiesType | null;
    setSelectedCity: (city: CitiesType | null) => void;

    hasMultipleCities: boolean,
    setHasMultipleCities: (value: boolean) => void;

    selectedCityGrouped: CitiesTypeGrouped | null;
    setSelectedCityGrouped: (city: CitiesTypeGrouped | null) => void;

    timezoneCity: TimeZoneType | null;
    setTimezoneCity: (city: TimeZoneType | null) => void;

}

const useMapStore = create<MapStore>((set) => ({
    isRecentre: true,
    setIsRecentre: (value) => set({ isRecentre: !value }),

    hasMultipleCities: false,
    setHasMultipleCities: (value) => set({ hasMultipleCities: value }),

    currentZoomLevel: 2,
    setCurrentZoomLevel: (value) => set({ currentZoomLevel: value }),

    selectedCity: null,
    setSelectedCity: (city) => set({ selectedCity: city }),

    selectedCityGrouped: null,
    setSelectedCityGrouped: (city) => set({ selectedCityGrouped: city }),

    timezoneCity: null,
    setTimezoneCity: (city) => set({ timezoneCity: city }),

}));

export default useMapStore;