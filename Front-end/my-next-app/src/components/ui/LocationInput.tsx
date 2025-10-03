// src/components/ui/LocationInput.tsx

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPinIcon } from '@heroicons/react/24/outline';

// Dynamically import the Leaflet map component
const LeafletPicker = dynamic(
    () => import('./LeafletPicker').then(mod => mod.LeafletPicker),
    { ssr: false, loading: () => <p className="text-center p-6 text-gray-500 dark:text-gray-400">Loading Map...</p> }
);

interface LocationInputProps {
    onSearch: (location: string, date: string) => void;
    loading: boolean;
    isModalOpen: boolean; // Passed from LocationModal
}

export const LocationInput: React.FC<LocationInputProps> = ({ onSearch, loading, isModalOpen }) => {
    const initialCoords = { lat: 48.8566, lng: 2.3522 };
    const [location, setLocation] = useState('Paris, France (48.8566, 2.3522)');
    const [date, setDate] = useState('2026-07-15');
    const [useMap, setUseMap] = useState(false);
    const [coords, setCoords] = useState(initialCoords);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(location, date);
    };

    const handleMapPin = (lat: number, lng: number) => {
        const newLocation = `Map Pin: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setCoords({ lat, lng });
        setLocation(newLocation);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Location and Date Inputs */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Location Input */}
                <div className="flex-1">
                    <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Location (Selected or Manually Entered)</label>
                    <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g., Paris, 48.8566, 2.3522" disabled={loading} />
                </div>
                {/* Date Input */}
                <div className="flex-1 max-w-sm">
                    <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Target Date</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" disabled={loading} />
                </div>
            </div>

            {/* Map Toggler */}
            <div className="mb-4">
                <button
                    type="button"
                    onClick={() => setUseMap(!useMap)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors disabled:opacity-50"
                    disabled={loading}
                >
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    {useMap ? 'Hide Map Picker' : 'Use Map to Pin Location'}
                </button>
            </div>

            {/* Map Interface (Conditional Render) */}
            {useMap && (
                <div className="mb-4">
                    <LeafletPicker
                        initialCoords={coords}
                        onSelectLocation={handleMapPin}
                        isMapVisible={useMap && isModalOpen} // Pass combined state
                    />
                </div>
            )}

            {/* Run Analysis Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
                {loading ? 'Analyzing NASA Data... 🛰️' : 'Run Climate Analysis'}
            </button>
        </form>
    );
};