// src/components/core/ClimateTrendAnalyzer.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { SummaryPanel } from '../visualizations/SummaryPanel';
import { RiskGaugesPanel } from '../visualizations/RiskGaugesPanel';
import { ConditionCardsPanel } from '../visualizations/ConditionCardsPanel';
import { TrendGraph } from '../visualizations/TrendGraph';
import { DownloadOptions } from '../ui/DownloadOptions';
import { LocationModal } from '../ui/LocationModal'; // Import the Modal
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { ClimateData, Condition } from '../../types/climate';

// --- Dummy Data ---
const dummyConditions: Condition[] = [
    { name: 'Heavy Rain', historical: 22, trendAdjusted: 28, mlProjection: 30, icon: '🌧️' },
    { name: 'Extreme Heat', historical: 10, trendAdjusted: 15, mlProjection: 18, icon: '🔥' },
    { name: 'High Winds', historical: 5, trendAdjusted: 4, mlProjection: 3, icon: '🌬️' },
];

const initialData: ClimateData = {
    location: 'Cairo, Egypt (30.0444, 31.2357)',
    date: 'July 15, 2026',
    summary: 'On July 15 in Cairo, the climate-adjusted chance of heavy rain is 28%, and extreme heat has a 15% adjusted probability.',
    conditions: dummyConditions,
};
// --------------------
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";


export const ClimateTrendAnalyzer: React.FC = () => {

    const [data, setData] = useState<ClimateData | null>(initialData);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const runAnalysis = useCallback((loc: string, dt: string) => {
  setLoading(true);
  
  fetch(`${API_BASE}/api/v1/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: loc,        // e.g. "Cairo, Egypt (30.0444, 31.2357)"
      date: dt,             // e.g. "July 15, 2026"
      activity: "picnic"    // or pass whatever you collect elsewhere
    })
  })
  .then(async (res) => {
    if (!res.ok) throw new Error(`API ${res.status}`);
    const json = await res.json(); // <- already ClimateData shape
    setData(json);
  })
  .catch((e) => {
    console.error(e);
    // fallback: keep your previous placeholder behavior if you want
    setData({
      ...initialData,
      location: loc,
      date: dt,
      summary: `Analysis for ${loc} on ${dt}: (fallback placeholder)`,
      conditions: initialData.conditions
    });
  })
  .finally(() => setLoading(false));
}, []);
 

    // Custom 'Address Bar' now directs to the full-screen map picker
    const AddressBar = () => {
        return (
            <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-between w-full text-left transition-colors"
                >
                    <div className="flex items-center flex-grow min-w-0">
                        <MagnifyingGlassIcon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                        <span className="truncate text-lg font-medium text-gray-800 dark:text-gray-200">
                            Location: {data?.location || "Select location to run analysis..."}
                        </span>
                    </div>

                    <div
                        className="ml-4 p-2 rounded-full text-blue-600 bg-blue-100 dark:bg-blue-700/30 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors flex items-center shadow-md"
                        aria-label="Change Location and Date"
                    >
                        <MapPinIcon className="w-5 h-5" />
                    </div>
                </button>
            </div>
        );
    };


    return (
        <div className="container mx-auto p-0">

            <AddressBar />

            {/* Results Dashboard Section */}
            {loading && (
                <div className="text-center p-10">
                    <p className="text-lg text-gray-600 dark:text-gray-400">Analyzing NASA data... 🛰️</p>
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

            {/* The Modal Component */}
            <LocationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSearch={runAnalysis}
                loading={loading}
            />
        </div>
    );
};