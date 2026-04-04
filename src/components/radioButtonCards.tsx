import { useEffect, useState } from "react";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import useMapStore from "@/hooks/useMapStore";
import { getRegionFullName } from "@/hooks/getFullRegionName";
import { supabase } from "@/hooks/getCityListData";
import { useFlagCodes } from "@/hooks/useFlagCodes";
import type { CitiesType } from "@/types";

type citiesInfoType = CitiesType & { regionName: string; };

const RadioButtonCardGroup = ({ citiesData }: { citiesData: CitiesType[]; }) => {
    const flagCodes = useFlagCodes();
    const [citiesInfo, setCitiesInfo] = useState<citiesInfoType[]>([]);
    const [chosenRegion, setChosenRegion] = useState<string>("");
    const { setHasMultipleCities, setSelectedCity } = useMapStore();
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!Array.isArray(citiesData) || citiesData.length === 0) {
            setCitiesInfo([]);
            return;
        }
        const updateRegionName = citiesData.map((city) => ({
            ...city,
            regionName: getRegionFullName(flagCodes, city.admin1_code, city.country_name_en),
        }));
        setCitiesInfo(updateRegionName);
    }, [flagCodes, citiesData]);

    useEffect(() => {
        const fetchCityData = async () => {
            const { data, error } = await supabase.rpc('get_selected_city', {
                city_selected: citiesInfo[0]?.ascii_name,
                region_selected: chosenRegion,
                country_selected: citiesInfo[0]?.country_name_en
            });

            if (!error && data.length !== 0) {
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
            if (error) {
                console.error('Error fetching city data:', error);
                setIsError(true);
            }
        };
        if (chosenRegion) {
            fetchCityData();
        }

    }, [chosenRegion]);

    return (
        <FieldGroup className="w-full">
            <FieldSet>
                <FieldLegend variant="label">City region</FieldLegend>
                <FieldDescription>
                    Select a region
                </FieldDescription>
                <RadioGroup
                    className='grid sm:grid-cols-2 md:grid-cols-3'
                    defaultValue=""
                    onValueChange={(val) => { setChosenRegion(val); setHasMultipleCities(false); }}
                >
                    {!isError && citiesInfo.map((city) => {
                        return (
                            <FieldLabel className="border-sidebar-primary hover:border-sidebar-primary-foreground cursor-pointer" key={city.geoname_id} htmlFor={city.regionName} >
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>{city.regionName}</FieldTitle>
                                    </FieldContent>
                                    <RadioGroupItem className='cursor-pointer border-sidebar-primary' value={city.admin1_code} id={city.regionName} />
                                </Field>
                            </FieldLabel>
                        );
                    })}
                    {isError &&
                        <p className="text-destructive">
                            An error occurred while fetching city regions. Please try again later.
                        </p>
                    }
                </RadioGroup>
            </FieldSet>
        </FieldGroup>
    );
};
export default RadioButtonCardGroup;