import { useState, useEffect } from 'react'

export const useFlagCodes = () => {
    const [flagCodesList, setFlagCodesList] = useState<Record<string, string>>({})

    useEffect(() => {
        const fetchCodesList = async () => {
            try {
                const response = await fetch('https://flagcdn.com/en/codes.json')
                const flagCodes = await response.json();
                setFlagCodesList(flagCodes)

            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchCodesList()

    }, [])

    return flagCodesList
};