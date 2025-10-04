// src/components/visualizations/RecommendationCard.tsx

import React from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CloudIcon,
  SunIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

interface RecommendationCardProps {
  activity: string;
  summary: string;
  rainConfidence: number;
  temperature: number;
  windSpeed: number;
  humidity: number; // Added humidity prop for accurate display
}

// Function to determine overall suitability based on rain confidence
const getSuitability = (confidence: number) => {
  const risk = confidence * 100;

  // Suitability based on the likelihood of rain/adverse weather (inverse of rain confidence)
  if (risk > 60) {
    return {
      status: "High Risk",
      icon: XCircleIcon,
      color: "text-red-500",
      advice:
        "High chance of adverse conditions. Consider an indoor alternative.",
    };
  } else if (risk > 30) {
    return {
      status: "Moderate Risk",
      icon: ClockIcon,
      color: "text-yellow-500",
      advice:
        "Proceed with caution. Be prepared for changes (e.g., umbrella, early start).",
    };
  } else {
    return {
      status: "Low Risk",
      icon: CheckCircleIcon,
      color: "text-green-500",
      advice: "Conditions look favorable. Enjoy your activity!",
    };
  }
};

const MetricBlock: React.FC<{
  icon: React.ElementType;
  value: string;
  label: string;
}> = ({ icon: Icon, value, label }) => (
  <div className="flex flex-col items-center justify-center p-4">
    <p>
      <Icon className="w-6 h-6 text-white mb-2 opacity-80" />
    </p>
    <p className="text-3xl font-extrabold text-white">{value}</p>
    <p className="text-sm text-white opacity-70">{label}</p>
  </div>
);

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  activity,
  summary,
  rainConfidence,
  temperature,
  windSpeed,
  humidity,
}) => {
  const suitability = getSuitability(rainConfidence);
  const rainPercent = (rainConfidence * 100).toFixed(0);

  // Determine the main weather icon for the top corner
  const weatherIcon = rainConfidence > 0.5 ? CloudIcon : SunIcon;

  // --- NEW GRADIENT CLASSES ---
  const ANALYSIS_GRADIENT_CLASSES =
    "bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400";

  return (
    <div className="space-y-6">
      {/* 1. TOP PROMINENT BANNER (Uses the requested blue gradient) */}
      <div
        className={`p-6 md:p-8 rounded-xl shadow-2xl overflow-hidden relative ${ANALYSIS_GRADIENT_CLASSES}`}
      >
        {/* Main Header Row */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-white">
            <h1 className="text-3xl font-bold">Analysis for "{activity}"</h1>
            <p className="text-sm opacity-90 mt-1">
              Analysis Date: {new Date().toLocaleDateString()}
            </p>
          </div>
          {/* Weather Icon (Top Right) */}
          <div className="flex flex-col items-center text-white">
            <weatherIcon className="w-10 h-10 opacity-90" />
            <p className="text-sm mt-1">
              {rainConfidence > 0.5 ? "Rain Expected" : "Clear Sky"}
            </p>
          </div>
        </div>

        {/* Metrics Banner */}
        <div
          className
          className="grid grid-cols-4 gap-4 bg-black/20 rounded-lg p-2"
        >
          <MetricBlock
            icon={SunIcon}
            value={`${temperature.toFixed(1)}°C`}
            label="Temperature"
          />
          <MetricBlock
            icon={ClockIcon}
            value={`${humidity.toFixed(0)}%`}
            label="Humidity"
          />
          <MetricBlock
            icon={ArrowPathIcon}
            value={`${windSpeed.toFixed(1)} km/h`}
            label="Wind Speed"
          />
          <MetricBlock
            icon={CloudIcon}
            value={`${rainPercent}%`}
            label="Confidence"
          />
        </div>
      </div>

      {/* 2. SUITABILITY ADVICE PANEL */}
      <div
        className={`p-5 rounded-xl shadow-lg border-l-8 border-t-2 border-gray-100 ${suitability.color.replace(
          "text-",
          "border-"
        )} bg-white dark:bg-gray-800`}
      >
        <div className="flex items-center space-x-4">
          <suitability.icon className={`w-8 h-8 ${suitability.color}`} />
          <div>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Overall Suitability:{" "}
              <span className={suitability.color}>{suitability.status}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {suitability.advice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
