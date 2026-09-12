import useMapStore from "@/hooks/useMapStore";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSearchCity } from "@/hooks/useSearchCity";
import { getSelectedCity } from "@/hooks/getCityListData";
import type { CitiesTypeGrouped } from "@/types";
import { FieldLabel, Field, FieldContent, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

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
                'geoname_id': item.geoname_id,
                'ascii_name': item.ascii_name,
                'country_name_en': item.country_name_en,
                'region': item.region
            });
        }
    };

    const handleResultsSelect = (item: CitiesTypeGrouped) => selectItem(item);

    useEffect(() => {
        if (countrySelected === "") return;
        const selectedResult = results.find((item) => item.country_name_en === countrySelected);
        if (selectedResult) handleResultsSelect(selectedResult);
    }, [countrySelected]);

    return (
        <Dialog open={hasManyResults} onOpenChange={() => setHasManyResults(false)}>
            <DialogContent className="border-sidebar-primary">
                <DialogHeader>
                    <DialogTitle>Multiple cities found</DialogTitle>
                </DialogHeader>
                <DialogDescription>Select a country</DialogDescription>
                <ScrollArea className="h-fit max-h-[50vh] overflow-y-auto p-1.5">
                    <ScrollBar orientation="vertical" className="bg-sidebar-primary" />
                    <RadioGroup
                        className='grid sm:grid-cols-2 md:grid-cols-3'
                        defaultValue=""
                        onValueChange={(value) => { setCountrySelected(value); setHasManyResults(false); }}
                    >
                        {results.map(({ country_name_en, geoname_id }) => {
                            return (
                                <FieldLabel className="border-sidebar-primary hover:border-sidebar-primary-foreground cursor-pointer" key={geoname_id} htmlFor={country_name_en} >
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>{country_name_en}</FieldTitle>
                                        </FieldContent>
                                        <RadioGroupItem className='cursor-pointer border-sidebar-primary' value={country_name_en} id={country_name_en} />
                                    </Field>
                                </FieldLabel>
                            );
                        })}
                    </RadioGroup>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default MultipleSearchResultsModal;
