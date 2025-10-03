// src/components/ui/LocationModal.tsx

import React from 'react';
import { LocationInput } from './LocationInput';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch: (location: string, date: string) => void;
    loading: boolean;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onSearch, loading }) => {
    if (!isOpen) return null;

    return (
        // Backdrop
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/30 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8" onClick={onClose}>

            {/* Modal Container */}
            <div
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xl transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 z-50"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <div className="p-4 md:p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b pb-2">
                        Click Map to Set Analysis Location
                    </h3>

                    {/* Location Input handles both the date and the map */}
                    <LocationInput
                        onSearch={onSearch}
                        loading={loading}
                        onClose={onClose} // Pass the close function
                    />
                </div>
            </div>
        </div>
    );
};