/**
 * Bird Class
 * 
 * Creates a simple animated bird object.
 * - Geometry: Basic boxes for body and wings.
 * - Animation: Flapping wings and bobbing motion updated every frame.
 * - Behavior: Flies effectively in a straight line, wrapping around the world boundaries.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

export class Bird extends THREE.Group {
    constructor() {
        super();

        // Randomize bird color (Dark Grey vs Light Grey)
        const color = Math.random() > 0.5 ? 0x333333 : 0x555555;
        const mat = new THREE.MeshBasicMaterial({ color: color });

        // Left Wing (Grouped for rotation)
        const wingGeo = new THREE.BoxGeometry(0.8, 0.05, 0.3);
        const wingL = new THREE.Mesh(wingGeo, mat);
        wingL.position.set(-0.4, 0, 0); // Offset to pivot around shoulder
        this.wingLGroup = new THREE.Group();
        this.wingLGroup.add(wingL);
        this.add(this.wingLGroup);

        // Right Wing (Grouped for rotation)
        const wingR = new THREE.Mesh(wingGeo, mat);
        wingR.position.set(0.4, 0, 0); // Offset to pivot around shoulder
        this.wingRGroup = new THREE.Group();
        this.wingRGroup.add(wingR);
        this.add(this.wingRGroup);

        // Flight Properties
        this.speed = 5 + Math.random() * 5; // Random speed
        this.direction = new THREE.Vector3(
            Math.random() - 0.5,
            0,
            Math.random() - 0.5
        ).normalize(); // Random horizontal direction

        this.flapSpeed = 8 + Math.random() * 5;

        // Orient bird to face travel direction
        const angle = Math.atan2(this.direction.x, this.direction.z);
        this.rotation.y = angle + Math.PI / 2;
    }

    /**
     * Updates bird position and animation.
     * Called every frame in the main loop.
     * @param {number} delta - Time elapsed
     */
    update(delta) {
        // Move forward
        this.position.addScaledVector(this.direction, this.speed * delta);

        // World Wrap (Teleport to opposite side if out of bounds)
        // Keeps birds within a 600x600 area centered at 0,0
        if (this.position.x > 300) this.position.x = -300;
        if (this.position.x < -300) this.position.x = 300;
        if (this.position.z > 300) this.position.z = -300;
        if (this.position.z < -300) this.position.z = 300;

        // Wing Flap Animation (Sine wave)
        const time = Date.now() * 0.001;
        const flap = Math.sin(time * this.flapSpeed) * 0.4; // +/- 0.4 radians

        this.wingLGroup.rotation.z = flap;
        this.wingRGroup.rotation.z = -flap;

        // Vertical Bobbing (Sine wave)
        this.position.y += Math.sin(time * 2) * 0.02;
    }
}
