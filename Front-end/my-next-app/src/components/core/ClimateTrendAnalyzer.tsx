// src/components/core/ClimateTrendAnalyzer.tsx

import React, { useState } from 'react';
import { LocationInput } from '../ui/LocationInput'; // Updated Path
import { SummaryPanel } from '../visualizations/SummaryPanel'; // Updated Path
import { RiskGaugesPanel } from '../visualizations/RiskGaugesPanel'; // Updated Path
import { ConditionCardsPanel } from '../visualizations/ConditionCardsPanel'; // Updated Path
import { TrendGraph } from '../visualizations/TrendGraph'; // Updated Path
import { DownloadOptions } from '../ui/DownloadOptions'; // Updated Path
import { ClimateData, Condition } from '../../types/climate'; // New Type Import

// --- Dummy Data (Move to a separate mock file in a real project) ---
const dummyConditions: Condition[] = [
    { name: 'Heavy Rain', historical: 22, trendAdjusted: 28, mlProjection: 30, icon: '🌧️' },
    { name: 'Extreme Heat', historical: 10, trendAdjusted: 15, mlProjection: 18, icon: '🔥' },
    { name: 'High Winds', historical: 5, trendAdjusted: 4, mlProjection: 3, icon: '🌬️' },
];

const dummyData: ClimateData = {
    location: 'Paris, France',
    date: 'July 15, 2026',
    summary: 'On July 15 in Paris, the historical chance of heavy rain is 22% or the climate-adjusted probability is 28%, and the ML model projects 30%.',
    conditions: dummyConditions,
};
// --------------------------------------------------------------------

export const ClimateTrendAnalyzer: React.FC = () => {
    const [data, setData] = useState<ClimateData | null>(dummyData);
    const [loading, setLoading] = useState(false);

    const handleSearch = (location: string, date: string) => {
        // This is where you'd fetch data from your backend
        setLoading(true);
        setTimeout(() => {
            // Simulate a successful API call
            setData(dummyData);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Climate Trend Analyzer 🚀
            </h1>

            {/* Input */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
                <LocationInput onSearch={handleSearch} loading={loading} />
            </div>

            {loading && (
                <div className="text-center p-10">
                    <p className="text-lg text-gray-600 dark:text-gray-400">Analyzing NASA data and running models... 🛰️</p>
                </div>
            )}

            {/* Results Dashboard */}
            {data && !loading && (
                <div className="space-y-10">
                    <SummaryPanel data={data} />

                    <RiskGaugesPanel conditions={data.conditions.filter(c => c.name !== 'Discomfort Index')} />

                    <ConditionCardsPanel conditions={data.conditions} />

                    {/* Example of Trend Visualization */}
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
        </div>
    );
};