import { useState, useMemo, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/hooks/getCityListData";
import type { CitiesTypeGrouped } from "@/types";
import useDebounce from "@/hooks/useDebounce";
import useMapStore from "@/hooks/useMapStore";
import { useSearchCity } from "@/hooks/useSearchCity";

const NO_SEARCH_ITEMS_SHOWN = 5;

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showMoreResults, setShowMoreResults] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { setSelectedCity, setSelectedCityGrouped, setHasMultipleCities, setHasManyResults, setCityName } = useMapStore();

    const debouncedQuery = useDebounce(query, 200);
    const { isError, isLoading, results } = useSearchCity({ debouncedQuery, searchExactCity: false });

    useEffect(() => {
        if (!query) {
            setShowMoreResults(false);
            return;
        }
        const moreResults = results.filter(data => data.ascii_name.toLowerCase() === query.toLowerCase());
        if (moreResults.length > NO_SEARCH_ITEMS_SHOWN) {
            setShowMoreResults(true);
            setCityName(query);
        } else {
            setShowMoreResults(false);
        }
    }, [query, results, setShowMoreResults, setCityName]);

    const filteredResults = useMemo(() => {
        if (!query) return [];
        const filtered = results?.filter((result) =>
            result?.ascii_name.toLowerCase().includes(query.toLowerCase())
        );
        return filtered.slice(0, NO_SEARCH_ITEMS_SHOWN);
    }, [query, results]);

    useEffect(() => {
        if (!isTyping) return;
        setHighlightedIndex(0);
        setIsOpen(filteredResults.length > 0);
    }, [query, filteredResults, isTyping]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev === null || prev === filteredResults.length - 1 ? 0 : prev + 1
            );
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev === null || prev === 0 ? filteredResults.length - 1 : prev - 1
            );
        }

        if (e.key === "Enter" && highlightedIndex !== null && filteredResults.length > 0) {
            e.preventDefault();
            selectItem(filteredResults[highlightedIndex]);
            setIsOpen(false);
        }

        if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsTyping(true);
    };

    const selectItem = async (item: CitiesTypeGrouped) => {
        setQuery(item.ascii_name);
        setIsOpen(false);
        setIsTyping(false);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="w-60 absolute max-w-sm z-1 sm:w-full top-2 left-1 bg-accent rounded-md">
            <Input
                type="search"
                placeholder="Search city..."
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="bg-accent border-sidebar-primary"
            />

            {isError && (
                <Card className="absolute mt-2 w-full h-fit p-2 shadow-lg z-10">
                    <p className="text-red-500">{isError}</p>
                </Card>
            )}
            {isLoading && (
                <Card className="absolute mt-2 w-full h-fit p-2 shadow-lg z-10">
                    <p>Loading...</p>
                </Card>
            )}
            {(isOpen && !isError) && (
                <Card className="absolute mt-2 w-full h-fit p-2 shadow-lg border-sidebar-primary z-10">
                    <ul className="space-y-1">
                        {filteredResults.map((city, index) => {
                            if (!city) return null;
                            return (
                                <li
                                    key={city.geoname_id}
                                    className={`cursor-pointer rounded-md px-2 py-1 ${index === highlightedIndex ? "bg-muted" : "hover:bg-muted"}`}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    onClick={() => selectItem(city)}
                                >
                                    {city.ascii_name} - {''}
                                    {city.country_name_en}
                                </li>
                            );
                        })}
                        {showMoreResults &&
                            <li className='cursor-pointer rounded-md px-2 py-1'
                                onMouseEnter={() => setHighlightedIndex(0)}
                                onClick={() => setHasManyResults(true)}
                            >
                                Show more
                            </li>
                        }
                        {results.length > 0 && (
                            <li className="text-xs text-muted-foreground mt-2">
                                <span>City data provided by <a className='text-sidebar-primary underline' href='https://public.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000/table/?disjunctive.cou_name_en&sort=name'>OpenDataSoft</a>,</span>
                                <span> licensed under CC BY 4.0.</span>
                                <span className="text-destructive"> Not all cities will be searchable</span>
                            </li>
                        )}
                    </ul>
                </Card>
            )}
        </div>
    );
};

export default SearchBar;