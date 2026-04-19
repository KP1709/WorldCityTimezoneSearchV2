import { useEffect, useState, useRef } from 'react';
import { Map, MapControls, type MapRef, MapMarker, MarkerContent } from '@/components/ui/map';
import { MapPin } from 'lucide-react';
import SearchBar from '@/components/searchBar';
import LocationCard from '@/components/locationCard';
import useMapStore from '@/hooks/useMapStore';
import useBreakpoint from '@/hooks/useBreakpoint';
import DarkModeToggle from '@/components/darkModeButton';
import FlyToLocationButton from '@/components/flyToLocationButton';
import type { Map as MapLibreMap, LngLatLike, LngLat, PointLike } from 'maplibre-gl';
import type { LngLatObj } from '@/types';

const MapComponent = () => {
    const [mapDarkMode, setMapDarkMode] = useState(false);
    const { selectedCity } = useMapStore();
    const currentBreakpoint = useBreakpoint();
    const lngLat = selectedCity?.coordinates.split(',');

    const mapRef = useRef<MapRef>(null);

    const calculateNewLngLat = (offsetX: number, offsetY: number, lngLat: LngLatLike, map: MapLibreMap): LngLatObj => {
        const ll: LngLat = lngLat as LngLat;
        const point = map.project([ll.lng, ll.lat]);

        const newPoint = {
            x: point.x + offsetX,
            y: point.y + offsetY
        };

        const newLngLat = map.unproject(newPoint as PointLike);

        return {
            lng: newLngLat.lng,
            lat: newLngLat.lat
        };
    };

    useEffect(() => {
        const map = mapRef.current;
        let offsetX = 0;
        let offsetY = 0;

        if (!map) return;

        if (currentBreakpoint <= 800) {
            offsetX = 0;
            offsetY = -120;
        }
        else if (currentBreakpoint > 800) {
            offsetX = 100;
            offsetY = 0;
        }

        const newLngLat = calculateNewLngLat(
            offsetX,
            offsetY,
            lngLat ? { lng: Number(lngLat[1]), lat: Number(lngLat[0]) } : { lng: 0, lat: 0 },
            map
        );

        map?.easeTo({
            center: [newLngLat.lng, newLngLat.lat],
            zoom: map.getZoom(),
            duration: 500
        });
    }, []);

    const handleEaseTo = () => {
        mapRef.current?.easeTo({
            center: [Number(lngLat?.[1]), Number(lngLat?.[0])],
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
    }, [selectedCity]);

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

                {selectedCity &&
                    <MapMarker
                        key={selectedCity?.geoname_id}
                        latitude={Number(lngLat?.[0])}
                        longitude={Number(lngLat?.[1])}
                    >
                        <MarkerContent>
                            <MapPin
                                className={`cursor-auto ${mapDarkMode ? 'fill-primary stroke-accent-foreground' : 'fill-primary stroke-accent-foreground'}`}
                                size={40}
                            />
                        </MarkerContent>
                    </MapMarker>}
            </Map>

            {selectedCity && <LocationCard />}
        </div>
    );
};

export default MapComponent;