// src/components/visualizations/WeatherDetailsCard.tsx

import React from "react";

interface WeatherDetailsProps {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainConfidence: number;
}

// Function to safely clamp and scale a value (0 to 100)
const getScale = (value: number, max: number) => {
  return Math.min(100, Math.max(0, (value / max) * 100));
};

export const WeatherDetailsCard: React.FC<WeatherDetailsProps> = ({
  temperature,
  humidity,
  windSpeed,
  rainConfidence,
}) => {
  // Define max scales for visualization purposes (e.g., max realistic temperature)
  const MAX_TEMP = 45; // Max degrees for the bar
  const MAX_WIND = 30; // Max km/h for the bar

  const tempScale = getScale(temperature, MAX_TEMP);
  const windScale = getScale(windSpeed, MAX_WIND);
  const humidityScale = getScale(humidity, 100);
  const rainScale = getScale(rainConfidence * 100, 100);

  const DetailItem: React.FC<{
    label: string;
    value: string;
    scale: number;
    color: string;
  }> = ({ label, value, scale, color }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm font-medium mb-1">
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
        <span className={`${color} font-bold`}>{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className={`h-2.5 rounded-full ${color.replace("text-", "bg-")}`}
          style={{ width: `${scale}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b pb-2">
        Weather Details
      </h3>

      <DetailItem
        label="Temperature"
        value={`${temperature.toFixed(1)}°C`}
        scale={tempScale}
        color="text-red-500"
      />
      <DetailItem
        label="Humidity"
        value={`${humidity.toFixed(0)}%`}
        scale={humidityScale}
        color="text-blue-500"
      />
      <DetailItem
        label="Wind Speed"
        value={`${windSpeed.toFixed(1)} km/h`}
        scale={windScale}
        color="text-green-500"
      />
      <DetailItem
        label="Rain Confidence"
        value={`${rainScale.toFixed(0)}%`}
        scale={rainScale}
        color="text-purple-500"
      />
    </div>
  );
};
