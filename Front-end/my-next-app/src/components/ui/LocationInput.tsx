// src/components/ui/LocationInput.tsx

import React, { useState, useMemo } from 'react';
import MapPicker from './MapPicker'; // Import the new MapPicker

interface LocationInputProps {
    onSearch: (location: string, date: string) => void;
    loading: boolean;
    onClose: () => void; // Added prop to close the modal after analysis
}

const INITIAL_COORDS = { lat: 30.0444, lng: 31.2357 }; // Default to Cairo

export const LocationInput: React.FC<LocationInputProps> = ({ onSearch, loading, onClose }) => {

    const [location, setLocation] = useState(`Map Pin: ${INITIAL_COORDS.lat.toFixed(4)}, ${INITIAL_COORDS.lng.toFixed(4)}`);
    const [date, setDate] = useState('2026-07-15');
    const [coords, setCoords] = useState(INITIAL_COORDS);

    const handleMapPin = (lat: number, lng: number) => {
        const newLocation = `Map Pin: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setCoords({ lat, lng });
        setLocation(newLocation);

        // Automatically trigger analysis and close modal upon pin click
        onSearch(newLocation, date);
        onClose();
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setDate(newDate);
        // Optional: Rerun analysis with the new date but existing location
        if (location && !loading) {
            onSearch(location, newDate);
        }
    };

    return (
        <div className="flex flex-col gap-4">

            {/* 1. Date Input Block */}
            <div className="flex justify-center p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-xs w-full">
                    <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                        Target Date:
                    </label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={handleDateChange}
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        disabled={loading}
                    />
                </div>
            </div>

            {/* 2. Map Block */}
            <div className="mt-2 relative">
                <MapPicker
                    initialCoords={coords}
                    onSelectLocation={handleMapPin}
                />

                {/* Current Location Display (Feedback for the user) */}
                <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Selected Location: <span className="font-semibold text-blue-500">{location}</span>
                </div>
            </div>

        </div>
    );
};