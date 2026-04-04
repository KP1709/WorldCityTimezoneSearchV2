import { useEffect, useState } from "react"
import type { latLngType } from "../types"
import useMapStore from "./useMapStore"

export const getTimeZoneData = (markerPosition: latLngType, delay?: number) => {
    const { timezoneCity, setTimezoneCity } = useMapStore()
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        setIsError(false)
        setTimeout(() => {
            if (markerPosition === null) return

            const fetchData = async () => {
                try {
                    const response = await fetch(
                        `https://api.timezonedb.com/v2.1/get-time-zone?key=${import.meta.env.VITE_TIMEZONEDB_KEY}&format=json&by=position&lat=${markerPosition[0]}&lng=${markerPosition[1]}`
                    );
                    const data = await response.json()
                    setTimezoneCity(data)
                    setIsLoading(false)

                } catch (error) {
                    console.error('Error fetching data:', error)
                    setIsLoading(false)
                    setIsError(true)
                }
            }
            fetchData()

        }, delay)

    }, markerPosition)

    return { timezoneCity, isLoading, isError }
}
