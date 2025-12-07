/**
 * School Building Object
 * 
 * A custom landmark building representing a School.
 * Features:
 * - Distinctive Architecture: Pillars, overhangs, and a unique color.
 * - Emissive Sign: "SCHOOL" text drawn on a canvas and used as a texture / emissive map.
 * - Dynamic Lighting: Point light at entrance and emissive windows.
 */

import * as THREE from 'three';

export class School extends THREE.Group {
    constructor(x, z) {
        super();

        // 1. Main Building Body (Terra Cotta Color)
        const mainMat = new THREE.MeshStandardMaterial({ color: 0xeebb99 });
        const building = new THREE.Mesh(
            new THREE.BoxGeometry(22, 12, 16),
            mainMat
        );
        building.position.set(0, 6, 0);
        building.castShadow = true;
        building.receiveShadow = true;
        this.add(building);

        // 2. Entrance Pillars
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 12), pillarMat);
        p1.position.set(-5, 6, 9);
        this.add(p1);

        const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 12), pillarMat);
        p2.position.set(5, 6, 9);
        this.add(p2);

        // Roof Overhang at entrance
        const roof = new THREE.Mesh(new THREE.BoxGeometry(16, 1, 6), mainMat);
        roof.position.set(0, 12.5, 6);
        this.add(roof);

        // 3. Glowing Sign Generation (Canvas API)
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // Sign Background (Dark Blue)
        ctx.fillStyle = '#003366';
        ctx.fillRect(0, 0, 512, 128);

        // Sign Border (White)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, 502, 118);

        // Sign Text ("SCHOOL")
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SCHOOL', 256, 64);

        // Create Texture from Canvas
        const texture = new THREE.CanvasTexture(canvas);
        const signMat = new THREE.MeshStandardMaterial({
            map: texture,
            color: 0xffffff,
            emissive: 0xeeeeff, // Slight self-illumination
            emissiveMap: texture,
            emissiveIntensity: 0.5
        });

        const signBoard = new THREE.Mesh(
            new THREE.BoxGeometry(10, 2.5, 0.3),
            signMat
        );
        signBoard.position.set(0, 9, 9); // Positioned above entrance
        this.add(signBoard);

        // 4. Windows (Emissive at night)
        const windowMat = new THREE.MeshStandardMaterial({
            color: 0x555555,
            emissive: 0xffaa00, // Warm yellow glow
            emissiveIntensity: 1.0,
            roughness: 0.2
        });

        // Loop to create side windows
        for (let i = -6; i <= 6; i += 12) {
            const w = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 0.2), windowMat);
            w.position.set(i, 5, 8.1); // Slightly popping out of front wall
            this.add(w);
        }

        // 5. Entrance Light
        // A point light to illuminate the porch area
        const light = new THREE.PointLight(0xffddaa, 1.5, 25);
        light.position.set(0, 8, 12);
        this.add(light);

        this.position.set(x, 0, z);
    }
}
