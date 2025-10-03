// src/components/core/ClimateTrendAnalyzer.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { SummaryPanel } from '../visualizations/SummaryPanel';
import { RiskGaugesPanel } from '../visualizations/RiskGaugesPanel';
import { ConditionCardsPanel } from '../visualizations/ConditionCardsPanel';
import { TrendGraph } from '../visualizations/TrendGraph';
import { DownloadOptions } from '../ui/DownloadOptions';
import { LocationModal } from '../ui/LocationModal';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { ClimateData, Condition   } from '../../types/climate';

// --- Updated Dummy Data to match your Condition type ---
const dummyConditions: Condition[] = [
    { 
        name: 'Heavy Rain', 
        rainType: 'Heavy Rain', 
        confidence: 0.30, 
        temperature: 25, 
        windSpeed: 15 
    },
    { 
        name: 'Extreme Heat', 
        rainType: 'No Rain', 
        confidence: 0.18, 
        temperature: 38, 
        windSpeed: 8 
    },
    { 
        name: 'High Winds', 
        rainType: 'Light Rain', 
        confidence: 0.10, 
        temperature: 20, 
        windSpeed: 25 
    },
];

const initialData: ClimateData = {
    location: 'Cairo, Egypt (30.0444, 31.2357)',
    date: 'July 15, 2026',
    summary: 'On July 15 in Cairo, expect heavy rain with 30% confidence, temperature around 25°C, and wind speed of 15 km/h.',
    conditions: dummyConditions,
};
// --------------------
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

// Interface for the activity endpoint response
interface ActivityPrediction {
    humidity: number;
    temperature: number;
    rain: string;
    wind_speed: number;
    rain_confidence: number;
    input_year: number;
    input_month: number;
    input_lat: number;
    input_lon: number;
}

interface ActivityResponse {
    inputs: {
        date: string;
        lat: number;
        lon: number;
        activity: string;
    };
    prediction: ActivityPrediction;
}

export const ClimateTrendAnalyzer: React.FC = () => {
    const [data, setData] = useState<ClimateData | null>(initialData);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const runAnalysis = useCallback((loc: string, dt: string, lat?: number, lon?: number) => {
        setLoading(true);
        
        // Extract coordinates from location string if not provided directly
        let latitude = lat;
        let longitude = lon;
        
        if (!latitude || !longitude) {
            // Try to extract coordinates from location string like "Cairo, Egypt (30.0444, 31.2357)"
            const coordMatch = loc.match(/\(([-\d.]+),\s*([-\d.]+)\)/);
            if (coordMatch) {
                latitude = parseFloat(coordMatch[1]);
                longitude = parseFloat(coordMatch[2]);
            }
        }
        
        // Fallback coordinates if none found
        if (!latitude || !longitude) {
            latitude = 30.0444; // Default Cairo coordinates
            longitude = 31.2357;
        }

        // Convert date to ISO format (YYYY-MM-DD)
        const dateObj = new Date(dt);
        const isoDate = dateObj.toISOString().split('T')[0];

        // Call the activity endpoint directly
        fetch(`${API_BASE}/api/v1/activity`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: isoDate,
                lat: latitude,
                lon: longitude,
                activity: "outdoor"
            })
        })
        .then(async (res) => {
            if (!res.ok) throw new Error(`API ${res.status}`);
            const response: ActivityResponse = await res.json();
            
            // Transform the activity endpoint response to ClimateData format
            const transformedData: ClimateData = {
                location: loc,
                date: dt,
                summary: generateSummary(response.prediction, loc, dt),
                conditions: transformPredictionToConditions(response.prediction)
            };
            
            setData(transformedData);
        })
        .catch((e) => {
            console.error('API call failed:', e);
            // Fallback to dummy data
            setData({
                ...initialData,
                location: loc,
                date: dt,
                summary: `Analysis for ${loc} on ${dt}: (API unavailable - using demo data)`,
            });
        })
        .finally(() => setLoading(false));
    }, []);

    // Helper function to generate summary from prediction
    const generateSummary = (prediction: ActivityPrediction, location: string, date: string): string => {
        return `On ${date} in ${location}, expect ${prediction.rain.toLowerCase()} with ${(prediction.rain_confidence * 100).toFixed(0)}% confidence, temperature around ${prediction.temperature.toFixed(1)}°C, and wind speed ${prediction.wind_speed.toFixed(1)} km/h.`;
    };

    // Helper function to transform prediction to conditions
    const transformPredictionToConditions = (prediction: ActivityPrediction): Condition[] => {
        return [
            { 
                name: 'Heavy Rain',
                rainType: prediction.rain as 'No Rain' | 'Light Rain' | 'Heavy Rain',
                confidence: prediction.rain_confidence,
                temperature: prediction.temperature,
                windSpeed: prediction.wind_speed
            },
            { 
                name: 'Extreme Heat',
                rainType: 'No Rain', // Default for heat condition
                confidence: 0, // Not applicable for heat
                temperature: prediction.temperature,
                windSpeed: prediction.wind_speed
            },
            { 
                name: 'High Winds',
                rainType: 'No Rain', // Default for wind condition
                confidence: 0, // Not applicable for wind
                temperature: prediction.temperature,
                windSpeed: prediction.wind_speed
            }
        ];
    };

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
                    <p className="text-lg text-gray-600 dark:text-gray-400">Analyzing weather data... 🛰️</p>
                </div>
            )}

            {data && !loading ? (
                <div className="space-y-10 fade-in">
                    <SummaryPanel data={data} />
                    <RiskGaugesPanel conditions={data.conditions} />
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