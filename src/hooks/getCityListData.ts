import type { CitiesType, CitiesTypeGrouped } from "@/types";
import { CITY_DATA_COLUMNS } from "@/data/cityDataColumns";
import cityDataUrl from "@/data/geonames-all-cities.csv?url";

const parseCityData = (data: string): CitiesType[] => {
    const rows = data.trim().split(/\r?\n/).slice(1);
    const {
        coordinates,
        admin1Code,
        asciiName,
        countryCode,
        countryName,
        geonameId,
        name,
        timezone
    } = CITY_DATA_COLUMNS;

    return rows.flatMap((row) => {
        const columns = row.split(";");
        if (!coordinates || Number.isNaN(geonameId)) return [];

        return [{
            geoname_id: Number(columns[geonameId]),
            name: columns[name]?.trim() ?? "",
            ascii_name: columns[asciiName]?.trim() ?? "",
            country_code: columns[countryCode]?.trim() ?? "",
            country_name_en: columns[countryName]?.trim() ?? "",
            admin1_code: columns[admin1Code]?.trim() ?? "",
            coordinates: columns[coordinates]?.trim(),
            timezone: columns[timezone]?.trim() ?? "",
        }];
    });
};

const citiesPromise = fetch(cityDataUrl)
    .then((response) => {
        if (!response.ok) throw new Error("Unable to load city data");
        return response.text();
    })
    .then(parseCityData);

const normalize = (value: string) => value.trim().toLocaleLowerCase();

export const searchCities = async (query: string, exact = false): Promise<CitiesTypeGrouped[]> => {
    const cities = await citiesPromise;
    const normalizedQuery = normalize(query);
    const matchingCities = cities.filter((city) => {
        const cityName = normalize(city.ascii_name);
        return exact ? cityName === normalizedQuery : cityName.startsWith(normalizedQuery);
    });

    const groupedCities = new Map<string, CitiesTypeGrouped>();

    matchingCities.forEach(({ ascii_name, country_name_en, admin1_code, geoname_id }) => {
        const key = `${normalize(ascii_name)}|${normalize(country_name_en)}`;
        const existingCity = groupedCities.get(key);
        if (existingCity) {
            if (!existingCity.region.includes(admin1_code)) {
                existingCity.region.push(admin1_code);
            }
            return;
        }

        groupedCities.set(key, {
            geoname_id: geoname_id,
            ascii_name: ascii_name,
            country_name_en: country_name_en,
            region: [admin1_code],
        });
    });

    return [...groupedCities.values()].sort((firstCity, secondCity) => {
        const firstName = normalize(firstCity.ascii_name);
        const secondName = normalize(secondCity.ascii_name);
        const firstExactMatch = firstName === normalizedQuery;
        const secondExactMatch = secondName === normalizedQuery;

        if (firstExactMatch !== secondExactMatch) {
            return firstExactMatch ? -1 : 1;
        }

        if (firstName.length !== secondName.length) {
            return firstName.length - secondName.length;
        }

        return firstName.localeCompare(secondName);
    });
};

export const getSelectedCity = async (city: string, region: string, country: string) => {
    const cities = await citiesPromise;

    return cities.find((item) =>
        normalize(item.ascii_name) === normalize(city) &&
        item.admin1_code === region &&
        normalize(item.country_name_en) === normalize(country)
    ) ?? null;
};

export const getCitiesByRegion = async (city: string, regions: string[], country: string) => {
    const cities = await citiesPromise;

    return cities.filter((item) =>
        normalize(item.ascii_name) === normalize(city) &&
        regions.includes(item.admin1_code) &&
        normalize(item.country_name_en) === normalize(country)
    );
};