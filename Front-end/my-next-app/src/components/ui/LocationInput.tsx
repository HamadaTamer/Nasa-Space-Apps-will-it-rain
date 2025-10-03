// src/components/ui/LocationInput.tsx

import React, { useState } from 'react';

interface LocationInputProps {
    onSearch: (location: string, date: string) => void;
    loading: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({ onSearch, loading }) => {
    const [location, setLocation] = useState('Paris, France');
    const [date, setDate] = useState('2026-07-15');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(location, date);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            {/* Location Input */}
            <div className="flex-1">
                <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Location (via text search, map pin, or coordinates)
                </label>
                <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="e.g., Paris, 48.8566, 2.3522"
                />
            </div>

            {/* Date Input */}
            <div className="flex-1 max-w-sm">
                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Target Date (Months in Advance)
                </label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>

            {/* Search Button */}
            <div className="md:self-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
                >
                    {loading ? 'Analyzing...' : 'Analyze Climate'}
                </button>
            </div>
        </form>
    );
};