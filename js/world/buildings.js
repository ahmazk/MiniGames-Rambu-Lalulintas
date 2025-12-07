/**
 * Buildings Module
 * 
 * Responsible for generating the static world environment:
 * - Ground/Terrain (Procedural Texture).
 * - Road Network (Grid System).
 * - Buildings (Shops, Offices, Skyscrapers).
 * - Landmarks (School, Parking, Zebra Crossings).
 * - Environmental Decoration (Trees).
 */

import { scene } from '../core/scene.js';
import { Road } from '../objects/Road.js';
import { Building } from '../objects/Building.js';
import { Tree } from '../objects/Tree.js';
import { School } from '../objects/School.js';
import { Parking } from '../objects/Parking.js';
import { ZebraCross } from '../objects/ZebraCross.js';
import { roadsideBuildings, mediumBuildings, skyscrapers } from '../data/buildingData.js';
import * as THREE from 'three';

// World Constants
const roadWidth = 12; // Width of the asphalt
const gridSpacing = 40; // Distance between road intersections

// Tree Exclusion Zones (Areas where trees shouldn't grow)
const noTreeZones = [
    { xMin: 30, xMax: 55, zMin: -55, zMax: -25 }, // Parking Area
    { xMin: -20, xMax: 20, zMin: -55, zMax: -25 }, // School Area
];

// Building Colliders (Used for player collision detection)
export const buildingColliders = [];

/**
 * Initialize the entire Game World.
 * Calls all sub-generators to build the city.
 */
export function initWorld() {
    createGround();     // Generate Asphalt/Grass Ground
    createRoads();      // Build Road Grid
    createBuildings();  // Place 3D Buildings
    createTrees();      // Plant Trees along roads

    // 1. School Building (Landmark)
    const school = new School(0, -40);
    scene.add(school);
    // Add collider to prevent walking through school
    buildingColliders.push({ x: 0, z: -40, width: 20, depth: 15 });

    // 2. Parking Lot (Landmark)
    const parking = new Parking(40, -40);
    scene.add(parking);

    // 3. Zebra Crossings (Pedestrian Safety)
    const zebra1 = new ZebraCross(13, 27, -30);
    scene.add(zebra1);

    const zebra2 = new ZebraCross(13, 28, -12);
    scene.add(zebra2);

    const zebra3 = new ZebraCross(-26, -13, -12);
    scene.add(zebra3);

    const zebra4 = new ZebraCross(-28, -13, 48);
    scene.add(zebra4);

    const zebra5 = new ZebraCross(53, 68, -30);
    scene.add(zebra5);
}

/**
 * Creates Ground with Procedural Texture.
 * Uses HTML5 Canvas API to draw a noise pattern (simulating asphalt/concrete)
 * and converts it to a Three.js Texture.
 */
function createGround() {
    // 1. Create Canvas for dynamic texture generation
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 2. Base Color (Dark Grey)
    ctx.fillStyle = '#444444';
    ctx.fillRect(0, 0, 512, 512);

    // 3. Add Noise (Random dots to simulate surface detail)
    for (let i = 0; i < 20000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#555555' : '#333333';
        const s = Math.random() * 2;
        ctx.fillRect(Math.random() * 512, Math.random() * 512, s, s);
    }

    // 4. Add subtle Grid/Paving lines
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 512; i += 64) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
    }
    ctx.stroke();

    // 5. Convert Canvas to Texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10); // Repeat 10x10 times across surface

    // 6. Create Ground Mesh
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(400, 400),
        new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.9, // Matte surface
            color: 0x888888
        })
    );
    ground.rotation.x = -Math.PI / 2; // Rotate to lie flat
    ground.receiveShadow = true;
    scene.add(ground);
}

/**
 * Membuat Jaringan Jalan (Grid)
 */
function createRoads() {
    // Jalan Vertikal (Utara-Selatan)
    for (let i = -100; i <= 100; i += gridSpacing) {
        const road = new Road(roadWidth, 300, i, 0);
        scene.add(road);
    }
    // Jalan Horizontal (Barat-Timur)
    for (let j = -100; j <= 100; j += gridSpacing) {
        const road = new Road(300, roadWidth, 0, j);
        scene.add(road);
    }
}


/**
 * Smart Tree Placement (Polar Coordinate System)
 * Places trees naturally around buildings without fixed grid alignment.
 * Uses random angles and distances to simulate organic growth.
 * 
 * @param config Building configuration (x, z, width, depth)
 * @param minCount Minimum trees per building
 * @param maxCount Maximum trees per building
 */
function addRandomTreesSmart(config, minCount = 8, maxCount = 15) {
    const treesPlaced = [];
    const maxAttempts = 300; // Bail-out to prevent infinite loops

    // Target random count for this building
    const targetCount = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    let count = 0;

    // Building Dimensions
    const halfW = config.width / 2;
    const halfD = config.depth / 2;
    const radiusMin = Math.max(halfW, halfD) + 1.5; // Start 1.5m away from walls
    const radiusMax = 15; // Max spread distance

    for (let i = 0; i < maxAttempts && count < targetCount; i++) {
        // 1. Generate Polar Coordinates
        const angle = Math.random() * Math.PI * 2; // Random 360 deg
        const dist = radiusMin + Math.random() * (radiusMax - radiusMin); // Random distance

        // Convert Polar to Cartesian
        const tx = config.x + Math.cos(angle) * dist;
        const tz = config.z + Math.sin(angle) * dist;

        // 2. CHECK: Inside Building? (Should be covered by radiusMin, but double check)
        if (tx > config.x - halfW - 1 && tx < config.x + halfW + 1 &&
            tz > config.z - halfD - 1 && tz < config.z + halfD + 1) {
            continue;
        }

        // 3. CHECK: Too close to road?
        if (isTooCloseToRoadLoose(tx, tz)) continue;

        // 4. CHECK: Inside forbidden zone?
        if (isInNoTreeZone(tx, tz)) continue;

        // 5. CHECK: Overlapping other trees?
        const overlap = treesPlaced.some(p => {
            const dx = p.x - tx;
            const dz = p.z - tz;
            return Math.sqrt(dx * dx + dz * dz) < 1.5; // Min spacing 1.5m
        });
        if (overlap) continue;

        // Place Tree
        const tree = new Tree(tx, tz);
        // Vary size naturally (0.9x - 1.5x)
        const scale = 0.9 + Math.random() * 0.6;
        tree.scale.set(scale, scale, scale);
        tree.rotation.y = Math.random() * Math.PI * 2; // Random facing

        scene.add(tree);
        treesPlaced.push({ x: tx, z: tz });
        count++;
    }
}

