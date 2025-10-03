// src/types/climate.ts

export interface Condition {
    name: 'Heavy Rain' | 'Extreme Heat' | 'High Winds' | 'Discomfort Index';
    rainType?: 'No Rain' | 'Light Rain' | 'Drizzle' | 'Heavy Rain'; 
    confidence: number;
    temperature: number;
    windSpeed: number;      
}

export interface ClimateData {
    location: string;
    date: string;
    summary: string;
    conditions: Condition[];
}