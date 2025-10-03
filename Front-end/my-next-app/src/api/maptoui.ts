// api/mapToUi.ts
import type { ActivityResponse } from "./types";

export type Condition = {
  name: string;
  historical?: number;   // keep if you later add hist %s
  trendAdjusted?: number;
  mlProjection?: number;
  icon: string;
};

export type ClimateData = {
  location: string;
  date: string;
  summary: string;
  conditions: Condition[];
};

export function mapActivityToClimateData(resp: ActivityResponse, locLabel: string): ClimateData {
  const p = resp.prediction;

  // Example: we use rain_confidence as a % for “Heavy Rain” projection
  const rainPct = Math.round((p.rain_confidence ?? 0) * 100);

  const conditions: Condition[] = [
    { name: "Heavy Rain",  historical: undefined, trendAdjusted: undefined, mlProjection: rainPct, icon: "🌧️" },
    { name: "Temperature", historical: undefined, trendAdjusted: undefined, mlProjection: Math.round(p.temperature), icon: "🌡️" },
    { name: "Humidity",    historical: undefined, trendAdjusted: undefined, mlProjection: Math.round(p.humidity), icon: "💧" },
    { name: "High Winds",  historical: undefined, trendAdjusted: undefined, mlProjection: Number(p.wind_speed.toFixed(1)), icon: "🌬️" },
  ];

  const dateNice = new Date(resp.inputs.date).toLocaleDateString(undefined, { year:"numeric", month:"long", day:"numeric" });
  const summary = `On ${dateNice} in ${locLabel}, model projects: ${rainPct}% rain chance (“${p.rain}”), ~${p.temperature.toFixed(1)}°C, ${p.humidity.toFixed(0)}% humidity, and ${p.wind_speed.toFixed(1)} m/s winds.`;

  return {
    location: locLabel,
    date: dateNice,
    summary,
    conditions,
  };
}
