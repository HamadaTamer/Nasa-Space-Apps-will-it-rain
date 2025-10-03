// src/components/visualizations/RiskGaugesPanel.tsx

import React from 'react';
import { Condition } from '../../types/climate';

interface RiskGaugesPanelProps {
    conditions: Condition[];
}

// Rain gauge component
const RainGauge: React.FC<{ condition: Condition }> = ({ condition }) => {
    const rainType = condition.rainType || 'No Rain';
    const confidence = condition.confidence || 0;

    const getRainColor = (rain: string) => {
        const rainColors: { [key: string]: string } = {
            'No Rain': 'text-green-500 stroke-green-500',
            'Light Rain': 'text-blue-400 stroke-blue-400',
            'Moderate Rain': 'text-yellow-500 stroke-yellow-500',
            'Heavy Rain': 'text-orange-500 stroke-orange-500',
            'Storm': 'text-red-500 stroke-red-500'
        };
        return rainColors[rain] || 'text-gray-500 stroke-gray-500';
    };

    const colorClass = getRainColor(rainType);
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (confidence * 100 / 100) * circumference;

    return (
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="relative w-28 h-28 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50%"
                        cy="50%"
                    />
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
                        {(confidence * 100).toFixed(0)}%
                    </span>
                </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">
                {rainType.toLowerCase()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Rain Confidence</p>
        </div>
    );
};

// Temperature gauge component
const TemperatureGauge: React.FC<{ condition: Condition }> = ({ condition }) => {
    const temperature = condition.temperature;

    const getTempColor = (temp: number) => {
        if (temp < 0) return 'text-blue-400 stroke-blue-400';
        if (temp < 10) return 'text-blue-300 stroke-blue-300';
        if (temp < 20) return 'text-green-400 stroke-green-400';
        if (temp < 30) return 'text-yellow-500 stroke-yellow-500';
        if (temp < 35) return 'text-orange-500 stroke-orange-500';
        return 'text-red-500 stroke-red-500';
    };

    const normalizedTemp = Math.min(Math.max(temperature, 0), 50);
    const tempPercentage = (normalizedTemp / 50) * 100;

    const colorClass = getTempColor(temperature);
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (tempPercentage / 100) * circumference;

    return (
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="relative w-28 h-28 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50%"
                        cy="50%"
                    />
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
                    <span className={`text-xl font-bold ${colorClass.split(' ')[0]}`}>
                        {temperature.toFixed(1)}°C
                    </span>
                </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Temperature</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Current</p>
        </div>
    );
};

// Wind speed gauge component
const WindGauge: React.FC<{ condition: Condition }> = ({ condition }) => {
    const windSpeed = condition.windSpeed;

    const getWindColor = (speed: number) => {
        if (speed < 5) return 'text-green-500 stroke-green-500';
        if (speed < 15) return 'text-yellow-500 stroke-yellow-500';
        if (speed < 25) return 'text-orange-500 stroke-orange-500';
        return 'text-red-500 stroke-red-500';
    };

    const normalizedSpeed = Math.min(Math.max(windSpeed, 0), 50);
    const speedPercentage = (normalizedSpeed / 50) * 100;

    const colorClass = getWindColor(windSpeed);
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (speedPercentage / 100) * circumference;

    return (
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="relative w-28 h-28 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50%"
                        cy="50%"
                    />
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
                    <span className={`text-xl font-bold ${colorClass.split(' ')[0]}`}>
                        {windSpeed.toFixed(1)}
                    </span>
                </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Wind Speed</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">km/h</p>
        </div>
    );
};

export const RiskGaugesPanel: React.FC<RiskGaugesPanelProps> = ({ conditions }) => {
    // Use the first three conditions for our three gauges
    const [rainCondition, tempCondition, windCondition] = conditions;

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Weather Conditions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <RainGauge condition={rainCondition} />
                <TemperatureGauge condition={tempCondition} />
                <WindGauge condition={windCondition} />
            </div>
        </div>
    );
};