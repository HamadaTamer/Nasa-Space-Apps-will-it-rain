// src/app/map-picker/page.tsx

"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapLoader } from '../../components/ui/MapLoader';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const INITIAL_COORDS = { lat: 30.0444, lng: 31.2357 }; // Default to Cairo

export default function FullScreenMapPicker() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialDate = searchParams.get('date') || '2026-07-15';

    const [date, setDate] = useState(initialDate);
    const [coords, setCoords] = useState(INITIAL_COORDS);

    const handleMapPin = (lat: number, lng: number) => {
        const newCoords = { lat, lng };
        setCoords(newCoords);

        // Automatically save and redirect after pin click
        handleSave(newCoords.lat, newCoords.lng);
    };

    const handleSave = (lat: number, lng: number) => {
        const locationString = `Map Pin: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        // Build the query string to pass data back to the dashboard
        const newSearchParams = new URLSearchParams();
        newSearchParams.set('location', locationString);
        newSearchParams.set('date', date);

        // Navigate back to the dashboard (or the route that initiated the request)
        router.push(`/dashboard?${newSearchParams.toString()}`);
    };

    return (
        // Use h-full and min-h-screen for stability without vertical overflow
        <div className="w-full h-full min-h-screen relative flex flex-col bg-gray-50 dark:bg-gray-900">

            {/* Top Control Bar (Fixed height) */}
            <div className="p-4 bg-white dark:bg-gray-800 shadow-lg flex items-center justify-between z-10">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </button>

                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Select Location (Global)</h1>

                {/* Date Input */}
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
            </div>

            {/* Map Container: Use flex-grow to occupy ALL remaining vertical space */}
            <div className="flex-grow relative overflow-hidden">
                <MapLoader
                    initialCoords={coords}
                    onSelectLocation={handleMapPin}
                    isMapVisible={true}
                />
                {/* Hint Overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-2 bg-black/70 text-white rounded-lg shadow-xl text-center z-10">
                    Click anywhere on the map to set the location and run the analysis instantly.
                </div>
            </div>
        </div>
    );
}