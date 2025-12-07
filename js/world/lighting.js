/**
 * Lighting Module
 * 
 * Manages the entire environmental atmosphere of the game:
 * - Day/Night Cycle: Simulates a 24-hour cycle with sun and moon movement.
 * - Celestial Bodies: Sun, Moon, and procedural moving Clouds.
 * - Global Lighting: Hemisphere light (ambient) and Directional light (sun/moon shadow caster).
 * - Artificial Lighting: Street lamps and Dynamic Traffic Lights.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { scene } from '../core/scene.js';
import { getDayNightAuto, getTimeOfDay, setTimeOfDay } from '../core/controls.js';

// Global Light Objects
export let hemiLight;
export let sunLight;

// Celestial Meshes
let sunMesh;
let moonMesh;
let cloudsGroup;

// Collections for update loops
export const streetLamps = [];
export const trafficLights = [];

/**
 * Initialize all lighting systems.
 * Called once at game start.
 * 
 * Steps:
 * 1. Setup Fog for atmospheric depth.
 * 2. create Global Lights (Hemisphere + Directional).
 * 3. Create visual Sky objects (Sun, Moon, Clouds).
 * 4. Generate all Street Lamps.
 * 5. Initialize Traffic Lights at intersections.
 */
export function initLighting() {
    // 1. Atmospheric Fog (Matches sky color)
    scene.fog = new THREE.Fog(0xaee6ff, 50, 200);

    // 2. Hemisphere Light (Soft ambient gradient from sky to ground)
    hemiLight = new THREE.HemisphereLight(0xffffff, 0x88bbff, 0.7);
    scene.add(hemiLight);

    // 3. Directional Light (The "Sun", casts shadows)
    sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(50, 60, -30);
    sunLight.castShadow = true;

    // Optimization: Shadow Map Size (1024x1024 is a good balance)
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // 4. Create Sky Visuals
    createSkyObjects();

    // 5. Generate Street Lamps
    createAllStreetLamps();

    // 6. Setup Traffic Lights in world coordinates
    createTrafficLight(13, -27);
    createTrafficLight(27, -27);
    createTrafficLight(-13, -28);
    createTrafficLight(-13, 53);
    createTrafficLight(67, -27);
}

/**
 * Creates visual Sky Celestial Objects.
 * - Sun: Glowing sphere.
 * - Moon: Smaller glowing sphere with soft point light.
 * - Clouds: Procedurally generated groups of shapes.
 */
function createSkyObjects() {
    // -- Sun --
    const sunGeo = new THREE.SphereGeometry(6, 32, 32);
    // Sun material uses high emissive intensity for "blinding" effect
    const sunMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,      // Base Orange
        emissive: 0xffdd00,   // Golden Glow
        emissiveIntensity: 5.0, // Very Bright
        roughness: 0.1
    });
    sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    // -- Moon --
    const moonGeo = new THREE.SphereGeometry(5, 32, 32);
    // Moon is also emissive but white/pale
    const moonMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffee,
        emissiveIntensity: 3.0,
        roughness: 0.5
    });
    moonMesh = new THREE.Mesh(moonGeo, moonMat);
    scene.add(moonMesh);

    // Add a PointLight to the moon to simulate moonlight casting
    const moonLight = new THREE.PointLight(0xaaccff, 0.8, 250);
    moonMesh.add(moonLight);

    // -- Clouds (Procedural) --
    createClouds();
}

/**
 * Membuat Gugusan Awan
 */
function createClouds() {
    cloudsGroup = new THREE.Group();
    scene.add(cloudsGroup);

    const cloudCount = 15;
    const cloudMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        flatShading: true,
        roughness: 0.9,
        transparent: true,
        opacity: 0.9
    });

    for (let i = 0; i < cloudCount; i++) {
        const cluster = new THREE.Group();

        // Buat beberapa kotak/bola untuk membentuk satu awan
        const blobs = 3 + Math.floor(Math.random() * 5);
        for (let j = 0; j < blobs; j++) {
            const size = 3 + Math.random() * 4;
            // Gunakan Dodecahedron untuk bentuk awan low-poly yang bagus
            const geo = new THREE.DodecahedronGeometry(size, 0);
            const blob = new THREE.Mesh(geo, cloudMat);

            blob.position.set(
                (Math.random() - 0.5) * size * 2,
                (Math.random() - 0.5) * size,
                (Math.random() - 0.5) * size * 1.5
            );
            cluster.add(blob);
        }

        // Posisi Acak di Langit
        cluster.position.set(
            (Math.random() - 0.5) * 400, // X: Sebar luas
            60 + Math.random() * 40,     // Y: Tinggi 60-100
            (Math.random() - 0.5) * 400  // Z: Sebar luas
        );

        // Simpan data kecepatan untuk animasi
        cluster.userData = {
            speed: 0.5 + Math.random() * 1.5
        };

        cloudsGroup.add(cluster);
    }
}

