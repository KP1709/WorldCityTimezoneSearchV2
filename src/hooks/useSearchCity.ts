import { searchCities } from "@/lib/getCityListData";
import { useEffect, useState } from "react";

type UseSearchCityOptions = {
    debouncedQuery: string;
    searchExactCity: boolean;
};

type SearchResults = Awaited<ReturnType<typeof searchCities>>;

export const useSearchCity = ({ debouncedQuery, searchExactCity }: UseSearchCityOptions) => {
    const [results, setResults] = useState<SearchResults>([]);
    const [isError, setIsError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isCurrent = true;

        if (debouncedQuery.length === 0) {
            return () => { isCurrent = false; };
        }

        const loadResults = async () => {
            setIsLoading(true);

            try {
                const nextResults = await searchCities(debouncedQuery, searchExactCity);
                if (!isCurrent) return;

                setResults(nextResults);
                setIsError(null);
            } catch {
                if (!isCurrent) return;

                setResults([]);
                setIsError("Unable to get search results");
            } finally {
                if (isCurrent) setIsLoading(false);
            }
        };

        loadResults();

        return () => { isCurrent = false; };
    }, [debouncedQuery, searchExactCity]);

    const hasQuery = debouncedQuery.length > 0;

    return {
        isError: hasQuery ? isError : null,
        isLoading: hasQuery && isLoading,
        results: hasQuery ? results : [],
    };
};


