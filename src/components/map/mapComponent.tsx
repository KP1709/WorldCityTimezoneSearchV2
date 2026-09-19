import { useEffect, useState, useRef } from 'react';
import { Map, MapControls, type MapRef, MapMarker, MarkerContent } from '@/components/ui/map';
import { MapPin } from 'lucide-react';
import SearchBar from '@/components/map/searchBar';
import LocationCard from '@/components/locationCard/locationCard';
import useMapStore from '@/hooks/useMapStore';
import useBreakpoint from '@/hooks/useBreakpoint';
import DarkModeToggle from '@/components/map/darkModeButton';
import FlyToLocationButton from '@/components/map/flyToLocationButton';
import type { Map as MapLibreMap, LngLatLike, PointLike } from 'maplibre-gl';
import type { LngLatObj } from '@/types';

type PixelOffset = { x: number; y: number; };

const getMapOffset = (breakpoint: number) => {
    if (breakpoint <= 800) return { x: 0, y: -120 };
    return { x: 100, y: 0 };
};

const calculateOffsetCenter = (location: LngLatLike, offset: PixelOffset, map: MapLibreMap): LngLatObj => {
    const point = map.project(location);
    const offsetPoint = {
        x: point.x + offset.x,
        y: point.y + offset.y,
    };
    const newCenter = map.unproject(offsetPoint as PointLike);

    return { lng: newCenter.lng, lat: newCenter.lat };
};

const MapComponent = () => {
    const [mapDarkMode, setMapDarkMode] = useState(false);
    const { selectedCity } = useMapStore();
    const currentBreakpoint = useBreakpoint();
    const [latitude, longitude] = selectedCity?.coordinates.split(',').map(Number) ?? [];

    const mapRef = useRef<MapRef>(null);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const offset = getMapOffset(currentBreakpoint);
        const newCenter = calculateOffsetCenter({ lng: 0, lat: 0 }, offset, map);

        map?.easeTo({
            center: [newCenter.lng, newCenter.lat],
            zoom: map.getZoom(),
            duration: 500
        });
    }, [currentBreakpoint]);

    const handleEaseTo = () => {
        if (latitude === undefined || longitude === undefined) return;

        mapRef.current?.easeTo({
            center: [longitude, latitude],
            padding: {
                top: 0,
                bottom: currentBreakpoint < 700 ? 300 : 0,
                left: currentBreakpoint < 700 ? 0 : 200,
                right: 0
            },
            zoom: mapRef.current?.getZoom(),
        });
    };

    useEffect(() => {
        handleEaseTo();
    }, [currentBreakpoint, latitude, longitude]);

    useEffect(() => {
        const updateMapContrast = (map: MapLibreMap) => {
            map.getStyle().layers?.forEach((layer) => {
                const isLabel = layer.type === 'symbol' && Boolean(layer.layout?.['text-field']);
                const isBoundary = layer.type === 'line' && /boundary|admin/i.test(layer.id);

                if (isLabel) {
                    map.setPaintProperty(layer.id, 'text-color', mapDarkMode ? '#f1f5f9' : '#263238');
                    map.setPaintProperty(layer.id, 'text-halo-color', mapDarkMode ? '#263238' : '#f8fafc');
                    map.setPaintProperty(layer.id, 'text-halo-width', 1.2);
                }

                if (isBoundary) {
                    map.setPaintProperty(layer.id, 'line-color', mapDarkMode ? '#94a3b8' : '#52656d');
                    map.setPaintProperty(layer.id, 'line-opacity', mapDarkMode ? 0.65 : 0.8);
                }
            });
        };

        let animationFrameId: number | null = null;
        let map: MapLibreMap | null = null;

        const attachToMap = () => {
            map = mapRef.current;
            if (!map) {
                animationFrameId = requestAnimationFrame(attachToMap);
                return;
            }

            const handleStyleLoad = () => updateMapContrast(map!);
            map.on('style.load', handleStyleLoad);
            if (map.isStyleLoaded()) updateMapContrast(map);

            cleanup = () => map?.off('style.load', handleStyleLoad);
        };

        let cleanup = () => { };
        attachToMap();

        return () => {
            if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
            cleanup();
        };
    }, [mapDarkMode]);

    return (
        <div className="w-full h-svh relative">
            <SearchBar />

            <div className='flex flex-col gap-2 absolute z-1 top-20 right-2 sm:flex-row sm:top-5 sm:right-15'>
                <DarkModeToggle setMapDarkMode={setMapDarkMode} />
                {selectedCity && <FlyToLocationButton handleEaseTo={handleEaseTo} />}
            </div>

            <Map
                ref={mapRef}
                center={[0, 0]}
                minZoom={2}
                theme={mapDarkMode ? 'dark' : 'light'}
                className='border-2 absolute'
            >
                <MapControls position='top-right' />

                {selectedCity && latitude !== undefined && longitude !== undefined &&
                    <MapMarker
                        key={selectedCity.geoname_id}
                        latitude={latitude}
                        longitude={longitude}
                    >
                        <MarkerContent>
                            <MapPin
                                className={`cursor-auto ${mapDarkMode ? 'fill-primary stroke-accent-foreground' : 'fill-primary stroke-accent-foreground'}`}
                                size={40}
                            />
                        </MarkerContent>
                    </MapMarker>
                }
            </Map>

            {selectedCity && <LocationCard />}
        </div>
    );
};

export default MapComponent;