/**
 * Creates a detailed Street Lamp object using Hierarchical Modeling.
 * The lamp consists of multiple parts grouped together for easier positioning.
 * 
 * Hierarchy:
 * - LampGroup (Root)
 *   - Base (Cylinder)
 *   - Pole (Cylinder)
 *   - ArmGroup (Tilted Group)
 *     - Arm (Box)
 *     - HeadGroup (Rotated to be horizontal)
 *       - Head (Box - The lamp casing)
 *       - Bulb (Box - The emissive light source)
 *       - Light (PointLight - The actual light emitter)
 * 
 * @param {number} x - X coordinate
 * @param {number} z - Z coordinate
 * @param {number} rotationY - Rotation around Y axis (in radians)
 */
function createStreetLamp(x, z, rotationY = 0) {
    const lampGroup = new THREE.Group();
    lampGroup.position.set(x, 0, z);
    lampGroup.rotation.y = rotationY;

    // 1. Base (Concrete foundation)
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.45, 0.5, 16),
        new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 })
    );
    base.position.set(0, 0.25, 0);
    lampGroup.add(base);

    // 2. Pole (Main vertical post)
    const poleHeight = 6.0;
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.25, poleHeight, 16),
        new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6 })
    );
    pole.position.set(0, poleHeight / 2 + 0.5, 0);
    pole.castShadow = true;
    pole.receiveShadow = true;
    lampGroup.add(pole);

    // 3. ARM GROUP (Holds the lamp head)
    // Positioned at the top of the pole and tilted slightly
    const armGroup = new THREE.Group();
    armGroup.position.set(0, poleHeight + 0.4, 0); // At top of pole
    armGroup.rotation.z = Math.PI / 8; // Tilt angle (22.5 degrees)
    lampGroup.add(armGroup);

    // a. Arm Mesh
    const armLength = 1.8;
    const arm = new THREE.Mesh(
        new THREE.BoxGeometry(armLength, 0.15, 0.15),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    // Shift center so it extends outwards
    arm.position.set(armLength / 2, 0, 0);
    armGroup.add(arm);

    // 4. HEAD GROUP (The actual lamp housing)
    const headGroup = new THREE.Group();
    headGroup.position.set(armLength, 0, 0); // At end of arm
    // Rotate back to be parallel with the ground
    headGroup.rotation.z = -Math.PI / 8;
    armGroup.add(headGroup);

    // a. Lamp Head Casing (Box style)
    const headGeo = new THREE.BoxGeometry(0.8, 0.2, 0.35);
    const head = new THREE.Mesh(
        headGeo,
        new THREE.MeshStandardMaterial({ color: 0x222222 })
    );
    // Offset slightly forward
    head.position.set(0.4, 0, 0);
    headGroup.add(head);

    // b. LED Bulb (Emissive material for "glow" look)
    const bulb = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.05, 0.25),
        new THREE.MeshStandardMaterial({
            color: 0xffffee,
            emissive: 0xffaa00,
            emissiveIntensity: 2.0
        })
    );
    // Attached to bottom of head
    bulb.position.set(0.4, -0.11, 0);
    headGroup.add(bulb);

    // c. Actual Light Source (PointLight)
    const light = new THREE.PointLight(0xffddaa, 0, 40, 1.5);
    light.position.set(0.4, -0.5, 0); // Below bulb
    light.castShadow = false; // Disable shadow for performance
    headGroup.add(light);

    scene.add(lampGroup);
    // Store reference for day/night updates
    streetLamps.push({ group: lampGroup, light, bulb });
}

/**
 * Updates the Day/Night cycle, Sun/Moon position, and Lighting intensity.
 * Called every frame.
 * 
 * Logic:
 * 1. Update `timeOfDay` based on delta time (if auto-cycle is ON).
 * 2. Calculate Sun position using circular orbit math (sin/cos).
 * 3. Position Moon opposite to Sun.
 * 4. Animate clouds (move horizontally).
 * 5. Update Sky color + Fog color based on `dayFactor` (gradient interpolation).
 * 6. Toggle Street Lights during night hours.
 * 
 * @param {number} delta - Time elapsed since last frame
 */
