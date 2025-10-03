// src/components/core/ClimateTrendAnalyzer.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { SummaryPanel } from '../visualizations/SummaryPanel';
import { RiskGaugesPanel } from '../visualizations/RiskGaugesPanel';
import { ConditionCardsPanel } from '../visualizations/ConditionCardsPanel';
import { TrendGraph } from '../visualizations/TrendGraph';
import { DownloadOptions } from '../ui/DownloadOptions';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { ClimateData, Condition } from '../../types/climate';
import { useClimateParams } from '../../hooks/useClimateParams'; // New Hook Import
import Link from 'next/link';

// --- Dummy Data (Used as initial state) ---
// ... (initialData definition remains the same) ...
const dummyConditions: Condition[] = [
    { name: 'Heavy Rain', historical: 22, trendAdjusted: 28, mlProjection: 30, icon: '🌧️' },
    { name: 'Extreme Heat', historical: 10, trendAdjusted: 15, mlProjection: 18, icon: '🔥' },
    { name: 'High Winds', historical: 5, trendAdjusted: 4, mlProjection: 3, icon: '🌬️' },
];

const initialData: ClimateData = {
    location: 'Cairo, Egypt (30.0444, 31.2357)',
    date: 'July 15, 2026',
    summary: 'On July 15 in Paris, the historical chance of heavy rain is 22% or the climate-adjusted probability is 28%, and the ML model projects 30%.',
    conditions: dummyConditions,
};
// --------------------


export const ClimateTrendAnalyzer: React.FC = () => {

    // Read location/date from URL query parameters (after map-picker redirects)
    const { location: urlLocation, date: urlDate } = useClimateParams();

    const [data, setData] = useState<ClimateData | null>(null); // Start with null data
    const [loading, setLoading] = useState(false);

    // Function to run the analysis (triggered on page load/URL change)
    const runAnalysis = useCallback((loc: string, dt: string) => {
        setLoading(true);
        // Simulate API call using current URL data
        setTimeout(() => {
            setData({
                ...initialData,
                location: loc,
                date: dt,
                summary: `Analysis for ${loc} on ${dt}: Climate risks assessed using NASA data.`
            });
            setLoading(false);
        }, 1500);
    }, []);

    // Effect to trigger analysis when URL parameters change
    useEffect(() => {
        if (urlLocation && urlDate) {
            runAnalysis(urlLocation, urlDate);
        }
    }, [urlLocation, urlDate, runAnalysis]);


    // Custom 'Address Bar' now directs to the full-screen map picker
    const AddressBar = () => {
        // Construct the URL to pass the current date to the picker
        const pickerUrl = `/map-picker?date=${data?.date || urlDate}`;

        return (
            <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <Link
                    href={pickerUrl}
                    className="flex items-center justify-between w-full text-left transition-colors"
                >
                    <div className="flex items-center flex-grow min-w-0">
                        <MagnifyingGlassIcon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                        <span className="truncate text-lg font-medium text-gray-800 dark:text-gray-200">
                            Location: {data?.location || urlLocation}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="ml-4 p-2 rounded-full text-blue-600 bg-blue-100 dark:bg-blue-700/30 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors flex items-center shadow-md"
                        aria-label="Change Location and Date"
                    >
                        <MapPinIcon className="w-5 h-5" />
                    </button>
                </Link>
            </div>
        );
    };


    return (
        <div className="container mx-auto p-0">

            {/* 1. Address Bar/Map Trigger */}
            <AddressBar />

            {/* 2. Results Dashboard Section */}
            {loading && (
                <div className="text-center p-10">
                    <p className="text-lg text-gray-600 dark:text-gray-400">Analyzing NASA data and running models for {urlLocation} on {urlDate}... 🛰️</p>
                </div>
            )}

            {data && !loading ? (
                <div className="space-y-10 fade-in">
                    <SummaryPanel data={data} />
                    <RiskGaugesPanel conditions={data.conditions.filter(c => c.name !== 'Discomfort Index')} />
                    <ConditionCardsPanel conditions={data.conditions} />
                    <TrendGraph condition={data.conditions[0]} />
                    <DownloadOptions location={data.location} date={data.date} />
                </div>
            ) : (
                <div className="text-center p-10 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                        Select a location using the map pin above to begin analysis.
                    </p>
                </div>
            )}
        </div>
    );
};