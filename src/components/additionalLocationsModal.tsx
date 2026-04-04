import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import RadioButtonCardGroup from "@/components/radioButtonCards";
import useMapStore from "@/hooks/useMapStore";
import { supabase } from "@/hooks/getCityListData";
import type { CitiesType } from "@/types";


const getCitiesByRegion = async (city: string, region: string[], country: string) => {
    const { data, error } = await supabase.rpc('get_cities_by_region', { city_selected: city, region_selected: region, country_selected: country });
    return { data, error };
};
export function AdditionalLocationsModal() {
    const { hasMultipleCities, setHasMultipleCities, selectedCityGrouped: city } = useMapStore();
    const [citiesData, setCitiesData] = useState<CitiesType[]>([]);

    useEffect(() => {
        async function loadCities() {
            if (!city) return;
            try {
                const result = await getCitiesByRegion(
                    city.ascii_name,
                    city.region,
                    city.country_name_en
                );
                setCitiesData(result.data);
            } catch (err) {
                console.error(err);
            }
        }

        loadCities();
    }, [city]);

    return (
        <Dialog open={hasMultipleCities} onOpenChange={() => setHasMultipleCities(false)}>
            <DialogContent className="border-sidebar-primary">
                <DialogHeader>
                    <DialogTitle>Multiple cities found</DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <ScrollArea className="h-fit max-h-[50vh] overflow-y-auto p-1.5">
                    <ScrollBar orientation="vertical" className="bg-sidebar-primary" />
                    <RadioButtonCardGroup citiesData={citiesData} />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
