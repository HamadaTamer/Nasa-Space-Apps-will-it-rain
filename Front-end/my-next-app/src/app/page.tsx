// src/app/page.tsx

"use client"; // REQUIRED for interactive components and hooks

import React from 'react';
import { ClimateTrendAnalyzer } from '../components/core/ClimateTrendAnalyzer';

/**
 * The main page component that renders the Climate Trend Analyzer dashboard.
 * It is marked as a client component because the dashboard contains state, 
 * user input, and interactive features.
 */
export default function HomePage() {
  return (
    <ClimateTrendAnalyzer />
  );
}