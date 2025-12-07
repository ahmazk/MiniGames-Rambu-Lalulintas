/**
 * Zebra Cross Object
 * 
 * Generates a pedestrian crosswalk using a series of parallel white strips.
 * - Group Position: The Z coordinate of the crosswalk center.
 * - Children: White BoxGeometries placed along the X axis.
 */

import * as THREE from 'three';

export class ZebraCross extends THREE.Group {
    /**
     * @param {number} xStart - Starting X coordinate
     * @param {number} xEnd - Ending X coordinate
     * @param {number} z - Z coordinate (center of road)
     * @param {number} step - Spacing between stripes
     */
    constructor(xStart, xEnd, z, step = 1.2) {
        super();

        const width = 1;
        const length = 1;

        // Set the Group position to the Z plane
        this.position.set(0, 0, z);

        // Generate Stripes along the X axis
        for (let x = xStart; x <= xEnd; x += step) {
            const stripe = new THREE.Mesh(
                new THREE.BoxGeometry(width, 0.05, length),
                new THREE.MeshStandardMaterial({ color: 0xffffff })
            );
            // Position relative to group (which is at 0,0,z)
            stripe.position.set(x, 0.03, 0);
            this.add(stripe);
        }
    }
}
