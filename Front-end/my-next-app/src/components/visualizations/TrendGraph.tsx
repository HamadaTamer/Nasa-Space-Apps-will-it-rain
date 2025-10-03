import React from 'react';
import { Condition } from '../../types/climate';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, LabelList
} from 'recharts';

interface TrendGraphProps {
    condition: Condition;
}

// --- Dummy Data Structured for Recharts ---
// Data combines historical points, with the final point representing the ML Projection.
const CHART_DATA = [
    { name: '1980', probability: 20, type: 'Historical', color: '#3b82f6' },
    { name: '1990', probability: 24, type: 'Historical', color: '#3b82f6' },
    { name: '2000', probability: 28, type: 'Historical', color: '#3b82f6' },
    { name: '2010', probability: 32, type: 'Historical', color: '#3b82f6' },
    { name: '2020', probability: 35, type: 'Trend', color: '#3b82f6' }, // Trend-Adjusted point
    { name: 'Future', probability: 42, type: 'ML Projection', color: '#8b5cf6' }, // ML Projection point
];

const MAX_PROBABILITY_SCALE = 50; // Set a fixed Y-axis maximum for consistency (0-50%)

// Function to determine the icon and color based on the trend shift
const getTrendIndicator = (historical: number, adjusted: number) => {
    const diff = adjusted - historical;
    if (diff > 5) return { icon: ArrowUpIcon, color: 'text-red-500', text: `Significant increase (+${diff}%)` };
    if (diff > 0) return { icon: ArrowUpIcon, color: 'text-yellow-500', text: `Moderate increase (+${diff}%)` };
    if (diff < 0) return { icon: ArrowDownIcon, color: 'text-green-500', text: `Decrease (${diff}%)` };
    return { icon: null, color: 'text-gray-500', text: 'Stable trend' };
};

export const TrendGraph: React.FC<TrendGraphProps> = ({ condition }) => {

    const currentTrend = getTrendIndicator(condition.historical, condition.trendAdjusted);

    // Data for the summary box
    const trendSummaryData = [
        { label: 'Historical Baseline (Avg)', value: `${condition.historical}%`, description: 'Average probability before adjustments.' },
        { label: 'Trend-Adjusted (Current)', value: `${condition.trendAdjusted}%`, description: 'Probability adjusted using Mann-Kendall test/Sen\'s slope.' },
        { label: 'ML Projection (Future)', value: `${condition.mlProjection}%`, description: 'Model projection capturing nonlinear shifts.' },
    ];

    // Map the dummy data to use the actual ML Projection from props
    const chartDataWithProps = CHART_DATA.map(item =>
        item.name === 'Future' ? { ...item, probability: condition.mlProjection } : item
    );

    // Custom Tooltip rendering
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="p-3 bg-gray-700/90 border border-gray-600 rounded-lg shadow-xl text-white text-sm">
                    <p className="font-bold mb-1">{data.name}</p>
                    <p className="text-blue-300">{data.type}</p>
                    <p>Probability: <span className="font-bold">{data.probability}%</span></p>
                </div>
            );
        }
        return null;
    };

    return (
        // Outer container switched to dark background for visual harmony
        <div className="p-6 bg-gray-800 dark:bg-gray-900 rounded-lg shadow-2xl text-white">
            <h2 className="text-2xl font-bold text-gray-100 mb-2">
                Climate Trend Visualization: {condition.name}
            </h2>
            <div className="flex items-center space-x-3 mb-6">
                {currentTrend.icon && <currentTrend.icon className={`w-6 h-6 ${currentTrend.color}`} />}
                <p className={`text-lg font-medium ${currentTrend.color}`}>
                    Observed Trend: {currentTrend.text}
                </p>
            </div>

            {/* Recharts Visualization Area */}
            <div className="h-80 w-full mb-8 p-4 border border-gray-700 rounded-lg bg-gray-900/50">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataWithProps} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" vertical={false} />

                        {/* X-Axis (Labels: 1980, 1990, Future) */}
                        <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />

                        {/* Y-Axis (Probability) */}
                        <YAxis
                            stroke="#9ca3af"
                            domain={[0, MAX_PROBABILITY_SCALE]}
                            label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `${value}%`}
                        />

                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />

                        {/* Bar/Dot for the value (mimics the slider/gauge design) */}
                        <Bar dataKey="probability" fill="#3b82f6" maxBarSize={15} isAnimationActive={false}>
                            {/* Custom rendering to use the color property from the data */}
                            <LabelList
                                dataKey="probability"
                                position="top"
                                fill="#e5e7eb"
                                formatter={(value) => `${value}%`}
                            />
                        </Bar>

                        {/* Using Scatter for the data points to make them stand out (like the dots in the inspiration image) */}
                        <Scatter name="Points" data={chartDataWithProps}>
                            {chartDataWithProps.map((entry, index) => (
                                <Scatter
                                    key={`dot-${index}`}
                                    data={[entry]}
                                    fill={entry.color}
                                    shape="circle"
                                    isAnimationActive={false}
                                />
                            ))}
                        </Scatter>

                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Key Metrics Summary (Aligned with the data layers) */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
                {trendSummaryData.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-700 rounded-lg shadow-md">
                        <p className="text-sm font-semibold text-gray-400">{item.label}</p>
                        <p className="text-2xl font-bold text-white mt-1">{item.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};