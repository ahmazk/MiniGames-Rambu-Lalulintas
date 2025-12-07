/**
 * Building Configuration Data
 * 
 * Defines the layout of the city buildings.
 * Uses a Grid System where buildings are placed at regular intervals.
 * 
 * Categories:
 * 1. Reserved Locations: Specific spots for landmarks (School, Parking).
 * 2. Skyscrapers: Fixed tall buildings at specific coordinates.
 * 3. Generated Buildings: Procedurally filled non-reserved spots.
 */

// Define special reserved locations (Landmarks)
// These coordinates are blocked from procedural generation.
const reservedLocations = [
    { x: 0, z: -40 },  // School Complex
    { x: 40, z: -40 }, // Public Parking Lot
];

// Define skyscraper locations (Fixed Landmarks)
// Tall buildings placed in clusters to form a "Downtown" look.
export const skyscrapers = [
    // Northwest cluster
    { x: -80, z: 80, width: 14, height: 38, depth: 14, color: 0x9e9e9e },
    { x: -40, z: 80, width: 14, height: 45, depth: 14, color: 0x757575 },
    { x: -80, z: 40, width: 14, height: 35, depth: 14, color: 0x616161 },

    // Southeast cluster
    { x: 80, z: -80, width: 14, height: 42, depth: 14, color: 0x5d4037 },
    { x: 40, z: -80, width: 14, height: 40, depth: 14, color: 0x6d4c41 },

    // Scattered High-rises
    { x: 80, z: 80, width: 14, height: 36, depth: 14, color: 0x455a64 },
    { x: -40, z: -80, width: 14, height: 33, depth: 14, color: 0x37474f },
];

/**
 * Helper to check if a specific grid coordinate is already occupied
 * by a reserved landmark or a fixed skyscraper.
 */
function isOccupied(x, z) {
    // Check reserved list
    if (reservedLocations.some(p => p.x === x && p.z === z)) return true;
    // Check skyscrapers list
    if (skyscrapers.some(p => p.x === x && p.z === z)) return true;
    return false;
}

// Generate Standard Buildings (Medium/Small) for ALL empty block centers
// Grid range: -120 to 120 (Covering the entire playable map area)
const generatedBuildings = [];
const gridRange = [-120, -80, -40, 0, 40, 80, 120];

gridRange.forEach(x => {
    gridRange.forEach(z => {
        // Skip if occupied
        if (isOccupied(x, z)) return;

        // Determine building style based on region
        let height;

        // Central area (taller)
        if (Math.abs(x) <= 40 && Math.abs(z) <= 40) {
            height = 20 + Math.random() * 10;
        }
        // Outskirts (shorter)
        else {
            height = 10 + Math.random() * 8;
        }

        // Metropolitan Neutral Palette
        const metroColors = [
            0x808080, // Gray
            0xA9A9A9, // DarkGray
            0xC0C0C0, // Silver
            0xD3D3D3, // LightGray
            0x778899, // LightSlateGray
            0x708090, // SlateGray
            0x5F9EA0, // CadetBlue (Muted)
            0xB0C4DE, // LightSteelBlue
            0xE5E4E2, // Platinum
            0xF5F5F5  // WhiteSmoke
        ];

        // Pick a random color from palette
        const color = metroColors[Math.floor(Math.random() * metroColors.length)];

        generatedBuildings.push({
            x: x,
            z: z,
            width: 12 + Math.random() * 2,
            height: height,
            depth: 12 + Math.random() * 2,
            color: color
        });
    });
});

// Calculate Tree Offsets
export const skyscraperTreeOffsets = [
    { dx: 8, dz: 8 }, { dx: -8, dz: 8 },
    { dx: 8, dz: -8 }, { dx: -8, dz: -8 },
    { dx: 10, dz: 0 }, { dx: -10, dz: 0 }
];

// Export split lists (we put all non-sky buildings in mediumBuildings for simplicity)
export const roadsideBuildings = []; // Deprecated/Empty - we use pure grid now for safety
export const mediumBuildings = generatedBuildings;
