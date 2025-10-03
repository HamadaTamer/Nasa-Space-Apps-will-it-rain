// src/types/climate.ts

export interface Condition {
    name: 'Heavy Rain' | 'Extreme Heat' | 'High Winds' | 'Discomfort Index';
    historical: number;      // Historical baseline probability (%)
    trendAdjusted: number;   // Trend-adjusted probability (%)
    mlProjection: number;    // ML-informed projection probability (%)
    icon: string;            // Emoji or icon class for the condition
}

export interface ClimateData {
    location: string;
    date: string;
    summary: string;
    conditions: Condition[];
}