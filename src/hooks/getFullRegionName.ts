export function getRegionFullName(codesList: Record<string, string>, regionCode: string, selectedCountry: string, alternativeWord = false) {
    if (selectedCountry === 'United States') {
        if (regionCode === 'DC' && alternativeWord) {
            return 'D.C (Washington)';
        }
        else if (regionCode === 'DC' && !alternativeWord) {
            return 'Washington D.C';
        }
        return codesList[`us-${regionCode.toLowerCase()}`];
    }
    if (selectedCountry === 'United Kingdom') {
        return codesList[`gb-${regionCode.toLowerCase()}`];
    }

    return regionCode;

}