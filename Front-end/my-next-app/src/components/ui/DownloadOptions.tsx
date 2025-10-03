// src/components/ui/DownloadOptions.tsx

import React from 'react';
import { ArrowDownTrayIcon as DownloadIcon } from '@heroicons/react/24/outline';

interface DownloadOptionsProps {
    location: string;
    date: string;
}

export const DownloadOptions: React.FC<DownloadOptionsProps> = ({ location, date }) => {

    const handleDownload = (format: 'CSV' | 'JSON') => {
        // Logic here to format and trigger the file download
        console.log(`Preparing to download ${format} for ${location} on ${date}`);
        alert(`Downloading data for ${location} on ${date} in ${format} format...`);
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Data Export for Deep Analysis
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    [cite_start]Advanced users may export the subset of data in CSV or JSON. [cite: 59]
                </p>
            </div>
            <div className="flex space-x-3">
                <button
                    onClick={() => handleDownload('CSV')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800"
                >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download CSV
                </button>
                <button
                    onClick={() => handleDownload('JSON')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-800"
                >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download JSON
                </button>
            </div>
        </div>
    );
};