export function updateDayNight(delta) {
    if (!hemiLight || !sunLight) return;

    // Cycle Speed Calculation:
    // 1 Real Sec = 2 Game Minutes.
    // 1 Game Day = 1440 Minutes.
    // Speed factor approx 0.001388.
    const cycleSpeed = 0.001388;
    let timeOfDay = getTimeOfDay();

    // Update time if Auto Cycle is enabled
    if (getDayNightAuto()) {
        timeOfDay = (timeOfDay + delta * cycleSpeed) % 1;
        setTimeOfDay(timeOfDay);
    }

    // --- CELESTIAL MECHANICS ---
    const angle = timeOfDay * Math.PI * 2;
    const sunHeight = Math.sin(angle);
    const orbitRadius = 150;

    // 1. Update Sun Position
    const sunX = Math.cos(angle) * orbitRadius;
    const sunY = Math.sin(angle) * orbitRadius;
    const sunZ = -30;

    sunLight.position.set(sunX, Math.max(10, sunY), sunZ);

    if (sunMesh) {
        sunMesh.position.set(sunX, sunY, sunZ);
        sunMesh.visible = sunY > -10; // Hide if below horizon
    }

    // 2. Update Moon Position (Opposite to Sun)
    if (moonMesh) {
        moonMesh.position.set(-sunX, -sunY, -sunZ);
        moonMesh.visible = -sunY > -10;
        moonMesh.lookAt(0, 0, 0);
    }

    // 3. Animate Clouds
    if (cloudsGroup) {
        cloudsGroup.children.forEach(cloud => {
            cloud.position.x += cloud.userData.speed * delta;
            // Wrap around world
            if (cloud.position.x > 250) cloud.position.x = -250;
        });

        // Dynamic Cloud Color (Darker at night)
        const cloudColorVal = Math.max(0.2, sunHeight);
        const c = new THREE.Color().setScalar(cloudColorVal);
        if (cloudsGroup.children.length > 0) {
            cloudsGroup.children[0].children[0].material.color.copy(c);
        }
    }


    // --- ATMOSPHERE & LIGHTING INTENSITY ---
    const dayFactor = Math.max(0, sunHeight);
    const nightFactor = 1 - dayFactor;

    sunLight.intensity = 1.3 * dayFactor;
    hemiLight.intensity = 0.4 + 0.6 * dayFactor;

    // Sky Color Interpolation
    const dayColor = new THREE.Color(0xaee6ff); // Light Blue
    const sunsetColor = new THREE.Color(0xffc38b); // Orange/Peach
    const nightColor = new THREE.Color(0x020924); // Deep Navy

    let skyColor;
    if (dayFactor > 0.3) {
        // Day -> Sunset transition
        const t = 1 - (dayFactor - 0.3) / 0.7;
        skyColor = new THREE.Color().lerpColors(dayColor, sunsetColor, Math.max(0, Math.min(1, t * 0.4)));
    } else {
        // Sunset -> Night transition
        const t = 1 - dayFactor / 0.3;
        skyColor = new THREE.Color().lerpColors(sunsetColor, nightColor, t);
    }

    scene.background = skyColor;
    if (scene.fog) {
        scene.fog.color.copy(skyColor);
    }

    // Street Lamps Logic controls
    // Lights turn on when nightFactor > 0.2
    streetLamps.forEach((lamp) => {
        const intensity = 3.0 * Math.max(0, nightFactor - 0.2);
        lamp.light.intensity = intensity;
        lamp.bulb.material.emissiveIntensity = intensity > 0.1 ? 2.0 : 0;
    });
}

