// src/components/ui/LocationModal.tsx

import React, { useState, useEffect } from 'react'; // Import useEffect
import { LocationInput } from './LocationInput';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch: (location: string, date: string) => void;
    loading: boolean;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onSearch, loading }) => {
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // CRITICAL FIX: Use a small delay (300ms) to ensure the modal's CSS transition 
            // is complete before the map component even mounts. This prevents the map 
            // from calculating its size while the container is still animating/sizing.
            const timer = setTimeout(() => {
                setMapLoaded(true);
            }, 300);

            return () => {
                clearTimeout(timer);
                setMapLoaded(false); // Unmount map when modal closes
            };
        } else {
            setMapLoaded(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        // Backdrop
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/30 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8" onClick={onClose}>

            {/* Modal Container */}
            <div
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xl transform transition-all mt-16"
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
                        Click Map to Set Location (Global Coverage)
                    </h3>

                    {/* Conditional Rendering: Only render LocationInput (and thus the map) 
              when the modal is fully opened and stabilized. */}
                    {mapLoaded ? (
                        <LocationInput
                            onSearch={onSearch}
                            loading={loading}
                            isModalOpen={isOpen}
                        />
                    ) : (
                        <div className="h-[400px] flex items-center justify-center">
                            <p className="text-gray-500 dark:text-gray-400">Preparing Map Interface...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};