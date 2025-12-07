/**
 * Signs Module
 * 
 * Manages the creation and placement of Traffic Signs.
 * - Loads textures for each sign type.
 * - Creates 3D models (Board + Pole) for each sign.
 * - Handles raycasting interaction (finding which sign object was clicked).
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { scene } from '../core/scene.js';
import { signConfigs, signTextures as signTexturePaths } from '../data/signData.js';

// Exported list of clickable sign objects (for Raycasting)
export const clickableSigns = [];

// Cache for loaded textures to prevent re-loading
const loadedTextures = {};

/**
 * Pre-load all sign textures into memory.
 * Returns a map of { signId: texture }.
 */
export function loadSignTextures() {
    const textureLoader = new THREE.TextureLoader();

    Object.keys(signTexturePaths).forEach((id) => {
        loadedTextures[id] = textureLoader.load(signTexturePaths[id]);
    });

    return loadedTextures;
}

/**
 * Creates a physical 3D Sign object.
 * 
 * Structure:
 * - Group (Root)
 *   - Pole (Cylinder)
 *   - Front Board (Plane with Sign Texture)
 *   - Back Board (Plane with Gray Color)
 * 
 * @param id - Sign Identifier (e.g., 'stop', 'parkir')
 * @param x, y, z - World Coordinates
 * @param rotationY - Facing direction
 * @param scale - Size multiplier
 */
function createTextureSign(id, x, y, z, rotationY = 0, scale = 1.0) {
    const group = new THREE.Group();

    // Board dimensions
    const boardWidth = 1.8 * scale;
    const boardHeight = 1.8 * scale;

    // Board center height
    const boardCenterY = 3.2;
    // Pole extends halfway up the board (from ground to board center)
    const poleHeight = boardCenterY;

    // 1. Pole (Support post)
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, poleHeight, 12),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    pole.position.set(0, poleHeight / 2, -0.1);
    pole.castShadow = true;
    group.add(pole);

    // 2. Front Board (The visible sign)
    const frontGeo = new THREE.PlaneGeometry(boardWidth, boardHeight);
    const frontMat = new THREE.MeshStandardMaterial({
        map: loadedTextures[id], // Apply texture here
        color: 0xffffff,
        transparent: true,
        alphaTest: 0.5, // Crisp edges for PNG transparency
        side: THREE.FrontSide
    });
    const frontBoard = new THREE.Mesh(frontGeo, frontMat);
    frontBoard.position.set(0, boardCenterY, 0.02);
    frontBoard.castShadow = true;
    group.add(frontBoard);

    // 3. Back Board (The back of the sign)
    const backGeo = new THREE.PlaneGeometry(boardWidth, boardHeight);
    const backMat = new THREE.MeshStandardMaterial({
        color: 0x666666, // Dark grey back
        side: THREE.FrontSide
    });
    const backBoard = new THREE.Mesh(backGeo, backMat);
    backBoard.position.set(0, boardCenterY, -0.02);
    backBoard.rotation.y = Math.PI; // Face opposite direction
    backBoard.castShadow = true;
    group.add(backBoard);

    // Set world transformation
    group.position.set(x, y, z);
    group.rotation.y = rotationY;
    scene.add(group);

    // Register for intersection testing
    clickableSigns.push({ mesh: group, id: id });
}

/**
 * Initialize all traffic signs
 */
export function initSigns() {
    // First load all textures
    loadSignTextures();

    // Create all signs from config
    signConfigs.forEach((config) => {
        createTextureSign(
            config.id,
            config.x,
            config.y,
            config.z,
            config.rotationY,
            config.scale
        );
    });

    return clickableSigns;
}

/**
 * Find clickable sign from intersected object
 */
export function findClickableSignFromObject(obj) {
    let o = obj;
    while (o) {
        const found = clickableSigns.find((s) => s.mesh === o);
        if (found) return found;
        o = o.parent;
    }
    return null;
}
