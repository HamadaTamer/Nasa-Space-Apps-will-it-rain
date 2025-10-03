// src/components/ui/LeafletPicker.tsx (Global View and Interactivity Restored)

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

// --- Global Configuration ---
// Default center set to a neutral, central location (equator/prime meridian or default view)
const GLOBAL_CENTER: LatLngExpression = [20.0, 0.0];
const GLOBAL_ZOOM = 3; // Zoom level suitable for viewing a large area

// Stadiamaps API Key (Used for reliable tile loading)
const STADIAMAPS_API_KEY = '14510f48-3039-473e-ad5a-ae845e97d7ac';
const STADIAMAPS_URL =
    `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png?api_key=${STADIAMAPS_API_KEY}`;


// Custom Marker Icon Fix
const customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color:#3b82f6; width:1.5rem; height:1.5rem; border-radius:50%; border:3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5); transform: translateY(-50%);"></div>`,
    iconAnchor: [12, 12],
    iconSize: [24, 24]
});


interface LeafletPickerProps {
    initialCoords: { lat: number; lng: number };
    onSelectLocation: (lat: number, lng: number) => void;
    isMapVisible: boolean;
}

// Internal component for interaction and size invalidation fix
const LocationMarker: React.FC<{
    markerPosition: LatLngExpression,
    onMapClick: (e: L.LeafletMouseEvent) => void,
    isMapVisible: boolean
}> = ({ markerPosition, onMapClick, isMapVisible }) => {

    const map = useMapEvents({
        click: onMapClick,
    });

    // Aggressive size invalidation check when the component becomes visible
    useEffect(() => {
        if (isMapVisible) {
            const frameId = requestAnimationFrame(() => {
                map.invalidateSize();
                map.setView(markerPosition, map.getZoom());
            });

            return () => {
                cancelAnimationFrame(frameId);
            };
        }
    }, [map, isMapVisible, markerPosition]);

    return (
        <Marker position={markerPosition} icon={customIcon} />
    );
};


export const LeafletPicker: React.FC<LeafletPickerProps> = ({ initialCoords, onSelectLocation, isMapVisible }) => {
    // Note: We use the initialCoords from props for the marker position to ensure continuity
    const [markerPosition, setMarkerPosition] = useState<LatLngExpression>([initialCoords.lat, initialCoords.lng]);

    // Center the map on the user's last known location (initialCoords) instead of a fixed global point
    const mapCenter: LatLngExpression = useMemo(() => [initialCoords.lat, initialCoords.lng], [initialCoords.lat, initialCoords.lng]);

    const onMapClick = useCallback((e: L.LeafletMouseEvent) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        setMarkerPosition([lat, lng]);
        onSelectLocation(lat, lng);
    }, [onSelectLocation]);


    return (
        <div className="h-full w-full rounded-lg overflow-hidden map-container">
            <MapContainer
                // Set initial view to the last selected coordinate (Global functionality)
                center={mapCenter}
                zoom={GLOBAL_ZOOM}
                scrollWheelZoom={true}
                // --- REMOVED: maxBounds, minZoom, maxBoundsViscosity ---
                style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
                {/* Stadiamaps Tile Layer */}
                <TileLayer
                    attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> contributors'
                    url={STADIAMAPS_URL}
                    maxZoom={20}
                />

                <LocationMarker
                    markerPosition={markerPosition}
                    onMapClick={onMapClick}
                    isMapVisible={isMapVisible}
                />

                {/* Overlay to hint at interaction */}
                <div className="absolute inset-0 z-10 pointer-events-none flex items-end justify-center pb-2">
                    <span className="bg-black/60 text-white text-sm px-3 py-1 rounded-full">Click anywhere to set location (Global Coverage) 🌍</span>
                </div>
            </MapContainer>
        </div>
    );
};