import type { CitiesTypeGrouped } from "@/types";
import { useEffect, useState } from "react";
import { supabase } from "@/hooks/getCityListData";

type SearchCityType = {
    debouncedQuery: string;
    searchExactCity: boolean;
};

export const useSearchCity = ({ debouncedQuery, searchExactCity }: SearchCityType) => {
    const [isError, setIsError] = useState<string | null>(null);
    const [results, setResults] = useState<CitiesTypeGrouped[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (debouncedQuery.length === 0) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        const fetchResults = async () => {
            setIsError(null);
            setIsLoading(true);

            const { data, error } = await supabase.rpc(
                `${searchExactCity ? 'get_search_city_exact' : 'get_search_city'}`,
                { city_selected: debouncedQuery });

            if (error) {
                if (error.message.includes('Failed to fetch')) {
                    setIsError('Unable to get search results');
                }
                setResults([]);
                setIsLoading(false);
                return;
            }
            else {
                setResults(data.map((item: CitiesTypeGrouped) => ({
                    'geoname_id': item.geoname_id,
                    'ascii_name': item.ascii_name,
                    'country_name_en': item.country_name_en,
                    'region': item.region,
                })) || []);
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    return { isError, isLoading, debouncedQuery, results };
};