function createAllStreetLamps() {
    createStreetLamp(46, -29, Math.PI / 2);
    createStreetLamp(28.5, -46, Math.PI);
    createStreetLamp(52, 81, 0);
    createStreetLamp(-13, 34, Math.PI);
    createStreetLamp(12.5, -1, 0);
    createStreetLamp(-38, -67, -Math.PI / 2);
    createStreetLamp(-35, -27, -Math.PI / 2);
    createStreetLamp(67, -77, -Math.PI);
    createStreetLamp(107, -4, Math.PI);
    createStreetLamp(67, 33, -Math.PI);
    createStreetLamp(13, -33, 0);
    createStreetLamp(34, -29, Math.PI / 2);
    createStreetLamp(12, 34, 0);
    createStreetLamp(-12, 12, Math.PI);
    createStreetLamp(-28, 28, 0);
    createStreetLamp(-28, -10, 0);
    createStreetLamp(-10, -10, Math.PI);
    createStreetLamp(-5, -28.5, -Math.PI / 2);
    createStreetLamp(-52, 28, Math.PI);
    createStreetLamp(-52, 12, Math.PI);

    // -- Generated Intelligent Lamps (Pinwheel) --
    createStreetLamp(-108, -132, 0);
    createStreetLamp(-108, -108, Math.PI / 2);
    createStreetLamp(-132, -108, Math.PI);
    createStreetLamp(-132, -132, -Math.PI / 2);
    createStreetLamp(-108, -92, 0);
    createStreetLamp(-108, -68, Math.PI / 2);
    createStreetLamp(-132, -68, Math.PI);
    createStreetLamp(-132, -92, -Math.PI / 2);
    createStreetLamp(-108, -52, 0);
    createStreetLamp(-108, -28, Math.PI / 2);
    createStreetLamp(-132, -28, Math.PI);
    createStreetLamp(-132, -52, -Math.PI / 2);
    createStreetLamp(-108, -12, 0);
    createStreetLamp(-108, 12, Math.PI / 2);
    createStreetLamp(-132, 12, Math.PI);
    createStreetLamp(-132, -12, -Math.PI / 2);
    createStreetLamp(-108, 28, 0);
    createStreetLamp(-108, 52, Math.PI / 2);
    createStreetLamp(-132, 52, Math.PI);
    createStreetLamp(-132, 28, -Math.PI / 2);
    createStreetLamp(-108, 68, 0);
    createStreetLamp(-108, 92, Math.PI / 2);
    createStreetLamp(-132, 92, Math.PI);
    createStreetLamp(-132, 68, -Math.PI / 2);
    createStreetLamp(-108, 108, 0);
    createStreetLamp(-108, 132, Math.PI / 2);
    createStreetLamp(-132, 132, Math.PI);
    createStreetLamp(-132, 108, -Math.PI / 2);
    createStreetLamp(-68, -132, 0);
    createStreetLamp(-68, -108, Math.PI / 2);
    createStreetLamp(-92, -108, Math.PI);
    createStreetLamp(-92, -132, -Math.PI / 2);
    createStreetLamp(-68, -92, 0);
    createStreetLamp(-68, -68, Math.PI / 2);
    createStreetLamp(-92, -68, Math.PI);
    createStreetLamp(-92, -92, -Math.PI / 2);
    createStreetLamp(-68, -52, 0);
    createStreetLamp(-68, -28, Math.PI / 2);
    createStreetLamp(-92, -28, Math.PI);
    createStreetLamp(-92, -52, -Math.PI / 2);
    createStreetLamp(-68, -12, 0);
    createStreetLamp(-68, 12, Math.PI / 2);
    createStreetLamp(-92, 12, Math.PI);
    createStreetLamp(-92, -12, -Math.PI / 2);
    createStreetLamp(-68, 108, 0);
    createStreetLamp(-68, 132, Math.PI / 2);
    createStreetLamp(-92, 132, Math.PI);
    createStreetLamp(-92, 108, -Math.PI / 2);
    createStreetLamp(-28, -132, 0);
    createStreetLamp(-28, -108, Math.PI / 2);
    createStreetLamp(-52, -108, Math.PI);
    createStreetLamp(-52, -132, -Math.PI / 2);
    createStreetLamp(-28, -52, 0);
    createStreetLamp(-52, -28, Math.PI);
    createStreetLamp(-52, -52, -Math.PI / 2);
    createStreetLamp(-28, 12, Math.PI / 2);
    createStreetLamp(-52, -12, -Math.PI / 2);
    createStreetLamp(-28, 52, Math.PI / 2);
    createStreetLamp(-52, 52, Math.PI);
    createStreetLamp(-28, 108, 0);
    createStreetLamp(-28, 132, Math.PI / 2);
    createStreetLamp(-52, 132, Math.PI);
    createStreetLamp(-52, 108, -Math.PI / 2);
    createStreetLamp(12, -132, 0);
    createStreetLamp(12, -108, Math.PI / 2);
    createStreetLamp(-12, -108, Math.PI);
    createStreetLamp(-12, -132, -Math.PI / 2);
    createStreetLamp(12, -92, 0);
    createStreetLamp(12, -68, Math.PI / 2);
    createStreetLamp(-12, -68, Math.PI);
    createStreetLamp(-12, -92, -Math.PI / 2);
    createStreetLamp(12, -12, 0);
    createStreetLamp(12, 12, Math.PI / 2);
    createStreetLamp(12, 28, 0);
    createStreetLamp(12, 52, Math.PI / 2);
    createStreetLamp(-12, 52, Math.PI);
    createStreetLamp(-12, 28, -Math.PI / 2);
    createStreetLamp(12, 68, 0);
    createStreetLamp(12, 92, Math.PI / 2);
    createStreetLamp(-12, 92, Math.PI);
    createStreetLamp(-12, 68, -Math.PI / 2);
    createStreetLamp(12, 108, 0);
    createStreetLamp(12, 132, Math.PI / 2);
    createStreetLamp(-12, 132, Math.PI);
    createStreetLamp(-12, 108, -Math.PI / 2);
    createStreetLamp(52, -132, 0);
    createStreetLamp(52, -108, Math.PI / 2);
    createStreetLamp(28, -108, Math.PI);
    createStreetLamp(28, -132, -Math.PI / 2);
    createStreetLamp(52, -12, 0);
    createStreetLamp(52, 12, Math.PI / 2);
    createStreetLamp(28, 12, Math.PI);
    createStreetLamp(28, -12, -Math.PI / 2);
    createStreetLamp(52, 28, 0);
    createStreetLamp(52, 52, Math.PI / 2);
    createStreetLamp(28, 52, Math.PI);
    createStreetLamp(28, 28, -Math.PI / 2);
    createStreetLamp(52, 68, 0);
    createStreetLamp(52, 92, Math.PI / 2);
    createStreetLamp(28, 92, Math.PI);
    createStreetLamp(28, 68, -Math.PI / 2);
    createStreetLamp(52, 108, 0);
    createStreetLamp(52, 132, Math.PI / 2);
    createStreetLamp(28, 132, Math.PI);
    createStreetLamp(28, 108, -Math.PI / 2);
    createStreetLamp(92, -132, 0);
    createStreetLamp(92, -108, Math.PI / 2);
    createStreetLamp(68, -108, Math.PI);
    createStreetLamp(68, -132, -Math.PI / 2);
    createStreetLamp(92, -52, 0);
    createStreetLamp(92, -28, Math.PI / 2);
    createStreetLamp(68, -28, Math.PI);
    createStreetLamp(68, -52, -Math.PI / 2);
    createStreetLamp(92, -12, 0);
    createStreetLamp(92, 12, Math.PI / 2);
    createStreetLamp(68, 12, Math.PI);
    createStreetLamp(68, -12, -Math.PI / 2);
    createStreetLamp(92, 28, 0);
    createStreetLamp(92, 52, Math.PI / 2);
    createStreetLamp(68, 52, Math.PI);
    createStreetLamp(68, 28, -Math.PI / 2);
    createStreetLamp(92, 108, 0);
    createStreetLamp(92, 132, Math.PI / 2);
    createStreetLamp(68, 132, Math.PI);
    createStreetLamp(68, 108, -Math.PI / 2);
    createStreetLamp(132, -132, 0);
    createStreetLamp(132, -108, Math.PI / 2);
    createStreetLamp(108, -108, Math.PI);
    createStreetLamp(108, -132, -Math.PI / 2);
    createStreetLamp(132, -92, 0);
    createStreetLamp(132, -68, Math.PI / 2);
    createStreetLamp(108, -68, Math.PI);
    createStreetLamp(108, -92, -Math.PI / 2);
    createStreetLamp(132, -52, 0);
    createStreetLamp(132, -28, Math.PI / 2);
    createStreetLamp(108, -28, Math.PI);
    createStreetLamp(108, -52, -Math.PI / 2);
    createStreetLamp(132, -12, 0);
    createStreetLamp(132, 12, Math.PI / 2);
    createStreetLamp(108, 12, Math.PI);
    createStreetLamp(108, -12, -Math.PI / 2);
    createStreetLamp(132, 28, 0);
    createStreetLamp(132, 52, Math.PI / 2);
    createStreetLamp(108, 52, Math.PI);
    createStreetLamp(108, 28, -Math.PI / 2);
    createStreetLamp(132, 68, 0);
    createStreetLamp(132, 92, Math.PI / 2);
    createStreetLamp(108, 92, Math.PI);
    createStreetLamp(108, 68, -Math.PI / 2);
    createStreetLamp(132, 108, 0);
    createStreetLamp(132, 132, Math.PI / 2);
    createStreetLamp(108, 132, Math.PI);
    createStreetLamp(108, 108, -Math.PI / 2);
    createStreetLamp(12, -52, 0);
    createStreetLamp(12, -28, Math.PI / 2);
    createStreetLamp(-12, -28, Math.PI);
    createStreetLamp(-12, -52, -Math.PI / 2);
    createStreetLamp(52, -52, 0);
    createStreetLamp(52, -28, Math.PI / 2);
    createStreetLamp(28, -28, Math.PI);
    createStreetLamp(28, -52, -Math.PI / 2);
    createStreetLamp(-68, 68, 0);
    createStreetLamp(-68, 92, Math.PI / 2);
    createStreetLamp(-92, 92, Math.PI);
    createStreetLamp(-92, 68, -Math.PI / 2);
    createStreetLamp(-28, 68, 0);
    createStreetLamp(-28, 92, Math.PI / 2);
    createStreetLamp(-52, 92, Math.PI);
    createStreetLamp(-52, 68, -Math.PI / 2);
    createStreetLamp(-68, 28, 0);
    createStreetLamp(-68, 52, Math.PI / 2);
    createStreetLamp(-92, 52, Math.PI);
    createStreetLamp(-92, 28, -Math.PI / 2);
    createStreetLamp(92, -92, 0);
    createStreetLamp(92, -68, Math.PI / 2);
    createStreetLamp(68, -92, -Math.PI / 2);
    createStreetLamp(52, -92, 0);
    createStreetLamp(52, -68, Math.PI / 2);
    createStreetLamp(28, -68, Math.PI);
    createStreetLamp(28, -92, -Math.PI / 2);
    createStreetLamp(92, 68, 0);
    createStreetLamp(92, 92, Math.PI / 2);
    createStreetLamp(68, 92, Math.PI);
    createStreetLamp(68, 68, -Math.PI / 2);
    createStreetLamp(-28, -92, 0);
    createStreetLamp(-28, -68, Math.PI / 2);
    createStreetLamp(-52, -68, Math.PI);
    createStreetLamp(-52, -92, -Math.PI / 2);
}

