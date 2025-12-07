/**
 * Main Entry Point
 * Mini City 3D - Traffic Sign Educational Game
 * 
 * This file acts as the central conductor for the application, orchestrating
 * the initialization of all game systems (Scene, World, UI, Controls) and
 * managing the main game loop.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

// Core Modules (System Foundations)
import { initScene, scene, camera, clock, raycaster, render } from './core/scene.js';
import { initControls, updateMovement, controls } from './core/controls.js';

// World Modules (3D Environment & Objects)
import { initWorld } from './world/buildings.js';
import { initSigns, clickableSigns, findClickableSignFromObject } from './world/signs.js';
import { initLighting, updateTrafficLights, updateDayNight } from './world/lighting.js';

// UI Modules (Heads-Up Display & Interactivity)
import {
    openSignPopup,
    hidePopup,
    initPopupHandlers,
    getIsPopupOpen,
    signScores,
    signStates
} from './ui/popup.js';
import {
    initMinimap,
    initHud,
    updateInteractionHint,
    updateMinimap,
    updateGameClock
} from './ui/hud.js';

/**
 * Initialize all game components.
 * This function is called once when the page loads.
 * Order of initialization is critical:
 * 1. Scene & Core Systems
 * 2. Controls
 * 3. 3D World Content
 * 4. UI Overlays
 */
function init() {
    initScene();
    // Pass popup check to controls to prevent locking cursor when popup is open
    initControls(getIsPopupOpen);

    // Build the city
    initWorld();
    initSigns();
    initLighting();

    // Setup UI
    initMinimap();
    initHud(signScores, signStates);
    initPopupHandlers();

    // Add global click listener for interaction (raycasting)
    document.addEventListener("click", handleSceneClick, false);
}

/**
 * Handles click events within the 3D scene using Raycasting.
 * Used for interactions like clicking on traffic signs to open quizzes.
 */
function handleSceneClick(event) {
    if (!controls || !controls.isLocked) return;

    const mouse = new THREE.Vector2(0, 0);
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(
        clickableSigns.map((s) => s.mesh),
        true
    );

    if (intersects.length === 0) return;

    const obj = intersects[0].object;
    const found = findClickableSignFromObject(obj);

    if (found) {
        const dist = camera.position.distanceTo(found.mesh.position);
        if (dist < 12) {
            openSignPopup(found.id);
        }
    }
}

/**
 * Main Animation Loop
 * Executed on every frame (approx 60fps).
 * Handles all dynamic logic updates (movement, lighting, UI).
 */
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    updateMovement(delta);
    updateTrafficLights(delta);
    updateDayNight(delta);
    updateInteractionHint(raycaster);
    updateMinimap();
    updateGameClock();

    // Debug Display
    const posDisplay = document.getElementById('positionDisplay');
    if (posDisplay && camera) {
        const x = camera.position.x.toFixed(2);
        const y = camera.position.y.toFixed(2);
        const z = camera.position.z.toFixed(2);
        posDisplay.textContent = `X: ${x} | Y: ${y} | Z: ${z}`;
    }

    render();
}

window.onerror = function (msg, url, lineNo, columnNo, error) {
    const errorMsg = `Error: ${msg}\nLine: ${lineNo}\nColumn: ${columnNo}\nFile: ${url}`;
    console.error(errorMsg);

    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.width = '100%';
    errorDiv.style.background = 'red';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.innerText = errorMsg;
    document.body.appendChild(errorDiv);

    return false;
};

try {
    init();
    animate();
} catch (e) {
    console.error("Initialization error:", e);
    alert("Gagal memuat game: " + e.message);
}
