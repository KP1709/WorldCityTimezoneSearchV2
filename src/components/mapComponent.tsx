import { useEffect, useState, useRef } from 'react';
import { Map, MapControls, type MapRef, MapMarker, MarkerContent } from '@/components/ui/map';
import { Button } from '@/components/ui/button';
import { MapPin, MapPinned } from 'lucide-react';
import { SearchBar } from '@/components/searchBar';
import LocationCard from '@/components/locationCard';
import useMapStore from '@/hooks/useMapStore';
import useBreakpoint from '@/hooks/useBreakpoint';
import DarkModeToggle from '@/components/darkModeButton';

const MapComponent = () => {
    const [mapDarkMode, setMapDarkMode] = useState(false);
    const { selectedCity, currentZoomLevel } = useMapStore();
    const currentBreakpoint = useBreakpoint();
    const lngLat = selectedCity?.coordinates.split(',');

    const mapRef = useRef<MapRef>(null);

    const handleEaseTo = () => {
        mapRef.current?.easeTo({
            center: [Number(lngLat?.[1]), Number(lngLat?.[0])],
            padding: {
                top: 0,
                bottom: currentBreakpoint < 700 ? 300 : 0,
                left: currentBreakpoint < 700 ? 0 : 200,
                right: 0
            },
            zoom: 10,
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
                {selectedCity && <Button onClick={handleEaseTo}><MapPinned /></Button>}
            </div>

            <Map ref={mapRef} center={[0, 0]} zoom={currentZoomLevel ?? 2} theme={mapDarkMode ? 'dark' : 'light'} className='border-2 absolute'>
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