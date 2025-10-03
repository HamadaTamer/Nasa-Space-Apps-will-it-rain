// src/components/visualizations/ConditionCardsPanel.tsx

import React from 'react';
import { Condition } from '../../types/climate'; // New Type Import

interface ConditionCardsPanelProps {
    conditions: Condition[];
}

const ConditionCard: React.FC<{ condition: Condition }> = ({ condition }) => {
    return (
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-t-4 border-blue-500 dark:border-blue-400">
            <div className="flex items-center space-x-3 mb-3">
                <span className="text-4xl">{condition.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{condition.name}</h3>
            </div>

            <div className="space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    [cite_start]<span className="font-semibold">Historical Baseline:</span> {condition.historical}% [cite: 9]
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    [cite_start]<span className="font-semibold text-blue-600 dark:text-blue-400">Trend-Adjusted:</span> {condition.trendAdjusted}% [cite: 9]
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    [cite_start]<span className="font-semibold">ML Projection:</span> {condition.mlProjection}% (Optional) [cite: 9]
                </p>
            </div>
        </div>
    );
};

export const ConditionCardsPanel: React.FC<ConditionCardsPanelProps> = ({ conditions }) => {
    return (
        <div>
            [cite_start]<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Condition Cards (Layered Insight) [cite: 56]</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {conditions.map(c => (
                    <ConditionCard key={c.name} condition={c} />
                ))}
            </div>
        </div>
    );
};