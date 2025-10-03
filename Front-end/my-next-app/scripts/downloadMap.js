const fs = require('fs-extra');
const fetch = require('node-fetch');
const path = require('path');

// --- Configuration ---
const MAP_WIDTH = 1024;
const MAP_HEIGHT = 768;
const EGYPT_CENTER_LAT = '30.033';
const EGYPT_CENTER_LNG = '31.233';
const ZOOM = 6;
const IMAGE_PATH = path.join(__dirname, '../public/images/egypt_map_reference.png');

// --- Stadiamaps API Configuration ---
const STADIAMAPS_API_KEY = '14510f48-3039-473e-ad5a-ae845e97d7ac';
const TILE_STYLE = 'alidade_smooth';
const FORMAT = '.png'; // Must be specified if using the base URL

// --- FINAL CONFIRMED STATIC MAP URL (Query-based structure) ---
// Base URL + Path Params: https://tiles.stadiamaps.com/static/<style><format>
const BASE_URL = `https://tiles.stadiamaps.com/static/${TILE_STYLE}${FORMAT}`;

// Query Parameters: center, zoom, size, and api_key
const queryParams = new URLSearchParams({
    size: `${MAP_WIDTH}x${MAP_HEIGHT}@2x`,
    center: `${EGYPT_CENTER_LAT},${EGYPT_CENTER_LNG}`,
    zoom: ZOOM.toString(),
    api_key: STADIAMAPS_API_KEY
});

const STATIC_MAP_API_URL = `${BASE_URL}?${queryParams.toString()}`;

// ----------------------------------------------------

async function downloadStaticMap() {
    console.log('Starting static map image download from Stadiamaps...');
    try {
        await fs.ensureDir(path.dirname(IMAGE_PATH));

        console.log(`Fetching URL: ${STATIC_MAP_API_URL}`);

        const response = await fetch(STATIC_MAP_API_URL);

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to fetch map: Status ${response.status} ${response.statusText}. Response Body (Snippet): ${errorBody.substring(0, 100)}...`);
        }

        // Save the image buffer to the public directory
        const buffer = await response.buffer();
        await fs.writeFile(IMAGE_PATH, buffer);

        console.log(`✅ Successfully downloaded high-res map to: ${IMAGE_PATH}`);
    } catch (error) {
        console.error('❌ Error downloading static map image:', error.message);
        console.warn('The URL structure now strictly follows the documentation. If the error persists, there may be an API key restriction or the service is temporarily down.');
    }
}

downloadStaticMap();