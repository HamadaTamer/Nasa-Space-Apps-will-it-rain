// src/components/ui/MapLoader.tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { ClockIcon } from '@heroicons/react/24/outline';

// Import the MapWrapper component dynamically
const MapWrapper = dynamic(
    () => import('./MapWrapper').then(mod => mod.MapWrapper),
    {
        ssr: false,
        loading: () => <MapLoadingAnimation />
    }
);

// --- Map Loading Animation Component ---
const MapLoadingAnimation: React.FC = () => (
    // Use h-full to fill the parent container's height
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-900/80 rounded-lg animate-pulse">
        <ClockIcon className="w-10 h-10 text-blue-400 mb-2" />
        <p className="text-white font-medium">Pre-caching Map Tiles...</p>
        <p className="text-xs text-gray-400 mt-1">Ensuring smooth zoom performance.</p>
    </div>
);
// ------------------------------------

interface MapLoaderProps {
    initialCoords: { lat: number; lng: number };
    onSelectLocation: (lat: number, lng: number) => void;
    isMapVisible: boolean;
}

export const MapLoader: React.FC<MapLoaderProps> = (props) => {
    return (
        // Use h-full to ensure the component fills the height allocated by the parent
        <div className="h-full w-full relative">
            <div className="h-full w-full">
                {/* MapWrapper handles its own internal rendering */}
                <MapWrapper {...props} />
            </div>
        </div>
    );
};