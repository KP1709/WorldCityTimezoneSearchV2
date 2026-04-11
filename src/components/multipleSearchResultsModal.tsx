import useMapStore from "@/hooks/useMapStore";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSearchCity } from "@/hooks/useSearchCity";
import { supabase } from "@/hooks/getCityListData";
import type { CitiesTypeGrouped } from "@/types";

const MultipleSearchResultsModal = () => {
    const { hasManyResults, setHasManyResults, cityName, setSelectedCity, setHasMultipleCities, setSelectedCityGrouped } = useMapStore();
    const { results } = useSearchCity({ debouncedQuery: cityName, searchExactCity: true });

    const selectItem = async (item: CitiesTypeGrouped) => {
        if (item.region.length === 1) {
            const { data, error } = await supabase.rpc('get_selected_city', { city_selected: item.ascii_name, region_selected: item.region[0], country_selected: item.country_name_en });

            if (!error) {
                setSelectedCity({
                    'geoname_id': data[0].geonname_id,
                    'name': data[0].name,
                    'ascii_name': data[0].ascii_name,
                    'country_code': data[0].country_code,
                    'country_name_en': data[0].country_name_en,
                    'admin1_code': data[0].admin1_code,
                    'coordinates': data[0].coordinates,
                    'timezone': data[0].timezone
                });
            }
            else {
                console.error('Error fetching selected city:', error);
            }
        }
        else if (item.region.length > 1) {
            setHasMultipleCities(true);
            setSelectedCityGrouped({
                'geoname_id': item.geoname_id,
                'ascii_name': item.ascii_name,
                'country_name_en': item.country_name_en,
                'region': item.region
            });
        }
    };

    const handleResultsSelect = ({ ascii_name, country_name_en, region, geoname_id }: CitiesTypeGrouped) => {
        selectItem({ ascii_name, country_name_en, region, geoname_id });
    };

    return (
        <Dialog open={hasManyResults} onOpenChange={() => setHasManyResults(false)}>
            <DialogContent className="border-sidebar-primary">
                <DialogHeader>
                    <DialogTitle>Multiple cities found</DialogTitle>
                </DialogHeader>
                <DialogDescription>Select a country</DialogDescription>
                <ScrollArea className="h-fit max-h-[50vh] overflow-y-auto p-1.5">
                    <ScrollBar orientation="vertical" className="bg-sidebar-primary" />
                    <ul>
                        {results?.map((test) => {
                            return (
                                <li className='cursor-pointer rounded-md px-2 py-1 hover:bg-muted'
                                    key={test.geoname_id}
                                    onClick={() => { handleResultsSelect(test); setHasManyResults(false); }} >
                                    {test.country_name_en}
                                </li>
                            );
                        })}
                    </ul>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default MultipleSearchResultsModal;
