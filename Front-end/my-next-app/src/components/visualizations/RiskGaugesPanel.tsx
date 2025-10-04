// src/components/visualizations/RiskGaugesPanel.tsx

import React from "react";
// We don't import Condition from '.../../types/climate' here to avoid confusion
// We define the minimal required interface for the gauge to work.

// Minimal interface required by this component (matching BackendCondition data)
interface GaugeCondition {
  // Core data from API prediction:
  rainType: string;
  confidence: number;
  temperature: number;
  windSpeed: number;
  // Data used to drive the visual gauge display:
  mlProjection: number; // This must be the 0-100% value
}

interface RiskGaugesPanelProps {
  conditions: GaugeCondition[]; // Use the strongly typed interface
}

// Rain gauge component
const RainGauge: React.FC<{ condition: GaugeCondition }> = ({ condition }) => {
  // Use mlProjection (the calculated risk chance) for the visual display
  const rainChance = condition.mlProjection;
  const rainType = condition.rainType || "No Rain";

  const getRainColor = (rain: string) => {
    const rainColors: { [key: string]: string } = {
      "No Rain": "text-green-500 stroke-green-500",
      "Light Rain": "text-blue-400 stroke-blue-400",
      "Moderate Rain": "text-yellow-500 stroke-yellow-500",
      "Heavy Rain": "text-orange-500 stroke-orange-500",
      Storm: "text-red-500 stroke-red-500",
    };
    return rainColors[rain] || "text-gray-500 stroke-gray-500";
  };

  const colorClass = getRainColor(rainType);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  // FIX: Use rainChance (0-100%) directly for offset calculation
  const offset = circumference - (rainChance / 100) * circumference;

  return (
    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="relative w-28 h-28 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
          <circle
            className={colorClass}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className={`text-2xl font-bold ${colorClass.split(" ")[0]}`}>
            {rainChance}%
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">
        {rainType.toLowerCase()}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">Rain Risk (ML)</p>
    </div>
  );
};

// Temperature gauge component
const TemperatureGauge: React.FC<{ condition: GaugeCondition }> = ({
  condition,
}) => {
  // Use mlProjection for visual risk, and raw temperature for label
  const tempRisk = condition.mlProjection;
  const temperature = condition.temperature;

  const getTempColor = (risk: number) => {
    if (risk < 20) return "text-green-400 stroke-green-400";
    if (risk < 50) return "text-yellow-500 stroke-yellow-500";
    return "text-red-500 stroke-red-500";
  };

  const colorClass = getTempColor(tempRisk);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  // FIX: Use tempRisk (0-100%) for offset calculation
  const offset = circumference - (tempRisk / 100) * circumference;

  return (
    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="relative w-28 h-28 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
          <circle
            className={colorClass}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className={`text-xl font-bold ${colorClass.split(" ")[0]}`}>
            {temperature.toFixed(1)}°C
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Extreme Heat Risk
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Risk: {tempRisk}%
      </p>
    </div>
  );
};

// Wind speed gauge component
const WindGauge: React.FC<{ condition: GaugeCondition }> = ({ condition }) => {
  // Use mlProjection for visual risk, and raw wind speed for label
  const windRisk = condition.mlProjection;
  const windSpeed = condition.windSpeed;

  const getWindColor = (risk: number) => {
    if (risk < 20) return "text-green-500 stroke-green-500";
    if (risk < 50) return "text-yellow-500 stroke-yellow-500";
    return "text-red-500 stroke-red-500";
  };

  const colorClass = getWindColor(windRisk);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  // FIX: Use windRisk (0-100%) for offset calculation
  const offset = circumference - (windRisk / 100) * circumference;

  return (
    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="relative w-28 h-28 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
          <circle
            className={colorClass}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className={`text-xl font-bold ${colorClass.split(" ")[0]}`}>
            {windSpeed.toFixed(1)}
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
        High Wind Risk
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Risk: {windRisk}%
      </p>
    </div>
  );
};

export const RiskGaugesPanel: React.FC<RiskGaugesPanelProps> = ({
  conditions,
}) => {
  // Use the first three conditions for our three gauges
  // Since we KNOW the array contains Rain, Temp, Wind (due to transformPredictionToConditions)
  const [rainCondition, tempCondition, windCondition] = conditions;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Risk Gauges (ML Adjusted)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <RainGauge condition={rainCondition} />
        <TemperatureGauge condition={tempCondition} />
        <WindGauge condition={windCondition} />
      </div>
    </div>
  );
};
