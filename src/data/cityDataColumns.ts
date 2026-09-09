// Index of the columns in the geonames-all-cities.csv file

export const CITY_DATA_COLUMNS = {
    geonameId: 0,
    name: 1,
    asciiName: 2,
    countryCode: 6,
    countryName: 7,
    admin1Code: 9,
    timezone: 16,
    coordinates: 19,
} as const;