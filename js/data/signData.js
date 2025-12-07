/**
 * Sign Data Module
 * 
 * Central repository for all Traffic Sign configurations.
 * Contains:
 * 1. World Placement Data: Exact XYZ coordinates, rotation, and type for each physical sign.
 * 2. Texture Mappings: Links internal IDs (e.g., 'stop') to file paths.
 * 3. UI/Popup Data: Educational content associated with each sign.
 */

// Sign placement configurations
// Format: { id, x, y, z, rotationY, scale }
export const signConfigs = [
    // 1. PARKING - Parking Lot Area (East side)
    // Faces West (Rotation -PI) so drivers entering from the West can see it.
    { id: "parking", x: 40, y: 0, z: -29, rotationY: -Math.PI, scale: 1.0 },

    // 2. SCHOOL ZONE - Near School (West side)
    // Faces East (Rotation PI) for drivers coming from the East.
    { id: "schoolzone", x: 27, y: 0, z: -41, rotationY: Math.PI, scale: 1.0 },

    // 3. NO PARKING - Downtown Vertical Road
    // Faces North (Rotation 0) 
    { id: "noparking", x: 53, y: 0, z: 73, rotationY: 0, scale: 1.0 },

    // 4. SPEED LIMIT 40 - City Entrance
    // Faces West (Rotation PI) for incoming traffic.
    { id: "speedlimit", x: -13.5, y: 0, z: 40, rotationY: Math.PI, scale: 1.0 },

    // 5. STOP - Main Intersection
    // Faces South (Rotation 0) forcing Northbound traffic to stop.
    { id: "stop", x: 13.5, y: 0, z: -7, rotationY: 0, scale: 1.0 },

    // 6. INTERSECTION T-Junction Warning
    // Faces North (Rotation -PI/2) for Westbound traffic.
    { id: "intersection", x: -33, y: 0, z: -66.5, rotationY: -Math.PI / 2, scale: 1.0 },

    // 7. NO LEFT TURN
    // Faces East (Rotation -PI/2) preventing Northbound traffic from turning left.
    { id: "noleft", x: -29, y: 0, z: -27, rotationY: -Math.PI / 2, scale: 1.0 },

    // 8. NO RIGHT TURN
    // Faces West (Rotation -PI) preventing Southbound traffic from turning right.
    { id: "noright", x: 66.5, y: 0, z: -70, rotationY: -Math.PI, scale: 1.0 },

    // 9. NO OVERTAKE - Narrow Road
    // Faces South (Rotation PI) for Northbound traffic.
    { id: "noovertake", x: 106.5, y: 0, z: 0, rotationY: Math.PI, scale: 1.0 },

    // 10. SLIPPERY ROAD
    // Faces East (Rotation -PI) for Westbound traffic.
    { id: "slippery", x: 66.5, y: 0, z: 39, rotationY: -Math.PI, scale: 1.0 },
];

// Sign Texture Paths
// Maps the 'id' to the actual image file located in the 'images/' directory.
export const signTextures = {
    parking: "images/rambu_parking.png",
    schoolzone: "images/rambu_school.png",
    noparking: "images/rambu_noparking.png",
    speedlimit: "images/rambu_speed40.png",
    stop: "images/rambu_stop.png",
    intersection: "images/rambu_intersection.png",
    noleft: "images/rambu_noleft.png",
    noright: "images/rambu_noright.png",
    noovertake: "images/rambu_noovertake.png",
    slippery: "images/rambu_slippery.png"
};

// Sign popup information (title, description, popup image)
export const signPopupInfo = {
    parking: {
        title: "Rambu Parkir (P)",
        desc: "Rambu ini menandakan area yang diperbolehkan untuk parkir kendaraan. Pengendara boleh berhenti dan memarkirkan kendaraannya.",
        img: "images/rambu_parking.png"
    },
    schoolzone: {
        title: "Rambu School Zone",
        desc: "Rambu peringatan area sekolah. Kurangi kecepatan dan waspada terhadap anak-anak yang menyeberang.",
        img: "images/rambu_school.png"
    },
    noparking: {
        title: "Rambu Dilarang Parkir",
        desc: "Rambu ini melarang kendaraan parkir di area tersebut. Dilarang meninggalkan kendaraan dalam keadaan mati.",
        img: "images/rambu_noparking.png"
    },
    speedlimit: {
        title: "Batas Kecepatan 40",
        desc: "Kendaraan dilarang melaju lebih dari 40 km/jam di area ini demi keselamatan.",
        img: "images/rambu_speed40.png"
    },
    stop: {
        title: "Rambu STOP",
        desc: "Pengendara WAJIB berhenti sejenak di garis stop, tengok kanan-kiri, dan jalan hanya jika aman.",
        img: "images/rambu_stop.png"
    },
    intersection: {
        title: "Persimpangan T",
        desc: "Peringatan akan ada persimpangan tiga di depan. Kurangi kecepatan dan siap-siap berbelok.",
        img: "images/rambu_intersection.png"
    },
    noleft: {
        title: "Dilarang Belok Kiri",
        desc: "Pengendara dilarang membelok ke kiri di persimpangan ini.",
        img: "images/rambu_noleft.png"
    },
    noright: {
        title: "Dilarang Belok Kanan",
        desc: "Pengendara dilarang membelok ke kanan di persimpangan ini.",
        img: "images/rambu_noright.png"
    },
    noovertake: {
        title: "Dilarang Mendahului",
        desc: "Dilarang menyalip kendaraan lain di jalur ini karena berbahaya (misal tikungan atau tanjakan).",
        img: "images/rambu_noovertake.png"
    },
    slippery: {
        title: "Jalan Licin",
        desc: "Permukaan jalan licin. Kurangi kecepatan dan hindari pengereman mendadak.",
        img: "images/rambu_slippery.png"
    }
};

// Label map for checklist display
export const labelMap = {
    parking: "Rambu Parkir (P)",
    schoolzone: "School Zone",
    noparking: "Dilarang Parkir",
    speedlimit: "Batas Kecepatan 40",
    stop: "STOP",
    intersection: "Persimpangan T",
    noleft: "Dilarang Belok Kiri",
    noright: "Dilarang Belok Kanan",
    noovertake: "Dilarang Mendahului",
    slippery: "Jalan Licin"
};

// Minimap colors for each sign
export const minimapColors = {
    parking: "#00aaff",
    schoolzone: "#ffd400",
    noparking: "#ff4d4d",
    speedlimit: "#ffffff",
    stop: "#cc0000",
    intersection: "#ffaa00",
    noleft: "#ff6699",
    noright: "#ff66cc",
    noovertake: "#ff9999",
    slippery: "#ffcc00"
};
