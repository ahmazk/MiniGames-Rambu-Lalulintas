/**
 * Tree Class
 * 
 * Creates a low-poly tree object for environmental decoration.
 * - Trunk: Cylinder geometry.
 * - Crown: Icosahedron geometry (low-poly sphere).
 * - Variation: Randomly selects a leaf color for variety.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

export class Tree extends THREE.Group {
    constructor(x, z) {
        super();

        // Leaf Color Palette (Season Simulation)
        const colors = [
            0x2e8b57, // Sea Green (Standard)
            0x228b22, // Forest Green
            0x66bb66, // Light Green
            0x556b2f, // Dark Olive
            0xff8c00, // Dark Orange (Autumn variant)
            0xeebb44  // Gold/Yellow (Autumn variant)
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Trunk (Brown Cylinder)
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.4, 1.2, 6),
            new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 1.0, metalness: 0.0 })
        );
        trunk.position.set(0, 0.6, 0); // Resting on ground
        trunk.castShadow = true;
        this.add(trunk);

        // Crown (Leafy part)
        const crown = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.2, 0), // Flat shading for low-poly look
            new THREE.MeshStandardMaterial({ color: randomColor, roughness: 0.9, metalness: 0.0 })
        );
        crown.position.set(0, 2, 0); // On top of trunk
        crown.castShadow = true;
        this.add(crown);

        this.position.set(x, 0, z);
    }
}
