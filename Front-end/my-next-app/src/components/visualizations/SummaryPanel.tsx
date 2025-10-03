// src/components/visualizations/SummaryPanel.tsx

import React from 'react';
import { ClimateData } from '../../types/climate'; // New Type Import

interface SummaryPanelProps {
    data: ClimateData;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ data }) => {
    return (
        <div className="p-4 bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Concise Narrative Summary
            </h2>
            <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                {data.summary}
            </p>
        </div>
    );
};