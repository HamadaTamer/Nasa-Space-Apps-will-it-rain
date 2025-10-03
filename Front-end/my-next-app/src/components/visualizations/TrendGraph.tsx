// src/components/visualizations/TrendGraph.tsx

import React from 'react';
import { Condition } from '../../types/climate'; // New Type Import

interface TrendGraphProps {
    condition: Condition;
}

export const TrendGraph: React.FC<TrendGraphProps> = ({ condition }) => {
    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                [cite_start]Compact Trend Visuals [cite: 11] for {condition.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                [cite_start]Explore how probabilities have shifted over past decades and how ML projections align with historical trends[cite: 57].
            </p>

            {/* Placeholder for Charting Component */}
            <div className="h-64 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                    [cite_start][Placeholder for Interactive Chart using Plotly/Dash/Streamlit tools] [cite: 80]
                </p>
            </div>

            <div className="mt-4 text-sm space-y-1">
                <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-bold text-blue-600 dark:text-blue-400">Trend Change:</span> Observed shift from {condition.historical}% to {condition.trendAdjusted}% (+{condition.trendAdjusted - condition.historical}%)
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-bold">ML Projection:</span> {condition.mlProjection}%
                </p>
            </div>
        </div>
    );
};