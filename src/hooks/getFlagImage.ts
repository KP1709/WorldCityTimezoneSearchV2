import type { CitiesType } from '../types';

export const getFlagImage = (chosenCity: CitiesType, flagCodesList: Record<string, string>) => {
    const { country_code, admin1_code } = chosenCity;

    const FLAGSIZE = 'h40';
    const mainFlagCode = country_code.toLowerCase();
    const secondaryFlagCode = `${country_code.toLowerCase()}-${admin1_code.toLowerCase()}`;

    let mainFlag = '';
    let secondaryFlag = '';

    if (flagCodesList[mainFlagCode]) {
        mainFlag = `https://flagcdn.com/${FLAGSIZE}/${mainFlagCode}.png`;
    }

    if (flagCodesList[secondaryFlagCode]) {
        secondaryFlag = `https://flagcdn.com/${FLAGSIZE}/${secondaryFlagCode}.png`;
    }

    // Washington DC flag doesn't actually appear in flag CDN (should be different flag to Washington)
    if (admin1_code === 'DC') {
        secondaryFlag = `https://flagcdn.com/${FLAGSIZE}/us-wa.png`;
    }

    return { flags: { mainFlag, secondaryFlag } };
};