/**
 * Cek Jarak Pohon ke Jalan (Versi Longgar)
 * Memperbolehkan pohon tumbuh sedikit lebih dekat ke trotoar dibanding bangunan.
 */
function isTooCloseToRoadLoose(x, z) {
    // Lebar jalan 12 -> Setengahnya 6.
    // Kita ingin pohon di LUAR aspal (6) + buffer kecil (1.5) = 7.5
    const safeDist = (roadWidth / 2) + 1.5;

    if (Math.abs(z) < safeDist) return true;
    if (Math.abs(x) < safeDist) return true;

    for (let i = -100; i <= 100; i += gridSpacing) {
        if (Math.abs(x - i) < safeDist && Math.abs(z) < 150) return true;
        if (Math.abs(z - i) < safeDist && Math.abs(x) < 150) return true;
    }
    return false;
}

/**
 * Membuat Semua Gedung
 */
function createBuildings() {
    // 1. Buat Gedung Pinggir Jalan (Toko/Ruko)
    roadsideBuildings.forEach(config => {
        const building = new Building(config.x, config.z, config.width, config.height, config.depth, config.color);
        scene.add(building);
        addRandomTreesSmart(config);
        // Daftarkan ke sistem collision
        buildingColliders.push({ x: config.x, z: config.z, width: config.width, depth: config.depth });
    });

    // 2. Buat Gedung Menengah (Perkantoran)
    mediumBuildings.forEach(config => {
        const building = new Building(config.x, config.z, config.width, config.height, config.depth, config.color);
        scene.add(building);
        addRandomTreesSmart(config);
        buildingColliders.push({ x: config.x, z: config.z, width: config.width, depth: config.depth });
    });

    // 3. Buat Pencakar Langit (Apartemen/Hotel)
    skyscrapers.forEach(config => {
        const skyscraper = new Building(config.x, config.z, config.width, config.height, config.depth, config.color);
        scene.add(skyscraper);
        addRandomTreesSmart(config);
        buildingColliders.push({ x: config.x, z: config.z, width: config.width, depth: config.depth });
    });
}

/**
 * Cek apakah posisi berada di zona bebas pohon
 */
function isInNoTreeZone(x, z) {
    return noTreeZones.some(
        (zone) =>
            x >= zone.xMin &&
            x <= zone.xMax &&
            z >= zone.zMin &&
            z <= zone.zMax
    );
}

/**
 * Cek apakah posisi terlalu dekat dengan jalan (Versi Ketat untuk Gedung)
 */
function isTooCloseToRoad(x, z) {
    const margin = 5;

    if (Math.abs(z) < roadWidth / 2 + margin) return true;
    if (Math.abs(x) < roadWidth / 2 + margin) return true;

    for (let i = -100; i <= 100; i += gridSpacing) {
        if (Math.abs(x - i) < roadWidth / 2 + margin && Math.abs(z) < 150)
            return true;
        if (Math.abs(z - i) < roadWidth / 2 + margin && Math.abs(x) < 150)
            return true;
    }
    return false;
}

/**
 * Membuat Pohon Dekoratif di Sepanjang Jalan & Lapangan
 */
function createTrees() {
    const offsetFromRoad = 12;
    const treeSpacing = 8;
    const maxRange = 100;

    // Tanam pohon berjejer di jalan vertikal
    for (let i = -100; i <= 100; i += gridSpacing) {
        for (let z = -maxRange; z <= maxRange; z += treeSpacing) {
            const leftX = i - roadWidth / 2 - offsetFromRoad;
            const rightX = i + roadWidth / 2 + offsetFromRoad;

            if (!isInNoTreeZone(leftX, z) && !isTooCloseToRoad(leftX, z)) {
                const tree = new Tree(leftX, z);
                scene.add(tree);
            }
            if (!isInNoTreeZone(rightX, z) && !isTooCloseToRoad(rightX, z)) {
                const tree = new Tree(rightX, z);
                scene.add(tree);
            }
        }
    }

    // Tanam pohon besar di lapangan kosong
    const largeTreeLocations = [
        { x: 30, z: 0 }, { x: -30, z: 0 },
        { x: 50, z: 50 }, { x: -50, z: 50 },
        { x: 50, z: -60 }, { x: -50, z: -60 },
        { x: 70, z: 20 }, { x: -70, z: 20 },
        { x: 0, z: 60 }, { x: 0, z: -70 },
        { x: 85, z: 50 }, { x: -85, z: 50 },
        { x: 85, z: -50 }, { x: -85, z: -50 },
    ];

    largeTreeLocations.forEach(loc => {
        if (!isInNoTreeZone(loc.x, loc.z) && !isTooCloseToRoad(loc.x, loc.z)) {
            const bigTree = new Tree(loc.x, loc.z);
            bigTree.scale.set(2.5, 2.5, 2.5); // Ukuran raksasa
            scene.add(bigTree);
        }
    });
}
