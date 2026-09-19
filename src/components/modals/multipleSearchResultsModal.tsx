import useMapStore from "@/hooks/useMapStore";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSearchCity } from "@/hooks/useSearchCity";
import { getSelectedCity } from "@/lib/getCityListData";
import type { CitiesTypeGrouped } from "@/types";
import { useState } from "react";
import RadioButtonCardGroup from "@/components/modals/radioButtonCards";

const MultipleSearchResultsModal = () => {
    const { hasManyResults, setHasManyResults, cityName, setSelectedCity, setHasMultipleCities, setSelectedCityGrouped } = useMapStore();
    const { results } = useSearchCity({ debouncedQuery: cityName, searchExactCity: true });
    const [countrySelected, setCountrySelected] = useState<string>("");

    const selectItem = async (item: CitiesTypeGrouped) => {
        if (item.region.length === 1) {
            setSelectedCity(await getSelectedCity(item.ascii_name, item.region[0], item.country_name_en));
            return;
        }

        if (item.region.length > 1) {
            setHasMultipleCities(true);
            setSelectedCityGrouped({
                geoname_id: item.geoname_id,
                ascii_name: item.ascii_name,
                country_name_en: item.country_name_en,
                region: item.region
            });
        }
    };

    const handleResultsSelect = () => {
        if (countrySelected === "") return;
        const selectedResult = results.find((item) => item.country_name_en === countrySelected);
        if (selectedResult) selectItem(selectedResult);
    };

    const options = results.map((item) => ({
        id: `${item.geoname_id}-${item.country_name_en}`,
        value: item.country_name_en,
        label: item.country_name_en,
    }));

    return (
        <Dialog open={hasManyResults} onOpenChange={(open) => { if (!open) setHasManyResults(false); }}>
            <DialogContent className="border-sidebar-primary">
                <DialogHeader>
                    <DialogTitle>Multiple cities found</DialogTitle>
                </DialogHeader>
                <DialogDescription>Select a country</DialogDescription>
                <ScrollArea className="h-fit max-h-[50vh] overflow-y-auto p-1.5">
                    <ScrollBar orientation="vertical" className="bg-sidebar-primary" />
                    <RadioButtonCardGroup
                        options={options}
                        selectedValue={countrySelected}
                        onValueChange={setCountrySelected}
                        legend="Country"
                        description="Select a country"
                    />
                </ScrollArea>
                <Button onClick={() => { handleResultsSelect(); setHasManyResults(false); }} disabled={!countrySelected}>Submit</Button>
            </DialogContent>
        </Dialog>
    );
};

export default MultipleSearchResultsModal;
