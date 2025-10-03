// src/types/climate.ts

export interface Condition {
  name: "Rain Likelihood" | "Extreme Heat" | "High Winds" | "Discomfort Index";
  rainType?: "No Rain" | "Light Rain" | "Drizzle" | "Heavy Rain";
  confidence: number;
  temperature: number;
  windSpeed: number;
  value: number; // Represents the primary value for the gauge (e.g., percentage, temp, speed)
}

export interface ClimateData {
  location: string;
  date: string;
  summary: string;
  conditions: Condition[];
}
