import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import RadioButtonCardGroup from "@/components/radioButtonCards";
import useMapStore from "@/hooks/useMapStore";
import { getCitiesByRegion } from "@/hooks/getCityListData";
import { getSelectedCity } from "@/hooks/getCityListData";
import type { CitiesType } from "@/types";


const AdditionalLocationsModal = () => {
    const { hasMultipleCities, setHasMultipleCities, selectedCityGrouped: city } = useMapStore();
    const [citiesData, setCitiesData] = useState<CitiesType[]>([]);
    const [chosenRegion, setChosenRegion] = useState("");

    useEffect(() => {
        const loadCities = async () => {
            if (!city) return;
            try {
                const result = await getCitiesByRegion(city.ascii_name, city.region, city.country_name_en);
                setCitiesData(result);
            } catch (err) {
                console.error(err);
            }
        };

        loadCities();
    }, [city]);

    const handleSubmit = async () => {
        if (!city || !chosenRegion) return;

        const selectedCity = await getSelectedCity(city.ascii_name, chosenRegion, city.country_name_en);
        if (!selectedCity) return;

        useMapStore.getState().setSelectedCity(selectedCity);
        setHasMultipleCities(false);
    };

    return (
        <Dialog open={hasMultipleCities} onOpenChange={(open) => { if (!open) setHasMultipleCities(false); }}>
            <DialogContent className="border-sidebar-primary">
                <DialogHeader>
                    <DialogTitle>Multiple cities found</DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <ScrollArea className="h-fit max-h-[50vh] overflow-y-auto p-1.5">
                    <ScrollBar orientation="vertical" className="bg-sidebar-primary" />
                    <RadioButtonCardGroup
                        citiesData={citiesData}
                        chosenRegion={chosenRegion}
                        onRegionChange={setChosenRegion}
                    />
                </ScrollArea>
                <Button onClick={handleSubmit} disabled={!chosenRegion}>Submit</Button>
            </DialogContent>
        </Dialog>
    );
};

export default AdditionalLocationsModal;
