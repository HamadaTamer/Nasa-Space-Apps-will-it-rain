// src/app/dashboard/page.tsx

"use client";

import React from 'react';
import { ClimateTrendAnalyzer } from '../../components/core/ClimateTrendAnalyzer';

/**
 * This page renders the main interactive Climate Trend Analyzer dashboard.
 * It is marked as a client component to enable interactivity.
 */
export default function DashboardPage() {
    return (
        <div className="container mx-auto px-6 py-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Climate Trend Analyzer Dashboard
            </h2>
            {/* The core component orchestrates the input and visualization panels */}
            <ClimateTrendAnalyzer />
        </div>
    );
}