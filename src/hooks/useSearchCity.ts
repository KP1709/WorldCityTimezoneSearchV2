import { searchCities } from "@/hooks/getCityListData";
import { useEffect, useState } from "react";

type SearchCityType = {
    debouncedQuery: string;
    searchExactCity: boolean;
};

export const useSearchCity = ({ debouncedQuery, searchExactCity }: SearchCityType) => {
    const [results, setResults] = useState<Awaited<ReturnType<typeof searchCities>>>([]);
    const [isError, setIsError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isCurrent = true;

        if (debouncedQuery.length === 0) {
            setResults([]);
            setIsError(null);
            setIsLoading(false);
            return () => { isCurrent = false; };
        }

        setIsLoading(true);
        searchCities(debouncedQuery, searchExactCity)
            .then((nextResults) => {
                if (!isCurrent) return;
                setResults(nextResults);
                setIsError(null);
            })
            .catch(() => {
                if (!isCurrent) return;
                setResults([]);
                setIsError("Unable to get search results");
            })
            .finally(() => {
                if (isCurrent) setIsLoading(false);
            });

        return () => { isCurrent = false; };
    }, [debouncedQuery, searchExactCity]);

    return { isError, isLoading, debouncedQuery, results };
};


