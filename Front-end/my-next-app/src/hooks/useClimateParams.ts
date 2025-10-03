// src/hooks/useClimateParams.ts (New file in src/hooks)

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

// Defines the shape of the data pulled from the URL
interface ClimateParams {
    location: string;
    date: string;
}

const DEFAULT_LOCATION = 'Cairo, Egypt (30.0444, 31.2357)';
const DEFAULT_DATE = '2026-07-15';

export const useClimateParams = (): ClimateParams => {
    const searchParams = useSearchParams();

    // Read values from the URL query string
    const urlLocation = searchParams.get('location');
    const urlDate = searchParams.get('date');

    const [location, setLocation] = useState(urlLocation || DEFAULT_LOCATION);
    const [date, setDate] = useState(urlDate || DEFAULT_DATE);

    useEffect(() => {
        // Update state if URL parameters change (i.e., when user returns from map-picker)
        if (urlLocation && urlLocation !== location) {
            setLocation(urlLocation);
        }
        if (urlDate && urlDate !== date) {
            setDate(urlDate);
        }
    }, [urlLocation, urlDate, location, date]);

    return { location, date };
};