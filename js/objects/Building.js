/**
 * Building Class
 * 
 * Represents a procedurally generated building in the city.
 * Features:
 * - Varied Styles: "Box" (Simple) or "Tiered" (Skyscraper-like).
 * - Procedural Textures: Generates windows and patterns via Canvas API.
 * - Dynamic Roof Details: Antennas, AC units, etc.
 * - Material Caching: Optimizes performance by reusing materials for similar buildings.
 */

import * as THREE from 'three';

// Material cache to prevent out-of-memory and ensure consistent styles for same colors
const materialCache = {};

export class Building extends THREE.Group {
    /**
     * @param {number} x - World X position
     * @param {number} z - World Z position
     * @param {number} width - Building physical width
     * @param {number} height - Building physical height
     * @param {number} depth - Building physical depth
     * @param {number|string} color - Base color of the facade
     */
    constructor(x, z, width, height, depth, color = 0xd5bda3) {
        super();

        const styleVal = Math.random();
        // 40% chance to be "tiered" (fancy shape) if tall enough
        const isTiered = height > 50 && Math.random() > 0.4;

        if (isTiered) {
            this.createTieredBuilding(width, height, depth, color, styleVal);
        } else {
            this.createBoxBuilding(width, height, depth, color, styleVal);
        }

        this.position.set(x, 0, z);

        // Add Roof detail (Antennas, boxes) for realism
        if (Math.random() > 0.6) {
            this.addRoofDetail(height, width, depth);
        }
    }

    createBoxBuilding(w, h, d, color, styleVal) {
        const material = this.getMaterial(color, styleVal);
        const geometry = new THREE.BoxGeometry(w, h, d);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = h / 2;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.add(mesh);
    }

    createTieredBuilding(w, h, d, color, styleVal) {
        const h1 = h * (0.6 + Math.random() * 0.1);
        const mat1 = this.getMaterial(color, styleVal);
        const base = new THREE.Mesh(new THREE.BoxGeometry(w, h1, d), mat1);
        base.position.y = h1 / 2;
        base.castShadow = true;
        base.receiveShadow = true;
        this.add(base);

        const h2 = h - h1;
        const scale = 0.7;
        const mat2 = this.getMaterial(color, styleVal);

        const top = new THREE.Mesh(new THREE.BoxGeometry(w * scale, h2, d * scale), mat2);
        top.position.y = h1 + h2 / 2;
        top.castShadow = true;
        top.receiveShadow = true;
        this.add(top);
    }

    addRoofDetail(h, w, d) {
        const type = Math.floor(Math.random() * 3);
        const mat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.8 });

        if (type === 0) {
            const antH = 8 + Math.random() * 10;
            const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.5, antH), mat);
            ant.position.y = h + antH / 2;
            this.add(ant);
        } else if (type === 1) {
            const boxW = Math.min(w * 0.4, 8);
            const boxD = Math.min(d * 0.4, 8);
            const box = new THREE.Mesh(new THREE.BoxGeometry(boxW, 3, boxD), mat);
            box.position.y = h + 1.5;
            this.add(box);
        }
    }

    getMaterial(color, styleVal) {
        let styleType = 'standard';
        if (styleVal < 0.35) styleType = 'classic';
        else if (styleVal > 0.75) styleType = 'modern';

        const colorHex = typeof color === 'number' ? '#' + color.toString(16).padStart(6, '0') : color;
        const key = `${colorHex}_${styleType}`;

        if (materialCache[key]) return materialCache[key];

        const { map, emissiveMap } = createBuildingTexture(color, styleType);

        // OPTIMISASI: Gunakan MeshStandardMaterial yang terlihat "Standard" (Glossy/Metallic dikit)
        // Modern: Lebih mengkilap
        // Classic/Standard: Tidak terlalu matte, ada sedikit pantulan
        const material = new THREE.MeshStandardMaterial({
            map: map,
            emissive: 0xffffff,
            emissiveMap: emissiveMap,
            emissiveIntensity: styleType === 'modern' ? 0.6 : 1.0,
            roughness: styleType === 'modern' ? 0.4 : 0.6, // 0.6 = Agak halus (dulu 0.9 matte)
            metalness: styleType === 'modern' ? 0.3 : 0.1  // 0.1 = Ada spekular dikit (dulu 0.0)
        });

        materialCache[key] = material;
        return material;
    }
}

/**
 * Procedurally generate varied building textures
 */
function createBuildingTexture(baseColor, style) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const eCanvas = document.createElement('canvas');
    eCanvas.width = 256;
    eCanvas.height = 512;
    const eCtx = eCanvas.getContext('2d');
    eCtx.fillStyle = '#000000';
    eCtx.fillRect(0, 0, 256, 512);

    ctx.fillStyle = typeof baseColor === 'number' ? '#' + baseColor.toString(16) : baseColor;
    ctx.fillRect(0, 0, 256, 512);

    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    for (let i = 0; i < 80; i++) ctx.fillRect(Math.random() * 256, Math.random() * 512, Math.random() * 20, Math.random() * 20);

    if (style === 'modern') {
        const floors = 16;
        const h = 512 / floors;

        for (let i = 0; i < floors; i++) {
            if (i % 2 !== 0) continue;

            const y = i * h + 2;
            const bandHeight = h - 4;

            ctx.fillStyle = '#445566';
            ctx.fillRect(0, y, 256, bandHeight);

            const segments = 4 + Math.floor(Math.random() * 3);
            const segW = 256 / segments;

            for (let k = 0; k < segments; k++) {
                if (Math.random() < 0.4) {
                    const lightColor = Math.random() > 0.5 ? '#ccddff' : '#eeffff';
                    eCtx.fillStyle = lightColor;
                    eCtx.fillRect(k * segW + 2, y + 2, segW - 4, bandHeight - 4);
                }
            }
        }
    } else if (style === 'classic') {
        const cols = 3;
        const rows = 6;
        const padX = 25;
        const padY = 40;
        const w = (256 - (cols + 1) * padX) / cols;
        const h = (512 - (rows + 1) * padY) / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = padX + c * (w + padX);
                const y = padY + r * (h + padY);

                ctx.fillStyle = '#333333';
                ctx.fillRect(x - 4, y - 4, w + 8, h + 8);

                ctx.fillStyle = '#223344';
                ctx.fillRect(x, y, w, h);

                if (Math.random() < 0.35) {
                    eCtx.fillStyle = '#ffffcc';
                    eCtx.fillRect(x, y, w, h);
                }
            }
        }
    } else {
        const cols = 5;
        const rows = 12;
        const padX = 15;
        const padY = 15;
        const w = (256 - (cols + 1) * padX) / cols;
        const h = (512 - (rows + 1) * padY) / rows;

        for (let r = 0; r < rows; r++) {
            if (r === 0 || r === rows - 1) continue;

            for (let c = 0; c < cols; c++) {
                if (Math.random() > 0.9) continue;

                const x = padX + c * (w + padX);
                const y = padY + r * (h + padY);

                ctx.fillStyle = '#112233';
                ctx.fillRect(x, y, w, h);

                if (Math.random() < 0.2) {
                    eCtx.fillStyle = '#ffeecc';
                    eCtx.fillRect(x, y, w, h);
                }
            }
        }
    }

    const map = new THREE.CanvasTexture(canvas);
    const emissiveMap = new THREE.CanvasTexture(eCanvas);

    map.colorSpace = THREE.SRGBColorSpace;
    emissiveMap.colorSpace = THREE.SRGBColorSpace;

    return { map, emissiveMap };
}
