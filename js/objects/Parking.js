/**
 * Parking Object
 * 
 * Creates a Parking Lot landmark.
 * - Base: Simple ground plane.
 * - Markings: Procedurally generates white parking lines.
 */

import * as THREE from 'three';

export class Parking extends THREE.Group {
    constructor(x, z) {
        super();

        // 1. Asphalt Ground
        const ground = new THREE.Mesh(
            new THREE.BoxGeometry(20, 0.05, 20),
            new THREE.MeshStandardMaterial({ color: 0x808080 })
        );
        ground.position.set(0, 0.03, 0); // Slightly above global ground to avoid z-fighting
        ground.receiveShadow = true;
        this.add(ground);

        // 2. Parking Lines
        // Generates white strips to demarcate parking spots.
        for (let i = -8; i <= 8; i += 4) {
            const line = new THREE.Mesh(
                new THREE.BoxGeometry(0.2, 0.02, 3.5),
                new THREE.MeshStandardMaterial({ color: 0xffffff })
            );
            // Positioned at Z offset relative to local center
            line.position.set(i, 0.05, 8);
            this.add(line);
        }

        this.position.set(x, 0, z);
    }
}
