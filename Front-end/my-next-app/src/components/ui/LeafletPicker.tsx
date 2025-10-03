// src/components/ui/LeafletPicker.tsx

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

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
    isMapVisible: boolean; // Crucial prop for the render fix
}

// Internal component to handle map click events and force size invalidation
const LocationMarker: React.FC<{
    markerPosition: L.LatLngExpression,
    onMapClick: (e: L.LeafletMouseEvent) => void,
    isMapVisible: boolean
}> = ({ markerPosition, onMapClick, isMapVisible }) => { // <-- onMapClick is destructured here

    const map = useMapEvents({
        click: onMapClick, // <-- Correct usage: pass the function reference directly
    });

    // FIX: Invalidate map size when the component loads AND when visibility changes
    useEffect(() => {
        if (isMapVisible) {
            // Use a timeout to ensure the DOM has finished resizing the modal container
            const timer = setTimeout(() => {
                map.invalidateSize();
                map.setView(markerPosition, map.getZoom()); // Re-center after size change
            }, 50); // Small delay is often enough
            return () => clearTimeout(timer);
        }
    }, [map, isMapVisible, markerPosition]);

    return (
        <Marker position={markerPosition} icon={customIcon} />
    );
};


export const LeafletPicker: React.FC<LeafletPickerProps> = ({ initialCoords, onSelectLocation, isMapVisible }) => {
    const [markerPosition, setMarkerPosition] = useState<L.LatLngExpression>(initialCoords);

    const onMapClick = useCallback((e: L.LeafletMouseEvent) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        setMarkerPosition([lat, lng]);
        onSelectLocation(lat, lng);
    }, [onSelectLocation]);

    const center: L.LatLngTuple = useMemo(() => [initialCoords.lat, initialCoords.lng], [initialCoords]);

    return (
        <div className="h-96 w-full rounded-lg overflow-hidden border-2 border-blue-400">
            <MapContainer
                center={center}
                zoom={10}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                className="map-container"
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                    markerPosition={markerPosition}
                    onMapClick={onMapClick}
                    isMapVisible={isMapVisible}
                />
            </MapContainer>
        </div>
    );
};