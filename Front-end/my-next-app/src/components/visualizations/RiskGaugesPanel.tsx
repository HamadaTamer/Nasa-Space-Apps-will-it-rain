// src/components/visualizations/RiskGaugesPanel.tsx

import React from 'react';
import { Condition } from '../../types/climate'; // New Type Import

interface RiskGaugesPanelProps {
    conditions: Condition[];
}

// A helper component for the gauge visualization
const RiskGauge: React.FC<{ name: string; probability: number }> = ({ name, probability }) => {
    // Utility function for styling (could be moved to src/utils/data-helpers.ts)
    const getColor = (p: number) => {
        if (p < 10) return 'text-green-500 stroke-green-500'; // Low Risk
        if (p < 25) return 'text-yellow-500 stroke-yellow-500'; // Moderate Risk
        return 'text-red-500 stroke-red-500'; // High Risk
    };

    const colorClass = getColor(probability);

    // SVG Logic for the circular dial
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (probability / 100) * circumference;

    return (
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="relative w-28 h-28 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Track */}
                    <circle
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50%"
                        cy="50%"
                    />
                    {/* Progress Indicator */}
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
                    <span className={`text-2xl font-bold ${colorClass.split(' ')[0]}`}>
                        {probability}%
                    </span>
                </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{name}</p>
            [cite_start]<p className="text-xs text-gray-500 dark:text-gray-400">Trend Adjusted Risk [cite: 55]</p>
        </div>
    );
};

export const RiskGaugesPanel: React.FC<RiskGaugesPanelProps> = ({ conditions }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Risk Gauges (Circular Dials)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {conditions.map(c => (
                    <RiskGauge key={c.name} name={c.name} probability={c.trendAdjusted} />
                ))}
            </div>
        </div>
    );
};