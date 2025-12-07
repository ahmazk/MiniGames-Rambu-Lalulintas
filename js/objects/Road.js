/**
 * Road Class
 * 
 * Represents a segment of the asphalt road.
 * Since the texture is procedural (handled in buildings.js ground generation),
 * this class currently renders a simple dark geometric strip to differentiate the road
 * from the sidewalk/ground.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

export class Road extends THREE.Mesh {
    /**
     * @param {number} width - Road width (usually 12)
     * @param {number} length - Road length
     * @param {number} x - Center X
     * @param {number} z - Center Z
     */
    constructor(width, length, x, z) {
        // Use simple BoxGeometry for performance.
        // Y-height is 0.05 to sit slightly above the ground plane (y=0) to avoid z-fighting.
        const geometry = new THREE.BoxGeometry(width, 0.05, length);
        const material = new THREE.MeshStandardMaterial({
            color: 0x333333, // Dark Asphalt Gray
            roughness: 0.9,  // Rough surface
            metalness: 0.1
        });

        super(geometry, material);

        this.position.set(x, 0.025, z); // Center slightly raised
        this.receiveShadow = true;
    }
}
