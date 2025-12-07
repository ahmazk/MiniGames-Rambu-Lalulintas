/**
 * HUD Module
 * 
 * Manages the Heads-Up Display (Overlay UI).
 * Components:
 * - Score Panel: Shows current quiz score.
 * - Mission Box: Tracks progress of learned traffic signs.
 * - Sign Checklist: Visual list of signs to find.
 * - Interaction Hint: "Click to interact" prompt when near valid targets.
 * - Game Clock: Displays in-game time (HH:MM).
 * - Minimap: Top-down view mapping player relative to signs.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { camera } from '../core/scene.js';
import { controls, getTimeOfDay } from '../core/controls.js';
import { SIGN_IDS, getTotalQuizQuestions } from '../data/quizData.js';
import { labelMap, minimapColors } from '../data/signData.js';
import { clickableSigns, findClickableSignFromObject } from '../world/signs.js';

// Minimap Configuration
const MINIMAP_SIZE = 160;        // Canvas pixel size (Square)
const MINIMAP_WORLD_HALF = 100;  // Radius of world area shown (in meters)

// Minimap Context References
let minimapCanvas;
let minimapCtx;

/**
 * Initializes the Minimap Canvas context.
 * Called at startup.
 */
export function initMinimap() {
    minimapCanvas = document.getElementById("minimap");
    if (minimapCanvas) {
        minimapCanvas.width = MINIMAP_SIZE;
        minimapCanvas.height = MINIMAP_SIZE;
        minimapCtx = minimapCanvas.getContext("2d");
    }
}

/**
 * Updates the Score display in the top-left HUD.
 * Formula: Sum of scores from all signs.
 * @param {Object} signScores - Dictionary of scores per sign ID.
 */
export function updateHud(signScores) {
    const hud = document.getElementById("hud");
    if (!hud) return;

    let totalBenar = 0;
    Object.keys(signScores).forEach((id) => {
        totalBenar += signScores[id];
    });

    const totalQuestions = getTotalQuizQuestions();
    // Score format: Points / Max Points
    hud.textContent = `Score: ${totalBenar} / ${totalQuestions * 2}`;
}

/**
 * Updates the "Mission" text box.
 * Tracks how many distinct signs have been fully mastered (all questions correct).
 * @param {Object} signStates - Dictionary mapping sign ID to boolean (Completed or not).
 */
export function updateMissionBox(signStates) {
    const box = document.getElementById("missionBox");
    if (!box) return;

    let completed = 0;
    SIGN_IDS.forEach((id) => {
        if (signStates[id]) completed++;
    });

    box.textContent = `Mission: Learn all signs (${completed}/${SIGN_IDS.length})`;

    if (completed === SIGN_IDS.length) {
        box.textContent = "Mission: All signs learned! ✅";
    }
}

/**
 * Updates the side panel checklist.
 * Shows specific icons for completed/uncompleted signs.
 * @param {Object} signStates - Dictionary mapping sign ID to mastery status.
 */
export function updateSignChecklist(signStates) {
    const panel = document.getElementById("signChecklist");
    if (!panel) return;

    const ul = panel.querySelector("ul");
    if (!ul) return;

    ul.innerHTML = "";

    SIGN_IDS.forEach((id) => {
        const li = document.createElement("li");

        const done = !!signStates[id];

        // Icon Status
        const icon = document.createElement("span");
        icon.textContent = done ? "✅" : "⬜";
        icon.style.minWidth = "18px";

        // Sign Name
        const text = document.createElement("span");
        text.textContent = labelMap[id] || id;

        // Badge Status
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = done ? "Done" : "Pending";

        li.appendChild(icon);
        li.appendChild(text);
        li.appendChild(badge);

        ul.appendChild(li);
    });
}

/**
 * Updates the floating interaction hint text ("Press Left Click...").
 * Logic:
 * 1. Raycasts from center of screen.
 * 2. Checks if hitting a clickable sign.
 * 3. Checks if distance is close enough (< 12 units).
 * 4. Shows/Hides prompt accordingly.
 * 
 * @param {THREE.Raycaster} raycaster - Shared raycaster instance
 */
