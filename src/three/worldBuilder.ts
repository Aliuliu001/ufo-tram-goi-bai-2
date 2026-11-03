/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { ProceduralTextureGenerator } from './proceduralTextures';

export interface WorldObjects {
  scene: THREE.Scene;
  waterMesh: THREE.Mesh;
  clouds: THREE.Group;
  crystals: THREE.Group[];
  lanterns: THREE.Group[];
  jumpFences: THREE.Group[];
  hidingSpots: THREE.Vector3[];
  letterProps: THREE.Group[];
}

export class WorldBuilder {
  private scene: THREE.Scene;
  private roofTexture: THREE.CanvasTexture;
  private woodTexture: THREE.CanvasTexture;
  private stoneTexture: THREE.CanvasTexture;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.roofTexture = ProceduralTextureGenerator.createRoofTileTexture();
    this.woodTexture = ProceduralTextureGenerator.createWoodPlankTexture();
    this.stoneTexture = ProceduralTextureGenerator.createCobblestoneTexture();
  }

  public build(): WorldObjects {
    this.buildTerrain();
    this.buildSchoolHouse();
    const waterMesh = this.buildLakeAndBridge();
    const { crystals, lanterns, hidingSpots } = this.buildCrystalCave();
    const jumpFences = this.buildFencesAndGardens();
    this.buildSurroundingForest();
    const clouds = this.buildSkyAndClouds();
    const letterProps = this.buildLearningClues();

    return {
      scene: this.scene,
      waterMesh,
      clouds,
      crystals,
      lanterns,
      jumpFences,
      hidingSpots,
      letterProps,
    };
  }

  // 1. Terrain, Rolling Green Hills & Paths
  private buildTerrain() {
    // Large ground plane (soft rolling green toy turf)
    const groundGeo = new THREE.PlaneGeometry(160, 160, 48, 48);
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      // Create gentle natural rolling mounds around perimeter, keep center play yard flat
      const distFromCenter = Math.sqrt(vx * vx + vy * vy);
      let height = 0;
      if (distFromCenter > 30) {
        height = Math.sin(vx * 0.08) * Math.cos(vy * 0.08) * 3.5 + (distFromCenter - 30) * 0.12;
      }
      pos.setZ(i, height);
    }
    groundGeo.computeVertexNormals();

    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      roughness: 0.85,
      metalness: 0.05,
      flatShading: true,
    });

    const ground = new THREE.Mesh(groundGeo, grassMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Winding Cobblestone Village Paths (Central Hub -> School, Lake, Cave)
    this.buildCurvedPath(
      [new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(12, 0.02, -12), new THREE.Vector3(20, 0.02, -18)],
      3.2
    );
    this.buildCurvedPath(
      [new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(14, 0.02, 10), new THREE.Vector3(22, 0.02, 18)],
      2.8
    );
    this.buildCurvedPath(
      [new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(-12, 0.02, -8), new THREE.Vector3(-22, 0.02, -14)],
      3.0
    );
  }

  private buildCurvedPath(points: THREE.Vector3[], width: number) {
    const curve = new THREE.CatmullRomCurve3(points);
    const curvePoints = curve.getPoints(24);

    const pathGeo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i < curvePoints.length; i++) {
      const pt = curvePoints[i];
      const tangent = curve.getTangent(i / (curvePoints.length - 1)).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const left = pt.clone().add(normal.clone().multiplyScalar(width / 2));
      const right = pt.clone().sub(normal.clone().multiplyScalar(width / 2));

      vertices.push(left.x, left.y, left.z);
      vertices.push(right.x, right.y, right.z);

      const v = i / (curvePoints.length - 1) * 6;
      uvs.push(0, v, 1, v);

      if (i < curvePoints.length - 1) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
      }
    }

    pathGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    pathGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    pathGeo.setIndex(indices);
    pathGeo.computeVertexNormals();

    const pathMat = new THREE.MeshStandardMaterial({
      map: this.stoneTexture,
      roughness: 0.9,
      metalness: 0.1,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.receiveShadow = true;
    this.scene.add(pathMesh);
  }

  // 2. School House (North-East: Orange roof, Bell Tower, Porch, Clock)
  private buildSchoolHouse() {
    const schoolGroup = new THREE.Group();
    schoolGroup.position.set(22, 0, -20);
    schoolGroup.rotation.y = -Math.PI / 4;

    // (1) Stone Foundation
    const foundationGeo = new THREE.BoxGeometry(14, 0.8, 11);
    const foundationMat = new THREE.MeshStandardMaterial({
      map: this.stoneTexture,
      roughness: 0.8,
    });
    const foundation = new THREE.Mesh(foundationGeo, foundationMat);
    foundation.position.y = 0.4;
    foundation.castShadow = true;
    foundation.receiveShadow = true;
    schoolGroup.add(foundation);

    // (2) White Timber Clapboard Walls
    const wallGeo = new THREE.BoxGeometry(13.2, 5.2, 10.2);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.6,
      metalness: 0.05,
    });
    const walls = new THREE.Mesh(wallGeo, wallMat);
    walls.position.y = 3.4;
    walls.castShadow = true;
    walls.receiveShadow = true;
    schoolGroup.add(walls);

    // (3) Warm Orange Scalloped Gable Roof
    const roofGeo = new THREE.ConeGeometry(9.6, 4.2, 4);
    const roofMat = new THREE.MeshStandardMaterial({
      map: this.roofTexture,
      roughness: 0.5,
      metalness: 0.1,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 8.1;
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.15, 1, 0.9);
    roof.castShadow = true;
    schoolGroup.add(roof);

    // (4) Bell Tower Base & Cupola
    const towerBaseGeo = new THREE.BoxGeometry(2.8, 3.4, 2.8);
    const towerBase = new THREE.Mesh(towerBaseGeo, wallMat);
    towerBase.position.y = 10.8;
    towerBase.castShadow = true;
    schoolGroup.add(towerBase);

    // Bell Spire Roof (Cupola)
    const spireGeo = new THREE.ConeGeometry(2.1, 2.8, 4);
    const spireMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Bright blue spire cap
      roughness: 0.4,
      metalness: 0.3,
    });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.y = 13.9;
    spire.rotation.y = Math.PI / 4;
    spire.castShadow = true;
    schoolGroup.add(spire);

    // Golden School Bell inside tower
    const bellGeo = new THREE.CylinderGeometry(0.3, 0.7, 0.9, 12);
    const bellMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.2,
    });
    const bell = new THREE.Mesh(bellGeo, bellMat);
    bell.position.set(0, 10.8, 0);
    schoolGroup.add(bell);

    // (5) School Clock on Front Wall
    const clockFaceGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 24);
    const clockFaceMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
    });
    const clockFace = new THREE.Mesh(clockFaceGeo, clockFaceMat);
    clockFace.rotation.x = Math.PI / 2;
    clockFace.position.set(0, 5.2, 5.2);
    schoolGroup.add(clockFace);

    // Clock Rim
    const clockRimGeo = new THREE.TorusGeometry(0.82, 0.08, 8, 24);
    const clockRimMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.7,
      roughness: 0.3,
    });
    const clockRim = new THREE.Mesh(clockRimGeo, clockRimMat);
    clockRim.position.set(0, 5.2, 5.22);
    schoolGroup.add(clockRim);

    // (6) Wooden Front Porch with Steps & Timber Columns
    const porchDeckGeo = new THREE.BoxGeometry(6, 0.4, 3.5);
    const porchDeckMat = new THREE.MeshStandardMaterial({
      map: this.woodTexture,
      roughness: 0.7,
    });
    const porchDeck = new THREE.Mesh(porchDeckGeo, porchDeckMat);
    porchDeck.position.set(0, 0.6, 6.8);
    porchDeck.receiveShadow = true;
    schoolGroup.add(porchDeck);

    // Porch Roof Awning
    const porchRoofGeo = new THREE.BoxGeometry(6.4, 0.3, 3.8);
    const porchRoof = new THREE.Mesh(porchRoofGeo, roofMat);
    porchRoof.position.set(0, 3.5, 6.8);
    porchRoof.rotation.x = 0.1;
    porchRoof.castShadow = true;
    schoolGroup.add(porchRoof);

    // 4 Porch Timber Columns
    const columnGeo = new THREE.CylinderGeometry(0.14, 0.14, 2.9, 8);
    const columnMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const colPositions = [
      [-2.7, 2.0, 8.2],
      [2.7, 2.0, 8.2],
      [-2.7, 2.0, 5.4],
      [2.7, 2.0, 5.4],
    ];
    colPositions.forEach(([cx, cy, cz]) => {
      const col = new THREE.Mesh(columnGeo, columnMat);
      col.position.set(cx, cy, cz);
      col.castShadow = true;
      schoolGroup.add(col);
    });

    // Double Wooden Doors
    const doorGeo = new THREE.BoxGeometry(1.8, 2.8, 0.15);
    const doorMat = new THREE.MeshStandardMaterial({
      map: this.woodTexture,
      roughness: 0.6,
    });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 2.2, 5.15);
    schoolGroup.add(door);

    // 4 Warm Lit Classroom Windows
    const windowGeo = new THREE.BoxGeometry(1.4, 1.8, 0.1);
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.4,
      roughness: 0.2,
    });
    [
      [-3.8, 3.2, 5.15],
      [3.8, 3.2, 5.15],
      [-6.65, 3.2, 0],
      [6.65, 3.2, 0],
    ].forEach(([wx, wy, wz], idx) => {
      const win = new THREE.Mesh(windowGeo, windowMat);
      win.position.set(wx, wy, wz);
      if (idx >= 2) win.rotation.y = Math.PI / 2;
      schoolGroup.add(win);
    });

    this.scene.add(schoolGroup);
  }

  // 3. Turquoise Lake, Water Ripples, Footbridge & Stepping Stones
  private buildLakeAndBridge(): THREE.Mesh {
    const lakeGroup = new THREE.Group();
    lakeGroup.position.set(20, 0, 18);

    // Turquoise Water Basin Geometry (Smooth organic basin)
    const waterGeo = new THREE.CylinderGeometry(13, 11, 0.4, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = 0.05;
    waterMesh.receiveShadow = true;
    lakeGroup.add(waterMesh);

    // Sandy/Stone Shore Rim
    const shoreGeo = new THREE.TorusGeometry(12.8, 0.9, 8, 32);
    const shoreMat = new THREE.MeshStandardMaterial({
      color: 0xd6d3d1,
      roughness: 0.9,
    });
    const shore = new THREE.Mesh(shoreGeo, shoreMat);
    shore.rotation.x = Math.PI / 2;
    shore.position.y = 0.1;
    shore.scale.set(1.05, 0.85, 1);
    lakeGroup.add(shore);

    // Arched Wooden Footbridge across lake
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(0, 0.2, 0);

    // Curved Bridge Deck
    const bridgeDeckGeo = new THREE.BoxGeometry(3.6, 0.25, 14);
    const bridgeDeckMat = new THREE.MeshStandardMaterial({
      map: this.woodTexture,
      roughness: 0.65,
    });
    const bridgeDeck = new THREE.Mesh(bridgeDeckGeo, bridgeDeckMat);
    bridgeDeck.position.y = 0.8;
    bridgeDeck.castShadow = true;
    bridgeDeck.receiveShadow = true;
    bridgeGroup.add(bridgeDeck);

    // Bridge Side Railings & Posts
    const railGeo = new THREE.CylinderGeometry(0.08, 0.08, 14, 8);
    const railMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    [-1.7, 1.7].forEach((rx) => {
      const topRail = new THREE.Mesh(railGeo, railMat);
      topRail.rotation.x = Math.PI / 2;
      topRail.position.set(rx, 1.7, 0);
      topRail.castShadow = true;
      bridgeGroup.add(topRail);

      // Support Posts along rail
      for (let z = -6; z <= 6; z += 3) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.1, 8), railMat);
        post.position.set(rx, 1.25, z);
        post.castShadow = true;
        bridgeGroup.add(post);
      }
    });

    lakeGroup.add(bridgeGroup);

    // Floating Lily Pads (Composite: circular leaf + pink flower)
    const lilyPadGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.04, 12);
    const lilyPadMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
    const flowerMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.5 });

    [
      [-5, 0.26, -4],
      [-7, 0.26, 3],
      [6, 0.26, -5],
      [7, 0.26, 4],
    ].forEach(([lx, ly, lz]) => {
      const pad = new THREE.Mesh(lilyPadGeo, lilyPadMat);
      pad.position.set(lx, ly, lz);
      lakeGroup.add(pad);

      const flower = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.25, 6), flowerMat);
      flower.position.set(lx + 0.1, ly + 0.14, lz);
      lakeGroup.add(flower);
    });

    // Shore Reeds & Cattails
    const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 6);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.8 });
    const cattailGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.5, 8);
    const cattailMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });

    [
      [-10, 0.8, -6],
      [-10.8, 0.8, -4.5],
      [9.5, 0.8, 7.5],
      [11, 0.8, 6],
    ].forEach(([cx, cy, cz]) => {
      const reed = new THREE.Mesh(stemGeo, stemMat);
      reed.position.set(cx, cy, cz);
      lakeGroup.add(reed);

      const top = new THREE.Mesh(cattailGeo, cattailMat);
      top.position.set(cx, cy + 0.5, cz);
      lakeGroup.add(top);
    });

    this.scene.add(lakeGroup);
    return waterMesh;
  }

  // 4. Mysterious & Joyful Crystal Cave (North-West: Glowing Crystals, Lanterns, Boulders)
  private buildCrystalCave(): { crystals: THREE.Group[]; lanterns: THREE.Group[]; hidingSpots: THREE.Vector3[] } {
    const caveGroup = new THREE.Group();
    caveGroup.position.set(-22, 0, -18);
    caveGroup.rotation.y = Math.PI / 6;

    const crystals: THREE.Group[] = [];
    const lanterns: THREE.Group[] = [];
    const hidingSpots: THREE.Vector3[] = [];

    // Cave Rock Archway & Mound
    const caveRockMat = new THREE.MeshStandardMaterial({
      color: 0x57534e,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true,
    });

    // Outer Mountain Shell
    const shellGeo = new THREE.DodecahedronGeometry(9, 1);
    const shell = new THREE.Mesh(shellGeo, caveRockMat);
    shell.position.set(0, 4.5, -4);
    shell.scale.set(1.4, 1, 1.2);
    shell.castShadow = true;
    shell.receiveShadow = true;
    caveGroup.add(shell);

    // Cave Archway Entrance Tunnel
    const archGeo = new THREE.TorusGeometry(3.8, 1.6, 6, 12, Math.PI);
    const arch = new THREE.Mesh(archGeo, caveRockMat);
    arch.position.set(0, 0, 1.5);
    arch.castShadow = true;
    caveGroup.add(arch);

    // Glowing Crystal Clusters (Purple & Cyan faceted crystals)
    const crystalColors = [0xc084fc, 0x818cf8, 0x38bdf8, 0xa855f7];
    const crystalClusterPositions = [
      [-2.8, 0.2, 1.8],
      [2.9, 0.2, 1.6],
      [-4.5, 0.2, 0.5],
      [4.2, 0.2, -1.2],
      [-1.2, 0.2, -3.5],
    ];

    crystalClusterPositions.forEach(([cx, cy, cz], idx) => {
      const cluster = new THREE.Group();
      cluster.position.set(cx, cy, cz);

      const color = crystalColors[idx % crystalColors.length];
      const crystalMat = new THREE.MeshPhysicalMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.7,
        roughness: 0.15,
        metalness: 0.2,
        clearcoat: 1.0,
      });

      // 3-5 faceted crystal shards per cluster
      for (let s = 0; s < 4; s++) {
        const height = 1.2 + Math.random() * 1.4;
        const shardGeo = new THREE.ConeGeometry(0.35, height, 5);
        const shard = new THREE.Mesh(shardGeo, crystalMat);
        shard.position.set((s - 1.5) * 0.35, height / 2, (Math.random() - 0.5) * 0.4);
        shard.rotation.z = (Math.random() - 0.5) * 0.35;
        shard.rotation.x = (Math.random() - 0.5) * 0.35;
        cluster.add(shard);
      }

      // Soft local crystal point light
      const light = new THREE.PointLight(color, 2.5, 6, 2);
      light.position.y = 1.2;
      cluster.add(light);

      caveGroup.add(cluster);
      crystals.push(cluster);
    });

    // Hanging Lanterns on wooden posts leading to cave
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfbbf24,
      emissiveIntensity: 1.2,
      roughness: 0.2,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      metalness: 0.8,
      roughness: 0.3,
    });

    [
      [-3.8, 0, 4.5],
      [3.8, 0, 4.8],
      [0, 0, 6.5],
    ].forEach(([lx, ly, lz]) => {
      const lanternGroup = new THREE.Group();
      lanternGroup.position.set(lx, ly, lz);

      // Wooden post
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.2, 8), this.scene.getObjectByName('woodMat') as any || new THREE.MeshStandardMaterial({ color: 0x78350f }));
      post.position.y = 1.6;
      post.castShadow = true;
      lanternGroup.add(post);

      // Curved hanger arm
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.8), brassMat);
      arm.position.set(0, 3.1, 0.35);
      lanternGroup.add(arm);

      // Glass lantern body
      const lantern = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35), lanternMat);
      lantern.position.set(0, 2.7, 0.7);
      lanternGroup.add(lantern);

      // Lantern light
      const pLight = new THREE.PointLight(0xfef08a, 2.0, 7, 2);
      pLight.position.set(0, 2.7, 0.7);
      lanternGroup.add(pLight);

      caveGroup.add(lanternGroup);
      lanterns.push(lanternGroup);
    });

    // Hiding Boulders near cave entrance (Where students crouch)
    const boulderPositions = [
      new THREE.Vector3(-6, 0.8, 3.2),
      new THREE.Vector3(5.5, 0.8, 2.8),
      new THREE.Vector3(-2.5, 0.7, 5.0),
    ];
    boulderPositions.forEach((bPos) => {
      const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4, 1), caveRockMat);
      boulder.position.copy(bPos);
      boulder.scale.set(1.2, 0.9, 1.1);
      boulder.castShadow = true;
      boulder.receiveShadow = true;
      caveGroup.add(boulder);

      // Register hiding spot in world coordinates
      const worldPos = bPos.clone().applyMatrix4(caveGroup.matrixWorld);
      hidingSpots.push(worldPos);
    });

    this.scene.add(caveGroup);
    return { crystals, lanterns, hidingSpots };
  }

  // 5. Wooden Fences, Gardens & Jump Area
  private buildFencesAndGardens(): THREE.Group[] {
    const jumpFences: THREE.Group[] = [];

    const fenceMat = new THREE.MeshStandardMaterial({
      map: this.woodTexture,
      roughness: 0.7,
      metalness: 0.1,
    });

    // Main guiding split-rail fences around village perimeter
    const fenceSegments = [
      { start: [-10, 0, 12], end: [-4, 0, 12], isJumpable: false },
      { start: [-4, 0, 12], end: [2, 0, 12], isJumpable: true }, // Low jump fence!
      { start: [2, 0, 12], end: [8, 0, 12], isJumpable: false },
      { start: [-14, 0, -5], end: [-14, 0, 3], isJumpable: true }, // Cave-side jump fence!
      { start: [8, 0, -8], end: [8, 0, 2], isJumpable: false },
    ];

    fenceSegments.forEach(({ start, end, isJumpable }) => {
      const fence = new THREE.Group();
      const p1 = new THREE.Vector3(start[0], start[1], start[2]);
      const p2 = new THREE.Vector3(end[0], end[1], end[2]);
      const len = p1.distanceTo(p2);
      const mid = p1.clone().add(p2).multiplyScalar(0.5);

      fence.position.copy(mid);
      fence.lookAt(p2);

      const railHeight = isJumpable ? 0.75 : 1.35; // Jumpable fences are lower!
      const postCount = 3;

      // Posts
      for (let i = 0; i < postCount; i++) {
        const offset = (i / (postCount - 1) - 0.5) * len;
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, railHeight + 0.2, 8), fenceMat);
        post.position.set(0, (railHeight + 0.2) / 2, offset);
        post.castShadow = true;
        fence.add(post);
      }

      // Horizontal Rails
      const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, len), fenceMat);
      rail1.position.set(0, railHeight * 0.75, 0);
      rail1.castShadow = true;
      fence.add(rail1);

      if (!isJumpable) {
        const rail2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, len), fenceMat);
        rail2.position.set(0, railHeight * 0.35, 0);
        rail2.castShadow = true;
        fence.add(rail2);
      } else {
        // Visual indicator that this fence is jumpable (cheerful painted yellow/white chevron)
        const markerGeo = new THREE.ConeGeometry(0.2, 0.4, 4);
        const markerMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.3 });
        const arrow = new THREE.Mesh(markerGeo, markerMat);
        arrow.position.set(0, railHeight + 0.35, 0);
        fence.add(arrow);
        jumpFences.push(fence);
      }

      this.scene.add(fence);
    });

    // Flower Garden Bed & Pumpkins
    this.buildGardenProps();

    return jumpFences;
  }

  private buildGardenProps() {
    const garden = new THREE.Group();
    garden.position.set(-6, 0, 4);

    // Garden Soil Bed
    const soilGeo = new THREE.BoxGeometry(7, 0.15, 4.5);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x573a21, roughness: 0.95 });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.y = 0.08;
    soil.receiveShadow = true;
    garden.add(soil);

    // Pumpkins (Multi-part: orange bulb with vertical ridges + green curved stem)
    const pumpkinMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 });
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });

    [
      [-2, 0.35, -1],
      [-1, 0.45, 1],
      [1.5, 0.4, -0.8],
      [2.2, 0.35, 0.8],
    ].forEach(([px, py, pz], idx) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(px, py, pz);
      const scale = 0.8 + (idx % 3) * 0.2;

      // Ribbed pumpkin body
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.55 * scale, 12, 10), pumpkinMat);
      body.scale.set(1.2, 0.85, 1.2);
      body.castShadow = true;
      pGroup.add(body);

      // Green stem
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.3 * scale, 6), stemMat);
      stem.position.y = 0.45 * scale;
      stem.rotation.z = 0.25;
      pGroup.add(stem);

      garden.add(pGroup);
    });

    // Spotted Red & White Mushrooms (Toadstools)
    const capMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
    const stipeMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 });

    [
      [-2.8, 0.2, 1.4],
      [-2.4, 0.15, 1.7],
      [2.6, 0.22, -1.3],
    ].forEach(([mx, my, mz]) => {
      const mGroup = new THREE.Group();
      mGroup.position.set(mx, my, mz);

      const stipe = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.4, 8), stipeMat);
      stipe.position.y = 0.2;
      mGroup.add(stipe);

      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
      cap.position.y = 0.38;
      mGroup.add(cap);

      garden.add(mGroup);
    });

    // Colorful Flower clusters
    const flowerColors = [0xf43f5e, 0x38bdf8, 0xfacc15, 0xa855f7];
    for (let f = 0; f < 12; f++) {
      const fx = (Math.random() - 0.5) * 5.5;
      const fz = (Math.random() - 0.5) * 3.5;
      const fMat = new THREE.MeshStandardMaterial({
        color: flowerColors[f % flowerColors.length],
        roughness: 0.5,
      });
      const petal = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18), fMat);
      petal.position.set(fx, 0.35, fz);
      garden.add(petal);
    }

    // Garden Bench
    const benchGroup = new THREE.Group();
    benchGroup.position.set(0, 0, 2.8);
    const benchSeat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 0.7), this.woodTexture ? new THREE.MeshStandardMaterial({ map: this.woodTexture }) : capMat);
    benchSeat.position.y = 0.65;
    benchSeat.castShadow = true;
    benchGroup.add(benchSeat);

    [-0.9, 0.9].forEach((bx) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.65, 8), stemMat);
      leg.position.set(bx, 0.325, 0);
      benchGroup.add(leg);
    });
    garden.add(benchGroup);

    this.scene.add(garden);
  }

  // 6. Surrounding Forest: Multi-Tiered Stylized Trees & Rolling Hills
  private buildSurroundingForest() {
    const treeGroup = new THREE.Group();

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    const foliageMat1 = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.7, flatShading: true });
    const foliageMat2 = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7, flatShading: true });
    const foliageMat3 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7, flatShading: true });

    // Trees arranged naturally around the playable village perimeter (radius ~30-45)
    const treeCount = 36;
    for (let i = 0; i < treeCount; i++) {
      const angle = (i / treeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
      const dist = 32 + Math.random() * 22;
      const tx = Math.cos(angle) * dist;
      const tz = Math.sin(angle) * dist;

      const singleTree = new THREE.Group();
      singleTree.position.set(tx, 0, tz);
      const scale = 0.85 + Math.random() * 0.5;
      singleTree.scale.set(scale, scale, scale);

      // (1) Tapered Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 2.8, 8), trunkMat);
      trunk.position.y = 1.4;
      trunk.castShadow = true;
      singleTree.add(trunk);

      // (2) Multi-tiered stylized foliage cones (3 distinct overlapping tiers)
      const tiers = [
        { r: 2.5, h: 2.6, y: 3.2, mat: foliageMat3 },
        { r: 2.0, h: 2.2, y: 4.8, mat: foliageMat2 },
        { r: 1.4, h: 1.8, y: 6.2, mat: foliageMat1 },
      ];

      tiers.forEach(({ r, h, y, mat }) => {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), mat);
        cone.position.y = y;
        cone.castShadow = true;
        singleTree.add(cone);
      });

      treeGroup.add(singleTree);
    }

    this.scene.add(treeGroup);
  }

  // 7. Fluffy Stylized Clouds in Bright Sky
  private buildSkyAndClouds(): THREE.Group {
    const cloudsGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.05,
    });

    const cloudClusterCoords = [
      [-35, 24, -30],
      [30, 26, -35],
      [38, 22, 25],
      [-32, 25, 30],
      [5, 28, -45],
    ];

    cloudClusterCoords.forEach(([cx, cy, cz]) => {
      const c = new THREE.Group();
      c.position.set(cx, cy, cz);

      // 4-6 overlapping puff spheres
      for (let p = 0; p < 5; p++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(2.4 + Math.random() * 1.2, 12, 10),
          cloudMat
        );
        puff.position.set(
          (p - 2) * 2.2,
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 1.5
        );
        c.add(puff);
      }
      cloudsGroup.add(c);
    });

    this.scene.add(cloudsGroup);
    return cloudsGroup;
  }

  // 8. Visual Learning Props: Floating Alphabet Gems & Open Storybooks
  private buildLearningClues(): THREE.Group[] {
    const letterProps: THREE.Group[] = [];

    const letters = [
      { char: 'A', icon: '🍎', pos: [6, 1.4, -4], color: 0xef4444 },
      { char: 'B', icon: '📖', pos: [14, 1.4, -14], color: 0x3b82f6 },
      { char: 'C', icon: '🐱', pos: [-8, 1.4, -6], color: 0xf59e0b },
      { char: 'F', icon: '🐸', pos: [15, 1.4, 12], color: 0x10b981 },
      { char: 'S', icon: '⭐', pos: [-16, 1.4, -10], color: 0x8b5cf6 },
    ];

    letters.forEach(({ char, icon, pos, color }) => {
      const propGroup = new THREE.Group();
      propGroup.position.set(pos[0], pos[1], pos[2]);

      // Glowing letter card
      const texture = ProceduralTextureGenerator.createLetterCardTexture(char, icon);
      const cardGeo = new THREE.BoxGeometry(1.2, 1.2, 0.12);
      const cardMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.3,
        emissive: color,
        emissiveIntensity: 0.25,
      });
      const cardMesh = new THREE.Mesh(cardGeo, cardMat);
      propGroup.add(cardMesh);

      // Gold floating pedestal base
      const pedGeo = new THREE.CylinderGeometry(0.4, 0.5, 0.15, 12);
      const pedMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.7, roughness: 0.3 });
      const ped = new THREE.Mesh(pedGeo, pedMat);
      ped.position.y = -0.7;
      propGroup.add(ped);

      // Gentle point light
      const pLight = new THREE.PointLight(color, 1.5, 4);
      pLight.position.y = 0.5;
      propGroup.add(pLight);

      this.scene.add(propGroup);
      letterProps.push(propGroup);
    });

    return letterProps;
  }
}
