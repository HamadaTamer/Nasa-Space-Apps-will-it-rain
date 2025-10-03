// src/components/ui/DownloadOptions.tsx

import React from 'react';
import { ArrowDownTrayIcon as DownloadIcon } from '@heroicons/react/24/outline';

interface DownloadOptionsProps {
    location: string;
    date: string;
    apiResponse: any; // The raw API response data
}

export const DownloadOptions: React.FC<DownloadOptionsProps> = ({ 
    location, 
    date, 
    apiResponse 
}) => {

    const downloadFile = (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDownloadJSON = () => {
        if (!apiResponse) {
            alert('No data available to download. Please run an analysis first.');
            return;
        }

        const sanitizedLocation = location.replace(/[^a-zA-Z0-9]/g, '_');
        const sanitizedDate = date.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `weather_data_${sanitizedLocation}_${sanitizedDate}.json`;
        
        const jsonContent = JSON.stringify(apiResponse, null, 2);
        downloadFile(jsonContent, filename, 'application/json');
    };

    const handleDownloadCSV = () => {
        if (!apiResponse) {
            alert('No data available to download. Please run an analysis first.');
            return;
        }

        const sanitizedLocation = location.replace(/[^a-zA-Z0-9]/g, '_');
        const sanitizedDate = date.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `weather_data_${sanitizedLocation}_${sanitizedDate}.csv`;

        // Convert the API response to CSV
        const csvContent = convertToCSV(apiResponse);
        downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
    };

    const convertToCSV = (data: any): string => {
        // Flatten the API response into key-value pairs
        const flattenedData: { [key: string]: string } = {};

        // Helper function to flatten nested objects
        const flattenObject = (obj: any, prefix = '') => {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    flattenObject(obj[key], `${prefix}${key}.`);
                } else {
                    flattenedData[`${prefix}${key}`] = String(obj[key]);
                }
            }
        };

        flattenObject(data);

        // Create CSV content
        const headers = Object.keys(flattenedData);
        const values = headers.map(header => {
            // Escape commas and quotes for CSV
            const value = flattenedData[header];
            return `"${value.replace(/"/g, '""')}"`;
        });

        return [headers.join(','), values.join(',')].join('\n');
    };

    const isDisabled = !apiResponse;

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Download Raw Data
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isDisabled 
                        ? "Run an analysis first to download data"
                        : "Download the complete API response"
                    }
                </p>
            </div>
            <div className="flex space-x-3">
                <button
                    onClick={handleDownloadCSV}
                    disabled={isDisabled}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg focus:ring-4 transition-all ${
                        isDisabled 
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' 
                            : 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800'
                    }`}
                >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download CSV
                </button>
                <button
                    onClick={handleDownloadJSON}
                    disabled={isDisabled}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg focus:ring-4 transition-all ${
                        isDisabled 
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' 
                            : 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-800'
                    }`}
                >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download JSON
                </button>
            </div>
        </div>
    );
};