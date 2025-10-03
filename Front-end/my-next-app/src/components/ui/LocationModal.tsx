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
        // Backdrop: Changed opacity and added backdrop-blur-sm
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/30 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8" onClick={onClose}>

            {/* Modal Container */}
            <div
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl transform transition-all mt-16"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 z-10"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <div className="p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        📍 Select Location & Date
                    </h3>

                    <LocationInput
                        onSearch={(location, date) => {
                            onSearch(location, date);
                            onClose();
                        }}
                        loading={loading}
                        isModalOpen={isOpen} // Pass modal open state
                    />
                </div>
            </div>
        </div>
    );
};