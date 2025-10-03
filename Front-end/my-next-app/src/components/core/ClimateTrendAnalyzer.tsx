// src/components/core/ClimateTrendAnalyzer.tsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import { RiskGaugesPanel } from "../visualizations/RiskGaugesPanel";
import { RecommendationCard } from "../visualizations/RecommendationCard"; // Used for Summary display
import { DownloadOptions } from "../ui/DownloadOptions";
import { LocationModal } from "../ui/LocationModal";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { ClimateData, Condition } from "../../types/climate";
import { TrendGraph } from "../visualizations/TrendGraph"; // Re-include TrendGraph

// --- DUMMY DATA DEFINITION (Must be at the top level) ---
// Note: These initial values serve as a fallback/default state.
const dummyConditions: Condition[] = [
  {
    name: "Heavy Rain",
    icon: "🌧️",
    historical: 22,
    trendAdjusted: 28,
    mlProjection: 30,
    // Note: Other properties like rainType, confidence, temperature, windSpeed are added
    // dynamically by transformPredictionToConditions, but are omitted here for the default state.
  },
  {
    name: "Extreme Heat",
    icon: "🔥",
    historical: 10,
    trendAdjusted: 15,
    mlProjection: 18,
  },
  {
    name: "High Winds",
    icon: "🌬️",
    historical: 5,
    trendAdjusted: 4,
    mlProjection: 3,
  },
];

const initialData: ClimateData = {
  location: "Cairo, Egypt (30.0444, 31.2357)",
  date: "July 15, 2026",
  summary:
    "On July 15 in Cairo, the climate-adjusted chance of heavy rain is 28%, and extreme heat has a 15% adjusted probability.",
  conditions: dummyConditions,
};
// -----------------------------------------------------------

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

// Interface for the activity endpoint response (Backend structure)
interface ActivityPrediction {
  humidity: number;
  temperature: number;
  rain: "No Rain" | "Light Rain" | "Heavy Rain"; // Enforce specific rain values
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
  analysis_summary?: string;
}

// Interface for Condition with all required UI props
interface BackendCondition extends Condition {
  historical: number;
  trendAdjusted: number;
  mlProjection: number;
  icon: string;
  // Props needed for RecommendationCard and enhanced gauges
  rainType: string;
  confidence: number;
  temperature: number;
  windSpeed: number;
}

interface AddressBarProps {
  data: ClimateData | null;
  activity: string;
  setActivity: (value: string) => void;
  setIsModalOpen: (value: boolean) => void;
}

