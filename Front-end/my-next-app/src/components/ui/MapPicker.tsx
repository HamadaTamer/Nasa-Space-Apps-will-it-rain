// src/components/ui/MapPicker.tsx

import React, { useState, useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MapPinIcon } from "@heroicons/react/24/outline";

// Default map style options for a clean, app-like look
const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    // Minimalist style for a clean look
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
  ],
};

interface MapPickerProps {
  initialCoords: { lat: number; lng: number };
  onSelectLocation: (lat: number, lng: number) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({
  initialCoords,
  onSelectLocation,
}) => {
  const [markerPosition, setMarkerPosition] = useState(initialCoords);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Load the Google Maps API using the environment variable key
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = useMemo(() => initialCoords, [initialCoords]);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const newPos = { lat, lng };

        setMarkerPosition(newPos);
        onSelectLocation(lat, lng);
      }
    },
    [onSelectLocation]
  );

  const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
    setMap(mapInstance);
  }, []);

  if (loadError) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading Google Maps. Check console and API key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse">
        <MapPinIcon className="w-10 h-10 text-blue-500 mb-2" />
        <p className="text-gray-700 dark:text-gray-300">
          Loading Map Service...
        </p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={6} // Default zoom for a starting point (Egypt view)
        options={MAP_OPTIONS}
        onClick={onMapClick}
        onLoad={onLoad}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
    </div>
  );
};

export default MapPicker;
