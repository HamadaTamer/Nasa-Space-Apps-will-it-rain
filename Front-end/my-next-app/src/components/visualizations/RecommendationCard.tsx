// src/components/visualizations/RecommendationCard.tsx

import React from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

interface RecommendationCardProps {
  activity: string;
  summary: string;
  rainConfidence: number;
  temperature: number;
  windSpeed: number;
}

// Function to determine overall suitability based on rain confidence
const getSuitability = (confidence: number) => {
  const risk = confidence * 100;
  if (risk > 60) {
    return {
      status: "High Risk",
      icon: XCircleIcon,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/50",
      advice:
        "High chance of adverse conditions. Consider an indoor alternative.",
    };
  } else if (risk > 30) {
    return {
      status: "Moderate Risk",
      icon: ClockIcon,
      color: "text-yellow-500",
      bg: "bg-yellow-50 dark:bg-yellow-900/50",
      advice:
        "Proceed with caution. Be prepared for changes (e.g., umbrella, early start).",
    };
  } else {
    return {
      status: "Low Risk",
      icon: CheckCircleIcon,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/50",
      advice: "Conditions look favorable. Enjoy your activity!",
    };
  }
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  activity,
  summary,
  rainConfidence,
  temperature,
  windSpeed,
}) => {
  const suitability = getSuitability(rainConfidence);
  const rainPercent = (rainConfidence * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Suitability Banner (Top Priority) */}
      <div
        className={`p-5 rounded-xl shadow-lg border-l-8 ${
          suitability.bg
        } border-${suitability.color.substring(5)}`}
      >
        <div className="flex items-center space-x-4">
          <suitability.icon className={`w-10 h-10 ${suitability.color}`} />
          <div>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Suitability for "{activity}":{" "}
              <span className={suitability.color}>{suitability.status}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {suitability.advice}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Panel (Narrative from Backend) */}
      <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Climate Summary
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
          {summary}
        </p>
      </div>

      {/* Core Metrics (For Context) */}
      <div className="grid grid-cols-3 gap-4">
        {/* Metric 1: Temperature */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/40 rounded-lg text-center">
          <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-300">
            {temperature.toFixed(1)}°C
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Temperature
          </p>
        </div>
        {/* Metric 2: Rain Confidence */}
        <div className="p-4 bg-red-50 dark:bg-red-900/40 rounded-lg text-center">
          <p className="text-3xl font-extrabold text-red-600 dark:text-red-300">
            {rainPercent}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Rain Confidence
          </p>
        </div>
        {/* Metric 3: Wind Speed */}
        <div className="p-4 bg-green-50 dark:bg-green-900/40 rounded-lg text-center">
          <p className="text-3xl font-extrabold text-green-600 dark:text-green-300">
            {windSpeed.toFixed(1)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Wind Speed (km/h)
          </p>
        </div>
      </div>
    </div>
  );
};