export function updateInteractionHint(raycaster) {
    const hint = document.getElementById("interactionHint");
    if (!hint) return;

    // Only show when pointer is locked (Active gameplay)
    if (!controls || !controls.isLocked || clickableSigns.length === 0) {
        hint.classList.remove("visible");
        return;
    }

    // Raycast from Camera center (0,0 normalized)
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    // Check intersection with all sign meshes
    const intersects = raycaster.intersectObjects(
        clickableSigns.map((s) => s.mesh),
        true
    );

    if (intersects.length === 0) {
        hint.classList.remove("visible");
        return;
    }

    // Verify it's a valid registered sign
    const obj = intersects[0].object;
    const found = findClickableSignFromObject(obj);
    if (!found) {
        hint.classList.remove("visible");
        return;
    }

    // Distance check
    const dist = camera.position.distanceTo(found.mesh.position);
    if (dist < 12) {
        hint.textContent = "Click to View Sign & Quiz";
        hint.classList.add("visible");
    } else {
        hint.classList.remove("visible");
    }
}

/**
 * Redraws the Minimap (Top-Down Radar).
 * Called every frame.
 * 
 * Rendering Steps:
 * 1. Clear Canvas.
 * 2. Rotate entire context based on Player Direction (so "Up" on map is always "Forward" for player).
 * 3. Draw nearby signs as colored dots.
 * 4. Draw Player arrow in the center.
 */
export function updateMinimap() {
    if (!minimapCtx || !controls) return;

    const ctx = minimapCtx;
    ctx.clearRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

    // Background (Translucent Black)
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

    const center = MINIMAP_SIZE / 2;
    const playerPos = controls.getObject().position;
    const scale = MINIMAP_SIZE / (MINIMAP_WORLD_HALF * 2); // Map Scale factor

    // Get player looking direction (rotation around Y)
    const dirVec = new THREE.Vector3();
    controls.getDirection(dirVec);
    const dirAngle = Math.atan2(dirVec.x, dirVec.z);

    // --- WORLD ROTATION ---
    // Rotates the map so the player always faces "Up"
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(dirAngle - Math.PI); // Inverse rotation

    // Grid / Crosshair lines
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -center);
    ctx.lineTo(0, center);
    ctx.moveTo(-center, 0);
    ctx.lineTo(center, 0);
    ctx.stroke();

    // Draw Signs (Points of Interest)
    clickableSigns.forEach((s) => {
        if (!s.mesh || !s.mesh.position) return;

        // Relative position to player
        const dx = s.mesh.position.x - playerPos.x;
        const dz = s.mesh.position.z - playerPos.z;

        // Clipping: only draw if within range
        if (Math.abs(dx) > MINIMAP_WORLD_HALF || Math.abs(dz) > MINIMAP_WORLD_HALF) {
            return;
        }

        const mx = dx * scale;
        const mz = dz * scale;

        ctx.fillStyle = minimapColors[s.id] || "#cccccc";
        ctx.beginPath();
        ctx.arc(mx, mz, 3, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.restore();

    // --- PLAYER ICON ---
    // Drawn last, always in center, always pointing up (fixed because world rotates)
    ctx.save();
    ctx.translate(center, center);
    const size = 6;
    ctx.fillStyle = "#00ff00"; // Green Arrow
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.6, size);
    ctx.lineTo(-size * 0.6, size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

/**
 * Initialize HUD with initial values
 */
export function initHud(signScores, signStates) {
    updateHud(signScores);
    updateMissionBox(signStates);
    updateSignChecklist(signStates);
}

/**
 * Updates the Digital Clock in the HUD.
 * Converts internal `timeOfDay` (0.0 - 1.0) to HH:MM format.
 * 
 * Mapping:
 * 0.0  = 06:00 (Sunrise)
 * 0.25 = 12:00 (Noon)
 * 0.5  = 18:00 (Sunset)
 * 0.75 = 00:00 (Midnight)
 */
export function updateGameClock() {
    const clockEl = document.getElementById('gameClock');
    if (!clockEl) return;

    const timeVal = getTimeOfDay();

    // Base time is 6 AM because time=0.0 corresponds to sunrise logic
    let totalHours = 6 + (timeVal * 24);
    if (totalHours >= 24) totalHours -= 24;

    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);

    const hStr = hours.toString().padStart(2, '0');
    const mStr = minutes.toString().padStart(2, '0');

    clockEl.textContent = `${hStr}:${mStr}`;
}
