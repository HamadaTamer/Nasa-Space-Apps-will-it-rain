// api/types.ts
export type ActivityRequest = {
  date: string;   // "YYYY-MM-DD"
  lat: number;
  lon: number;
  activity: string;
};

export type ActivityPrediction = {
  humidity: number;
  temperature: number;
  rain: string;            // e.g. "Rained" | "No rain"
  wind_speed: number;      // m/s
  rain_confidence: number; // 0..1
};

export type ActivityResponse = {
  inputs: ActivityRequest;
  prediction: ActivityPrediction;
};
