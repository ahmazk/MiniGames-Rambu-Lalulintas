/**
 * Scene Module
 * 
 * Manages the foundational Three.js components:
 * - Scene: The container for all 3D objects.
 * - Camera: The player's view of the world.
 * - Renderer: The WebGL engine that draws the scene to the canvas.
 * - Global Utilities: Clock for delta time, Raycaster for interaction.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

// Exported scene objects for use in other modules
export let scene;
export let camera;
export let renderer;
export const clock = new THREE.Clock();
export let raycaster = new THREE.Raycaster();

/**
 * Initialize the 3D scene
 */
export function initScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaee6ff);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Handle window resize
    window.addEventListener("resize", onWindowResize);

    return { scene, camera, renderer };
}

/**
 * Handle window resize
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Render the scene
 */
export function render() {
    renderer.render(scene, camera);
}
