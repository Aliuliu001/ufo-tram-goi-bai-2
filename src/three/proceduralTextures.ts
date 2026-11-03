/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

// Procedural Canvas Textures for crisp, zero-404 PBR materials
export class ProceduralTextureGenerator {
  // Orange terracotta scalloped roof tiles
  public static createRoofTileTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base warm orange
    ctx.fillStyle = '#EA580C';
    ctx.fillRect(0, 0, 512, 512);

    // Rows of scalloped terracotta tiles
    const rows = 16;
    const cols = 8;
    const tileW = 512 / cols;
    const tileH = 512 / rows;

    for (let r = 0; r < rows; r++) {
      const offsetX = (r % 2) * (tileW / 2);
      for (let c = -1; c <= cols; c++) {
        const x = c * tileW + offsetX;
        const y = r * tileH;

        // Tile body gradient
        const grad = ctx.createLinearGradient(x, y, x, y + tileH);
        grad.addColorStop(0, '#FB923C');
        grad.addColorStop(0.7, '#EA580C');
        grad.addColorStop(1, '#9A3412');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, tileW - 4, tileH - 2, [0, 0, 12, 12]);
        ctx.fill();

        // Subtle highlight
        ctx.strokeStyle = '#FDBA74';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Wooden plank texture for bridges, fences, and porch
  public static createWoodPlankTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base warm wood
    ctx.fillStyle = '#A16207';
    ctx.fillRect(0, 0, 512, 512);

    const plankCount = 8;
    const plankH = 512 / plankCount;

    for (let i = 0; i < plankCount; i++) {
      const y = i * plankH;
      // Slight tone shift per plank
      const hueShift = (i % 3 - 1) * 8;
      ctx.fillStyle = `rgb(${161 + hueShift}, ${98 + hueShift}, ${7 + hueShift})`;
      ctx.fillRect(0, y, 512, plankH - 3);

      // Wood grain lines
      ctx.strokeStyle = 'rgba(69, 26, 3, 0.25)';
      ctx.lineWidth = 1.5;
      for (let j = 0; j < 6; j++) {
        const lineY = y + (j + 1) * (plankH / 7) + (Math.sin(j * 2) * 2);
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.bezierCurveTo(150, lineY + 3, 350, lineY - 3, 512, lineY);
        ctx.stroke();
      }

      // Plank separator gap
      ctx.fillStyle = '#451A03';
      ctx.fillRect(0, y + plankH - 3, 512, 3);

      // Nail rivets
      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.arc(32, y + plankH / 2, 3, 0, Math.PI * 2);
      ctx.arc(480, y + plankH / 2, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Cobblestone / flagstone path texture
  public static createCobblestoneTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Earth mortar background
    ctx.fillStyle = '#78716C';
    ctx.fillRect(0, 0, 512, 512);

    const stones = [
      { x: 30, y: 30, w: 90, h: 60, r: 14 },
      { x: 135, y: 25, w: 120, h: 70, r: 18 },
      { x: 270, y: 35, w: 110, h: 65, r: 16 },
      { x: 395, y: 20, w: 95, h: 75, r: 20 },
      { x: 20, y: 110, w: 125, h: 75, r: 18 },
      { x: 160, y: 115, w: 95, h: 65, r: 14 },
      { x: 275, y: 120, w: 115, h: 80, r: 20 },
      { x: 405, y: 110, w: 85, h: 70, r: 16 },
      { x: 40, y: 205, w: 105, h: 70, r: 16 },
      { x: 160, y: 200, w: 130, h: 85, r: 22 },
      { x: 310, y: 220, w: 95, h: 60, r: 15 },
      { x: 420, y: 200, w: 75, h: 75, r: 18 },
      { x: 25, y: 300, w: 115, h: 80, r: 20 },
      { x: 155, y: 305, w: 90, h: 70, r: 15 },
      { x: 260, y: 310, w: 125, h: 75, r: 18 },
      { x: 400, y: 295, w: 95, h: 85, r: 20 },
      { x: 35, y: 400, w: 120, h: 80, r: 18 },
      { x: 175, y: 395, w: 105, h: 85, r: 18 },
      { x: 300, y: 405, w: 100, h: 75, r: 16 },
      { x: 415, y: 400, w: 80, h: 80, r: 16 },
    ];

    stones.forEach((s, idx) => {
      const grad = ctx.createRadialGradient(s.x + s.w / 3, s.y + s.h / 3, 5, s.x + s.w / 2, s.y + s.h / 2, s.w / 1.5);
      const tone = (idx % 4) * 8;
      grad.addColorStop(0, `rgb(${214 + tone}, ${211 + tone}, ${209 + tone})`);
      grad.addColorStop(1, `rgb(${168 + tone}, ${162 + tone}, ${158 + tone})`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(s.x, s.y, s.w, s.h, s.r);
      ctx.fill();

      ctx.strokeStyle = '#57534E';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Floating Alphabet / Reading Tile texture
  public static createLetterCardTexture(letter: string, icon: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Rounded glowing card
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(12, 12, 232, 232, 28);
    ctx.fill();

    // Colored rim
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Letter
    ctx.fillStyle = '#0284C7';
    ctx.font = 'bold 110px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, 128, 110);

    // Icon emoji
    ctx.font = '48px sans-serif';
    ctx.fillText(icon, 128, 195);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
}
