import { useState } from "react";
import { DateTime } from "luxon";
import useMapStore from "@/hooks/useMapStore";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TimeDate from "@/components/currentDateTime";
import FlagImage from "@/components/flagImage";
import LiveIndicator from "@/components/liveIndicator";
import { getTimeZoneData } from "@/hooks/getTimezoneData";
import { getFlagImage } from "@/hooks/getFlagImage";
import { useFlagCodes } from "@/hooks/useFlagCodes";
import { X } from "lucide-react";

const LocationCard = () => {
    const [showCard, setShowCard] = useState(true);
    const { selectedCity } = useMapStore();
    const flagCodesList = useFlagCodes();

    if (!selectedCity) return null;
    const latLng = selectedCity?.coordinates.split(',');

    const { flags } = getFlagImage(selectedCity, flagCodesList);
    const { mainFlag, secondaryFlag } = flags;

    const { timezoneCity, isLoading, isError } = getTimeZoneData([Number(latLng[0]), Number(latLng[1])], 2000);

    if (!showCard) {
        return <Button onClick={() => setShowCard(!showCard)} className="absolute z-1 bottom-0 -left-2 m-4">Show Location Info</Button>;
    }

    if (showCard) {
        if (isLoading) {
            return (
                <Card>
                    <CardTitle className='text-2xl font-bold'>Loading...</CardTitle>
                </Card>
            );

        }

        if (isError || !timezoneCity) {
            return (
                <Card>
                    <CardTitle className='text-2xl font-bold'>Error in loading data</CardTitle>
                </Card>
            );

        }


        return (
            <Card className='h-85 mb-1 w-full md:w-80 absolute z-1 bottom-0 left-0 flex-col gap-4 items-center bg-accent border-sidebar-primary'>
                <LiveIndicator />
                <CardTitle className='text-2xl font-bold'>
                    <span><TimeDate timezone={selectedCity?.timezone} time={true} /> {timezoneCity.abbreviation} </span>
                </CardTitle>
                <CardDescription className='text-md'>
                    <TimeDate timezone={selectedCity.timezone} time={false} />
                </CardDescription>
                <CardDescription className='text-md'>{DateTime.now().setZone(selectedCity.timezone).toFormat('ZZZZZ')}</CardDescription>
                <CardDescription className='text-md'>{selectedCity.timezone}</CardDescription>
                <div className='flex justify-between gap-4'>
                    <CardDescription className='text-md'>Lat: {Number(latLng[0]).toFixed(3)}</CardDescription>
                    <CardDescription className='text-md'>Lng: {Number(latLng[1]).toFixed(3)}</CardDescription>
                </div>
                <CardDescription className='text-md text-center'>{selectedCity.ascii_name}, {timezoneCity.regionName && `${timezoneCity.regionName},`} {timezoneCity?.countryName}</CardDescription>
                <div className='flex justify-evenly gap-4'>
                    {mainFlag && <FlagImage image={mainFlag} />}
                    {secondaryFlag && <FlagImage image={secondaryFlag} />}
                </div>
                <Button onClick={() => setShowCard(!showCard)} className="absolute top-2 left-1"><X /></Button>
            </Card>
        );
    }
};

export default LocationCard;