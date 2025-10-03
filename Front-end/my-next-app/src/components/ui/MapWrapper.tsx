// src/components/ui/MapWrapper.tsx

import dynamic from 'next/dynamic';
import React from 'react';
import { LatLngExpression } from 'leaflet';

interface MapWrapperProps {
    initialCoords: { lat: number; lng: number };
    onSelectLocation: (lat: number, lng: number) => void;
    isMapVisible: boolean;
}

// Dynamically import the Leaflet map component (Crucial for client-side rendering)
const LeafletPicker = dynamic(
    () => import('./LeafletPicker').then(mod => mod.LeafletPicker),
    {
        ssr: false,
        loading: () => (
            <div className="h-96 w-full flex items-center justify-center bg-gray-900/50 rounded-lg">
                <p className="text-blue-300">🛰️ Initializing Map...</p>
            </div>
        )
    }
);

/**
 * A wrapper to simplify the import in LocationInput, ensuring the map
 * component is always loaded dynamically.
 */
export const MapWrapper: React.FC<MapWrapperProps> = (props) => {
    return <LeafletPicker {...props} />;
};