// src/ui/LocationPickerPanel.tsx

import React, { useState } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";

// Interface for the component props
interface LocationPickerPanelProps {
  onSearch: (loc: string, dt: string, lat?: number, lon?: number) => void;
  loading: boolean;
  currentLocation: string;
}

// Default values for the initial analysis
const initialLat = 30.0444; // Cairo
const initialLon = 31.2357;
const initialDate = new Date().toISOString().split("T")[0];

export const LocationPickerPanel: React.FC<LocationPickerPanelProps> = ({
  onSearch,
  loading,
  currentLocation,
}) => {
  // State for inputs
  const [locationInput, setLocationInput] = useState(
    currentLocation.split("(")[0].trim()
  );
  const [dateInput, setDateInput] = useState(initialDate);
  const [latInput, setLatInput] = useState(initialLat);
  const [lonInput, setLonInput] = useState(initialLon);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // In a real app, 'locationInput' would be geocoded to get accurate lat/lon
    const locationString = `${locationInput} (${latInput.toFixed(
      4
    )}, ${lonInput.toFixed(4)})`;
    onSearch(locationString, dateInput, latInput, lonInput);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
           {" "}
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <MapPinIcon className="w-6 h-6 mr-2 text-blue-500" />        1.
        Select Future Location & Date      {" "}
      </h2>
           {" "}
      <form onSubmit={handleSubmit} className="space-y-4">
               {" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Map/Visualization Area */}         {" "}
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300">
                       {" "}
            {/* This is where your Leaflet or Mapbox component would be placed. */}
                        **Interactive Map Goes Here** (Currently focused on:{" "}
            {latInput.toFixed(4)}, {lonInput.toFixed(4)})          {" "}
          </div>
                   {" "}
          <div className="flex flex-col space-y-4">
                       {" "}
            {/* Location Input (For user-friendly search/display) */}           {" "}
            <div>
                           {" "}
              <label
                htmlFor="location-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                                Location Name              {" "}
              </label>
                           {" "}
              <input
                id="location-input"
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., London, UK"
              />
                         {" "}
            </div>
                        {/* Date Input */}           {" "}
            <div>
                           {" "}
              <label
                htmlFor="date-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                                Date of Activity              {" "}
              </label>
                           {" "}
              <input
                id="date-input"
                type="date"
                defaultValue={initialDate}
                onChange={(e) => setDateInput(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
                         {" "}
            </div>
                       {" "}
            <button
              type="submit"
              disabled={loading}
              className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
                            {loading ? "Analyzing..." : "Run Climate Analysis"} 
                       {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </form>
         {" "}
    </div>
  );
};
