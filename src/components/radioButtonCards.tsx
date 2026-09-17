import { useEffect, useState } from "react";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { getRegionFullName } from "@/hooks/getFullRegionName";
import { useFlagCodes } from "@/hooks/useFlagCodes";
import type { CitiesType } from "@/types";

type citiesInfoType = CitiesType & { regionName: string; };
type RadioButtonCardGroupProps = {
    citiesData: CitiesType[];
    chosenRegion: string;
    onRegionChange: (region: string) => void;
};

const RadioButtonCardGroup = ({ citiesData, chosenRegion, onRegionChange }: RadioButtonCardGroupProps) => {
    const flagCodes = useFlagCodes();
    const [citiesInfo, setCitiesInfo] = useState<citiesInfoType[]>([]);

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
                    value={chosenRegion}
                    onValueChange={onRegionChange}
                >
                    {citiesInfo.map((city) => {
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
                </RadioGroup>
            </FieldSet>
        </FieldGroup>
    );
};
export default RadioButtonCardGroup;