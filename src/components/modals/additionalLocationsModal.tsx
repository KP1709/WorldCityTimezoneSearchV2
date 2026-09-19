import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import RadioButtonCardGroup from "@/components/modals/radioButtonCards";
import useMapStore from "@/hooks/useMapStore";
import { getCitiesByRegion } from "@/lib/getCityListData";
import { getSelectedCity } from "@/lib/getCityListData";
import type { CitiesType } from "@/types";
import { getRegionFullName } from "@/lib/getFullRegionName";
import { useFlagCodes } from "@/hooks/useFlagCodes";


const AdditionalLocationsModal = () => {
    const { hasMultipleCities, setHasMultipleCities, selectedCityGrouped: city } = useMapStore();
    const [citiesData, setCitiesData] = useState<CitiesType[]>([]);
    const [chosenRegion, setChosenRegion] = useState("");
    const flagCodes = useFlagCodes();

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

    const options = citiesData.map((item) => ({
        id: `${item.geoname_id}-${item.admin1_code}`,
        value: item.admin1_code,
        label: getRegionFullName(flagCodes, item.admin1_code, item.country_name_en),
    }));

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
                        options={options}
                        selectedValue={chosenRegion}
                        onValueChange={setChosenRegion}
                        legend="City region"
                        description="Select a region"
                    />
                </ScrollArea>
                <Button onClick={handleSubmit} disabled={!chosenRegion}>Submit</Button>
            </DialogContent>
        </Dialog>
    );
};

export default AdditionalLocationsModal;
