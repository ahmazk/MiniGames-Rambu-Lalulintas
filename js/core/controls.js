/**
 * Controls Module
 * 
 * Handles all player interaction and movement:
 * - PointerLockControls: For First-Person view (mouse look).
 * - Keyboard Input: WASD for movement, Shift for sprint.
 * - Physics: Basic velocity and collision detection.
 * - Time Control: Keys 1-4 to change time of day.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/PointerLockControls.js';
import { camera, scene } from './scene.js';
import { buildingColliders } from '../world/buildings.js';

// Exported controls instance
export let controls;

// Movement state flags (Track active keys)
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let sprint = false;

// Physics Vectors
const velocity = new THREE.Vector3(); // Current speed and direction
const direction = new THREE.Vector3(); // Normalized direction input

// Day/night control variables (exported for external control)
export let dayNightAuto = false;
export let timeOfDay = 0.25; // 0..1 (start at "morning")

// Getters and Setters for Time Control
export function setDayNightAuto(value) {
    dayNightAuto = value;
}

export function setTimeOfDay(value) {
    timeOfDay = value;
}

export function getTimeOfDay() {
    return timeOfDay;
}

export function getDayNightAuto() {
    return dayNightAuto;
}

/**
 * Initialize pointer lock controls
 * @param {Function} onPopupOpenCallback - Callback to check if popup is open
 */
export function initControls(onPopupOpenCallback) {
    controls = new PointerLockControls(camera, document.body);
    scene.add(controls.getObject());

    // Set initial position
    controls.getObject().position.set(0, 2, 20);

    // Click to lock pointer (when popup is not open)
    document.body.addEventListener("click", (e) => {
        if (onPopupOpenCallback && onPopupOpenCallback()) return;

        const popup = document.getElementById("signPopup");
        if (popup && popup.style.display === "flex") return;
        if (popup && popup.contains(e.target)) return;

        if (!controls.isLocked) {
            try {
                controls.lock();
            } catch (error) {
                console.warn("PointerLock failed:", error);
            }
        }
    });

    // Keyboard listeners
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return controls;
}

/**
 * Update player movement based on delta time
 * @param {number} delta - Time since last frame
 */
export function updateMovement(delta) {
    if (!controls) return;

    // Apply friction
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    // Calculate direction
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    // Apply speed (Balanced: not too slow, not too fast)
    const speed = sprint ? 200.0 : 80.0;
    if (moveForward || moveBackward) {
        velocity.z -= direction.z * speed * delta;
    }
    if (moveLeft || moveRight) {
        velocity.x -= direction.x * speed * delta;
    }

    // Move player (with collision check)
    const oldPos = controls.getObject().position.clone();

    // Attempt X movement
    controls.moveRight(-velocity.x * delta);
    if (checkBuildingCollisions(controls.getObject().position)) {
        controls.getObject().position.x = oldPos.x;
        velocity.x = 0;
    }

    // Attempt Z movement
    controls.moveForward(-velocity.z * delta);
    if (checkBuildingCollisions(controls.getObject().position)) {
        controls.getObject().position.z = oldPos.z;
        velocity.z = 0;
    }

    // Keep player at fixed height
    controls.getObject().position.y = 2;

    // Apply strict city boundaries (Blocking Area)
    const limit = 130;
    const pos = controls.getObject().position;

    if (pos.x < -limit) {
        pos.x = -limit;
        velocity.x = 0; // Stop momentum
    }
    if (pos.x > limit) {
        pos.x = limit;
        velocity.x = 0;
    }
    if (pos.z < -limit) {
        pos.z = -limit;
        velocity.z = 0;
    }
    if (pos.z > limit) {
        pos.z = limit;
        velocity.z = 0;
    }
}

/**
 * Check collision with buildings
 */
function checkBuildingCollisions(position) {
    const playerRadius = 1.0;
    return buildingColliders.some(b => {
        const halfW = b.width / 2 + playerRadius;
        const halfD = b.depth / 2 + playerRadius;
        return (
            position.x > b.x - halfW &&
            position.x < b.x + halfW &&
            position.z > b.z - halfD &&
            position.z < b.z + halfD
        );
    });
}

/**
 * Handle keydown events
 */
function onKeyDown(e) {
    switch (e.code) {
        case "KeyW":
            moveForward = true;
            break;
        case "KeyA":
            moveLeft = true;
            break;
        case "KeyS":
            moveBackward = true;
            break;
        case "KeyD":
            moveRight = true;
            break;
        case "ShiftLeft":
        case "ShiftRight":
            sprint = true;
            break;
        // Time control keys
        case "Digit1":
            dayNightAuto = false;
            timeOfDay = 0.05; // Pagi (07:12)
            break;
        case "Digit2":
            dayNightAuto = false;
            timeOfDay = 0.25; // Siang (12:00 / Zenith)
            break;
        case "Digit3":
            dayNightAuto = false;
            timeOfDay = 0.48; // Sore/Senja (17:31)
            break;
        case "Digit4":
            dayNightAuto = false;
            timeOfDay = 0.75; // Malam (00:00 / Midnight)
            break;
        case "KeyN":
            dayNightAuto = !dayNightAuto;
            console.log("Day-night auto:", dayNightAuto);
            break;
    }
}

/**
 * Handle keyup events
 */
function onKeyUp(e) {
    switch (e.code) {
        case "KeyW":
            moveForward = false;
            break;
        case "KeyA":
            moveLeft = false;
            break;
        case "KeyS":
            moveBackward = false;
            break;
        case "KeyD":
            moveRight = false;
            break;
        case "ShiftLeft":
        case "ShiftRight":
            sprint = false;
            break;
    }
}