function createTrafficLight(x, z) {
    const group = new THREE.Group();

    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 5, 8),
        new THREE.MeshStandardMaterial({ color: 0x444444 })
    );
    pole.position.set(0, 2.5, 0);
    group.add(pole);

    const box = new THREE.Mesh(
        new THREE.BoxGeometry(1, 3, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x222222 })
    );
    box.position.set(0, 4.5, 0);
    group.add(box);

    const lightGeo = new THREE.SphereGeometry(0.25, 12, 12);
    const red = new THREE.Mesh(lightGeo, new THREE.MeshStandardMaterial({ color: 0x330000, emissive: 0x000000 }));
    red.position.set(0, 5.6, -0.45);
    const yellow = new THREE.Mesh(lightGeo, new THREE.MeshStandardMaterial({ color: 0x332200, emissive: 0x000000 }));
    yellow.position.set(0, 4.5, -0.45);
    const green = new THREE.Mesh(lightGeo, new THREE.MeshStandardMaterial({ color: 0x003300, emissive: 0x000000 }));
    green.position.set(0, 3.4, -0.45);

    group.add(red, yellow, green);
    trafficLights.push({ red, yellow, green, timer: 0, state: 0 });
    group.position.set(x, 0, z);
    scene.add(group);
}

export function updateTrafficLights(delta) {
    const redTime = 4;
    const greenTime = 4;
    const yellowTime = 2;

    trafficLights.forEach((light) => {
        light.timer += delta;
        if (light.state === 0 && light.timer > redTime) {
            light.state = 1;
            light.timer = 0;
        } else if (light.state === 1 && light.timer > greenTime) {
            light.state = 2;
            light.timer = 0;
        } else if (light.state === 2 && light.timer > yellowTime) {
            light.state = 0;
            light.timer = 0;
        }
        light.red.material.emissive.setHex(0x000000);
        light.yellow.material.emissive.setHex(0x000000);
        light.green.material.emissive.setHex(0x000000); // Reset all
        if (light.state === 0) light.red.material.emissive.setHex(0xff0000);
        if (light.state === 1) light.green.material.emissive.setHex(0x00ff00);
        if (light.state === 2) light.yellow.material.emissive.setHex(0xffcc00);
    });
}