const AddressBar: React.FC<AddressBarProps> = ({
  data,
  activity,
  setActivity,
  setIsModalOpen,
}) => {
  const [showExamples, setShowExamples] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const activityExamples = [
    "beach day",
    "hiking",
    "picnic",
    "wedding",
    "outdoor concert",
    "farming",
    "construction",
    "photography",
    "camping",
    "fishing",
    "golf",
    "running",
    "cycling",
    "gardening",
    "street market",
  ];

  const handleExampleClick = (example: string) => {
    setActivity(example);
    setShowExamples(false);
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const handleClearActivity = () => {
    setActivity("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowExamples(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const filteredExamples = activity
    ? activityExamples.filter((ex) =>
        ex.toLowerCase().includes(activity.toLowerCase())
      )
    : activityExamples;

  return (
    <div
      ref={wrapperRef}
      className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col space-y-4">
        {/* Location Button Row */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-between w-full text-left transition-colors"
        >
          <div className="flex items-center flex-grow min-w-0">
            <MagnifyingGlassIcon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
            <span className="truncate text-lg font-medium text-gray-800 dark:text-gray-200">
              Location: {data?.location || "Select location to run analysis..."}
            </span>
          </div>
          <MapPinIcon className="w-5 h-5 text-blue-600" />
        </button>

        {/* Activity Input Row */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <label
              htmlFor="activity-input"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
            >
              Activity:
            </label>
            <div className="flex-grow relative">
              <input
                ref={inputRef}
                id="activity-input"
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                onFocus={() => setShowExamples(true)}
                placeholder="What are you planning? (e.g., hiking, picnic, wedding...)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {activity && (
                <button
                  type="button"
                  onClick={handleClearActivity}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Activity Examples */}
          {showExamples && (
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Examples:
              </span>
              {filteredExamples.map((example) => (
                <button
                  key={example}
                  type="button"
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleExampleClick(example)}
                >
                  {example}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT STARTS HERE ---
export const ClimateTrendAnalyzer: React.FC = () => {
  const [data, setData] = useState<ClimateData | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rawApiResponse, setRawApiResponse] = useState<ActivityResponse | null>(
    null
  );
  const [activity, setActivity] = useState("outdoor activities"); // Default activity

  const runAnalysis = useCallback(
    (loc: string, dt: string, lat?: number, lon?: number) => {
      setLoading(true);

      let latitude = lat;
      let longitude = lon;

      if (!latitude || !longitude) {
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
      const isoDate = dateObj.toISOString().split("T")[0];

      // Call the activity endpoint
      fetch(`${API_BASE}/api/v1/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: isoDate,
          lat: latitude,
          lon: longitude,
          activity: activity,
        }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(`API ${res.status}`);
          const response: ActivityResponse = await res.json();

          setRawApiResponse(response);

          // Transform the activity endpoint response to ClimateData format
          const transformedData: ClimateData = {
            location: loc,
            date: dt,
            summary:
              response.analysis_summary ||
              generateSummary(response.prediction, loc, dt),
            conditions: transformPredictionToConditions(response.prediction),
          };

          setData(transformedData);
        })
        .catch((e) => {
          console.error("API call failed:", e);
          setRawApiResponse(null);

          // Fallback to dummy data
          setData({
            ...initialData,
            location: loc,
            date: dt,
            summary: `Analysis for ${loc} on ${dt}: (API unavailable - using demo data)`,
          });
        })
        .finally(() => setLoading(false));
    },
    [activity]
  );

  // Helper function to generate summary from prediction
  const generateSummary = (
    prediction: ActivityPrediction,
    location: string,
    date: string
  ): string => {
    return `On ${date} in ${location}, expect ${prediction.rain.toLowerCase()} with ${(
      prediction.rain_confidence * 100
    ).toFixed(
      0
    )}% confidence, temperature around ${prediction.temperature.toFixed(
      1
    )}°C, and wind speed ${prediction.wind_speed.toFixed(1)} km/h.`;
  };

  // Helper function to transform prediction to conditions
  const transformPredictionToConditions = (
    prediction: ActivityPrediction
  ): BackendCondition[] => {
    const rainChance = Math.round(prediction.rain_confidence * 100);

    return [
      {
        name: "Heavy Rain",
        rainType: prediction.rain, // Use actual prediction
        confidence: prediction.rain_confidence,
        temperature: prediction.temperature,
        windSpeed: prediction.wind_speed,
        icon: "🌧️",
        // Use rain chance for ML Projection, and plausible baselines
        historical: 20,
        trendAdjusted: 30,
        mlProjection: rainChance,
      },
      {
        name: "Extreme Heat",
        rainType: "No Rain", // Default for heat condition
        confidence: 0,
        temperature: prediction.temperature,
        windSpeed: prediction.wind_speed,
        icon: "🔥",
        // Logic: If predicted temperature is high, raise heat risk
        historical: 10,
        trendAdjusted: 15,
        mlProjection: prediction.temperature > 35 ? 70 : 15,
      },
      {
        name: "High Winds",
        rainType: "No Rain", // Default for wind condition
        confidence: 0,
        temperature: prediction.temperature,
        windSpeed: prediction.wind_speed,
        icon: "🌬️",
        // Logic: If predicted wind speed is high, raise wind risk
        historical: 5,
        trendAdjusted: 4,
        mlProjection: prediction.wind_speed > 20 ? 85 : 5,
      },
    ];
  };

  // --- Main Render ---
  return (
    <div className="container mx-auto p-0">
      <AddressBar
        data={data}
        activity={activity}
        setActivity={setActivity}
        setIsModalOpen={setIsModalOpen}
      />

      {/* Results Dashboard Section */}
      {loading && (
        <div className="text-center p-10">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Analyzing weather data... 🛰️
          </p>
        </div>
      )}

      {data && !loading && rawApiResponse ? (
        <div className="space-y-10 fade-in">
          {/* Recommendation and Summary Card (Primary Display) */}
          <RecommendationCard
            activity={activity}
            summary={data.summary}
            rainConfidence={rawApiResponse.prediction.rain_confidence}
            temperature={rawApiResponse.prediction.temperature}
            windSpeed={rawApiResponse.prediction.wind_speed}
          />

          <DownloadOptions
            location={data?.location || ""}
            date={data?.date || ""}
            apiResponse={rawApiResponse}
          />
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
