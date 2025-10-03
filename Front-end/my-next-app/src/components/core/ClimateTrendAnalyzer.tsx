// src/components/core/ClimateTrendAnalyzer.tsx

import React, { useState } from 'react';
import { SummaryPanel } from '../visualizations/SummaryPanel';
import { RiskGaugesPanel } from '../visualizations/RiskGaugesPanel';
import { ConditionCardsPanel } from '../visualizations/ConditionCardsPanel';
import { TrendGraph } from '../visualizations/TrendGraph';
import { DownloadOptions } from '../ui/DownloadOptions';
import { LocationModal } from '../ui/LocationModal'; // New Import
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline'; // New Import
import { ClimateData, Condition } from '../../types/climate';

// --- Dummy Data ---
const dummyConditions: Condition[] = [
    { name: 'Heavy Rain', historical: 22, trendAdjusted: 28, mlProjection: 30, icon: '🌧️' },
    { name: 'Extreme Heat', historical: 10, trendAdjusted: 15, mlProjection: 18, icon: '🔥' },
    { name: 'High Winds', historical: 5, trendAdjusted: 4, mlProjection: 3, icon: '🌬️' },
];

const initialData: ClimateData = {
    location: 'Paris, France (48.8566, 2.3522)',
    date: 'July 15, 2026',
    summary: 'On July 15 in Paris, the historical chance of heavy rain is 22% or the climate-adjusted probability is 28%, and the ML model projects 30%.',
    conditions: dummyConditions,
};
// --------------------

export const ClimateTrendAnalyzer: React.FC = () => {
    const [data, setData] = useState<ClimateData | null>(initialData);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal State

    const handleSearch = (location: string, date: string) => {
        setLoading(true);
        // Simulate API call and set data
        setTimeout(() => {
            setData({
                ...initialData,
                location: location,
                date: date,
                // Simulate adjusted data based on new search
                summary: `Analysis run for ${location} on ${date}: The climate-adjusted probability of heavy rain is now 35%.`
            });
            setLoading(false);
        }, 1500);
    };

    // Custom 'Address Bar' for the dashboard route
    // Custom 'Address Bar' for the dashboard route
    const AddressBar = () => (
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
                {/* Location Display */}
                <div className="flex items-center flex-grow min-w-0">
                    <MagnifyingGlassIcon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                    <span className="truncate text-lg font-medium text-gray-800 dark:text-gray-200">
                        {data?.location || "Select location to run analysis..."}
                    </span>
                </div>

                {/* Map Icon/Modal Trigger */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="ml-4 p-2 rounded-full text-blue-600 bg-blue-100 dark:bg-blue-700/30 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors flex items-center shadow-md"
                    title="Change Location and Date"
                >
                    <MapPinIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-0">

            {/* 1. Address Bar/Modal Trigger */}
            <AddressBar />

            {/* 2. Results Dashboard Section */}
            {loading && (
                <div className="text-center p-10">
                    <p className="text-lg text-gray-600 dark:text-gray-400">Analyzing NASA data and running models... 🛰️</p>
                </div>
            )}

            {data && !loading && (
                <div className="space-y-10 fade-in">
                    <SummaryPanel data={data} />
                    <RiskGaugesPanel conditions={data.conditions.filter(c => c.name !== 'Discomfort Index')} />
                    <ConditionCardsPanel conditions={data.conditions} />
                    <TrendGraph condition={data.conditions[0]} />
                    <DownloadOptions location={data.location} date={data.date} />
                </div>
            )}

            {!data && !loading && (
                <div className="text-center p-10 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                        Enter a location and date to begin analysis.
                    </p>
                </div>
            )}

            {/* 3. The Modal Component */}
            <LocationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSearch={handleSearch}
                loading={loading}
            />
        </div>
    );
};