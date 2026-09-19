import { useEffect, useMemo, useState } from "react";

export type SearchResultItem = {
    geoname_id: number;
    ascii_name: string;
    country_name_en: string;
    region: string[];
};

type UseSearchResultsListOptions = {
    query: string;
    items: SearchResultItem[];
    maxVisibleItems?: number;
};

export const useSearchResultsList = ({ query, items, maxVisibleItems = 5 }: UseSearchResultsListOptions) => {
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isUserTyping, setIsUserTyping] = useState(false);

    const matchingResults = useMemo(() => {
        if (!query) return [];
        return items.filter(({ ascii_name }) => ascii_name.toLowerCase() === query.toLowerCase());
    }, [items, query]);

    const filteredResults = useMemo(() => {
        if (!query) return [];
        return items
            .filter(({ ascii_name }) => ascii_name?.toLowerCase().startsWith(query.toLowerCase()))
            .slice(0, maxVisibleItems);
    }, [items, maxVisibleItems, query]);

    const hasMoreResults = matchingResults.length > maxVisibleItems;

    useEffect(() => {
        if (!isUserTyping) return;

        setHighlightedIndex(0);
        setIsOpen(filteredResults.length > 0);
    }, [filteredResults, isUserTyping]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setHighlightedIndex((prev) =>
                prev === null || prev === filteredResults.length - 1 ? 0 : prev + 1
            );
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setHighlightedIndex((prev) =>
                prev === null || prev === 0 ? filteredResults.length - 1 : prev - 1
            );
        }

        if (event.key === "Enter" && highlightedIndex !== null && filteredResults.length > 0) {
            event.preventDefault();
            return filteredResults[highlightedIndex];
        }

        if (event.key === "Escape") {
            setIsOpen(false);
        }

        return undefined;
    };

    const reset = () => {
        setIsUserTyping(false);
        setIsOpen(false);
        setHighlightedIndex(null);
    };

    return {
        filteredResults,
        hasMoreResults,
        highlightedIndex,
        isOpen,
        isUserTyping,
        setHighlightedIndex,
        setIsOpen,
        setIsUserTyping,
        handleKeyDown,
        reset,
    };
};
