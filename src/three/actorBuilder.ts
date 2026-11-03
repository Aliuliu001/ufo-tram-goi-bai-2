/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { StudentData } from '../types/game';

export interface StudentActor {
  data: StudentData;
  group: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  torso: THREE.Mesh;
  head: THREE.Group;
  shadow: THREE.Mesh;
  animTime: number;
  jumpProgress: number; // 0 to 1
  isJumping: boolean;
  isCrouching: boolean;
  isBeamed: boolean;
  beamLiftY: number;
  targetPos: THREE.Vector3;
  velocity: THREE.Vector3;
}

export interface UfoActor {
  group: THREE.Group;
  hull: THREE.Mesh;
  ring: THREE.Group;
  dome: THREE.Mesh;
  spire: THREE.Mesh;
  alien: THREE.Group;
  beamCone: THREE.Mesh;
  groundReticle: THREE.Group;
  beacons: THREE.Mesh[];
  beamLight: THREE.SpotLight;
}

export class ActorBuilder {
  // Build UFO Boss (Composite 8-part model + Scanning/Tractor Beam)
  public static buildUfo(): UfoActor {
    const ufoGroup = new THREE.Group();
    ufoGroup.position.set(0, 16, 0);

    // 1. Saucer Hull (Extruded aerodynamic disc)
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Sleek brushed titanium
      metalness: 0.85,
      roughness: 0.25,
    });
    const hullGeo = new THREE.CylinderGeometry(5.2, 4.2, 1.2, 32);
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.castShadow = true;
    ufoGroup.add(hull);

    // Saucer lower rim
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.9,
      roughness: 0.2,
    });
    const rimGeo = new THREE.TorusGeometry(5.25, 0.35, 12, 32);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    ufoGroup.add(rim);

    // 2. Rotating Beacon Ring with 8 Colored Lights
    const ring = new THREE.Group();
    const beacons: THREE.Mesh[] = [];
    const beaconGeo = new THREE.SphereGeometry(0.32, 12, 8);
    const beaconColors = [0x38bdf8, 0xfacc15, 0xa855f7, 0x34d399, 0xf87171, 0x38bdf8, 0xfacc15, 0xa855f7];

    for (let b = 0; b < 8; b++) {
      const angle = (b / 8) * Math.PI * 2;
      const bColor = beaconColors[b];
      const bMat = new THREE.MeshStandardMaterial({
        color: bColor,
        emissive: bColor,
        emissiveIntensity: 1.5,
        roughness: 0.2,
      });
      const beacon = new THREE.Mesh(beaconGeo, bMat);
      beacon.position.set(Math.cos(angle) * 4.6, 0, Math.sin(angle) * 4.6);
      ring.add(beacon);
      beacons.push(beacon);
    }
    ufoGroup.add(ring);

    // 3. Transparent Cockpit Dome
    const domeGeo = new THREE.SphereGeometry(2.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.75,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.1,
      ior: 1.5,
      clearcoat: 1.0,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.6;
    ufoGroup.add(dome);

    // 4. Friendly Alien Pilot inside Dome
    const alien = new THREE.Group();
    alien.position.set(0, 0.8, 0);

    // Alien green head
    const alienHeadMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.4 });
    const alienHead = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 12), alienHeadMat);
    alienHead.scale.set(1.1, 1.25, 1.0);
    alien.add(alienHead);

    // Big friendly dark eyes
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), eyeMat);
    leftEye.position.set(-0.32, 0.12, 0.58);
    alien.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), eyeMat);
    rightEye.position.set(0.32, 0.12, 0.58);
    alien.add(rightEye);

    // Antenna with golden ball
    const antStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6), alienHeadMat);
    antStem.position.y = 0.95;
    alien.add(antStem);

    const antBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 1.2 })
    );
    antBall.position.y = 1.2;
    alien.add(antBall);

    ufoGroup.add(alien);

    // 5. Underside Nozzle Emitter
    const nozzleGeo = new THREE.CylinderGeometry(1.6, 2.2, 0.6, 24);
    const nozzleMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
      roughness: 0.3,
    });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.position.y = -0.7;
    ufoGroup.add(nozzle);

    // 6. Conical Tractor Beam (Cyan glowing scan cone)
    const coneGeo = new THREE.CylinderGeometry(1.4, 7.5, 18, 32, 1, true);
    const coneMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const beamCone = new THREE.Mesh(coneGeo, coneMat);
    beamCone.position.y = -9.2;
    beamCone.visible = true;
    ufoGroup.add(beamCone);

    // 7. Spot Light down the beam
    const beamLight = new THREE.SpotLight(0x00f0ff, 8, 35, Math.PI / 6, 0.4, 1.2);
    beamLight.position.set(0, -0.6, 0);
    beamLight.target.position.set(0, -18, 0);
    ufoGroup.add(beamLight);
    ufoGroup.add(beamLight.target);

    // 8. Ground Reticle (Target Ring on Terrain)
    const groundReticle = new THREE.Group();
    const reticleRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.18, 8, 32),
      new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
      })
    );
    reticleRing.rotation.x = Math.PI / 2;
    groundReticle.add(reticleRing);

    const reticleCenter = new THREE.Mesh(
      new THREE.CircleGeometry(2.4, 24),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.25,
      })
    );
    reticleCenter.rotation.x = -Math.PI / 2;
    groundReticle.add(reticleCenter);
    groundReticle.position.set(0, 0.05, 0);

    return {
      group: ufoGroup,
      hull,
      ring,
      dome,
      spire: antBall,
      alien,
      beamCone,
      groundReticle,
      beacons,
      beamLight,
    };
  }

  // Build a Stylized Student Character (Composite 8-part model)
  public static buildStudent(data: StudentData): StudentActor {
    const group = new THREE.Group();
    group.position.set(data.position[0], data.position[1], data.position[2]);
    group.rotation.y = data.rotation;

    // Materials
    const jacketMat = new THREE.MeshStandardMaterial({
      color: data.color,
      roughness: 0.7,
      metalness: 0.05,
    });
    const pantsMat = new THREE.MeshStandardMaterial({
      color: data.pantsColor,
      roughness: 0.8,
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffdbac, // Warm stylized skin
      roughness: 0.6,
    });
    const hatMat = new THREE.MeshStandardMaterial({
      color: data.hatColor,
      roughness: 0.8,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: data.hairColor,
      roughness: 0.9,
    });
    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
    });

    // 1. Torso / Jacket (Rounded box)
    const torsoGeo = new THREE.CapsuleGeometry(0.38, 0.45, 8, 8);
    const torso = new THREE.Mesh(torsoGeo, jacketMat);
    torso.position.y = 1.05;
    torso.castShadow = true;
    group.add(torso);

    // Zipper stripe accent
    const zipGeo = new THREE.BoxGeometry(0.06, 0.55, 0.08);
    const zipMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const zip = new THREE.Mesh(zipGeo, zipMat);
    zip.position.set(0, 1.05, 0.36);
    group.add(zip);

    // 2. Backpack on back
    const packGeo = new THREE.BoxGeometry(0.48, 0.55, 0.28);
    const packMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.7 });
    const pack = new THREE.Mesh(packGeo, packMat);
    pack.position.set(0, 1.1, -0.42);
    pack.castShadow = true;
    group.add(pack);

    // Book spine peeking out of backpack
    const bookGeo = new THREE.BoxGeometry(0.32, 0.18, 0.12);
    const bookMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
    const book = new THREE.Mesh(bookGeo, bookMat);
    book.position.set(0, 1.45, -0.42);
    group.add(book);

    // 3. Head & Hat
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.62, 0);

    const headGeo = new THREE.SphereGeometry(0.34, 16, 12);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Hair base
    const hairGeo = new THREE.SphereGeometry(0.36, 12, 10, 0, Math.PI * 2, 0, Math.PI / 1.7);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.04, -0.04);
    headGroup.add(hair);

    // Bobble Hat / Beanie
    const hatGeo = new THREE.ConeGeometry(0.38, 0.45, 12);
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.set(0, 0.22, -0.06);
    hat.rotation.x = -0.15;
    hat.castShadow = true;
    headGroup.add(hat);

    // Pom-pom on hat tip
    const pomGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const pom = new THREE.Mesh(pomGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
    pom.position.set(0, 0.48, -0.1);
    headGroup.add(pom);

    // Friendly Face: Eyes and Smile
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 });
    const lEye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), eyeMat);
    lEye.position.set(-0.11, 0.02, 0.31);
    headGroup.add(lEye);

    const rEye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), eyeMat);
    rEye.position.set(0.11, 0.02, 0.31);
    headGroup.add(rEye);

    // Rosy Blush Cheeks
    const blushMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.8 });
    const lBlush = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), blushMat);
    lBlush.position.set(-0.18, -0.06, 0.28);
    headGroup.add(lBlush);

    const rBlush = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), blushMat);
    rBlush.position.set(0.18, -0.06, 0.28);
    headGroup.add(rBlush);

    group.add(headGroup);

    // 4. Arms (Pivoting at shoulders)
    const armGeo = new THREE.CapsuleGeometry(0.1, 0.4, 6, 6);

    const leftArm = new THREE.Group();
    leftArm.position.set(-0.48, 1.25, 0);
    const lArmMesh = new THREE.Mesh(armGeo, jacketMat);
    lArmMesh.position.y = -0.2;
    lArmMesh.castShadow = true;
    leftArm.add(lArmMesh);
    // Hand mitten
    const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), skinMat);
    lHand.position.y = -0.42;
    leftArm.add(lHand);
    group.add(leftArm);

    const rightArm = new THREE.Group();
    rightArm.position.set(0.48, 1.25, 0);
    const rArmMesh = new THREE.Mesh(armGeo, jacketMat);
    rArmMesh.position.y = -0.2;
    rArmMesh.castShadow = true;
    rightArm.add(rArmMesh);
    const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), skinMat);
    rHand.position.y = -0.42;
    rightArm.add(rHand);
    group.add(rightArm);

    // 5. Legs (Pivoting at hips)
    const legGeo = new THREE.CapsuleGeometry(0.12, 0.42, 6, 6);

    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.2, 0.65, 0);
    const lLegMesh = new THREE.Mesh(legGeo, pantsMat);
    lLegMesh.position.y = -0.22;
    lLegMesh.castShadow = true;
    leftLeg.add(lLegMesh);
    // Sneaker
    const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.32), shoeMat);
    lShoe.position.set(0, -0.45, 0.06);
    lShoe.castShadow = true;
    leftLeg.add(lShoe);
    group.add(leftLeg);

    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.2, 0.65, 0);
    const rLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rLegMesh.position.y = -0.22;
    rLegMesh.castShadow = true;
    rightLeg.add(rLegMesh);
    // Sneaker
    const rShoe = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.32), shoeMat);
    rShoe.position.set(0, -0.45, 0.06);
    rShoe.castShadow = true;
    rightLeg.add(rShoe);
    group.add(rightLeg);

    // 6. Soft Radial Contact Shadow beneath feet flush on the ground
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const shadowGeo = new THREE.CircleGeometry(0.55, 16);
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    group.add(shadow);

    return {
      data,
      group,
      leftLeg,
      rightLeg,
      leftArm,
      rightArm,
      torso,
      head: headGroup,
      shadow,
      animTime: Math.random() * 10,
      jumpProgress: 0,
      isJumping: false,
      isCrouching: false,
      isBeamed: false,
      beamLiftY: 0,
      targetPos: new THREE.Vector3(data.position[0], data.position[1], data.position[2]),
      velocity: new THREE.Vector3(0, 0, 0),
    };
  }

  // Animation updates for students (Walk, Run, Jump, Crouch, Beam Float)
  public static updateStudentAnimation(actor: StudentActor, delta: number, isMoving: boolean) {
    actor.animTime += delta * 9;

    if (actor.isBeamed) {
      // Gentle levitation in cyan tractor beam!
      actor.beamLiftY = THREE.MathUtils.damp(actor.beamLiftY, 5.2, 2.5, delta);
      actor.group.position.y = actor.beamLiftY;
      // Happy spinning float
      actor.group.rotation.y += delta * 1.5;
      // Wiggle limbs excitedly
      actor.leftArm.rotation.z = Math.sin(actor.animTime * 0.8) * 0.8 - 0.9;
      actor.rightArm.rotation.z = -Math.sin(actor.animTime * 0.8) * 0.8 + 0.9;
      actor.leftLeg.rotation.x = Math.sin(actor.animTime * 0.6) * 0.4;
      actor.rightLeg.rotation.x = -Math.sin(actor.animTime * 0.6) * 0.4;
      actor.shadow.scale.setScalar(Math.max(0.2, 1.0 - actor.beamLiftY * 0.15));
      return;
    }

    if (actor.isJumping) {
      // High vault jump over low fence
      actor.jumpProgress += delta * 1.8;
      const arc = Math.sin(actor.jumpProgress * Math.PI);
      actor.group.position.y = arc * 1.8;

      // Arms up in triumph, legs tucked
      actor.leftArm.rotation.x = -2.2;
      actor.rightArm.rotation.x = -2.2;
      actor.leftLeg.rotation.x = -0.7;
      actor.rightLeg.rotation.x = -0.7;

      if (actor.jumpProgress >= 1) {
        actor.isJumping = false;
        actor.jumpProgress = 0;
        actor.group.position.y = 0;
      }
      return;
    }

    if (actor.isCrouching) {
      // Crouching low behind cave rocks / bushes
      actor.group.position.y = THREE.MathUtils.damp(actor.group.position.y, -0.3, 8, delta);
      actor.leftLeg.rotation.x = -1.2;
      actor.rightLeg.rotation.x = -1.2;
      actor.leftArm.rotation.x = 0.8;
      actor.rightArm.rotation.x = 0.8;
      actor.head.rotation.x = 0.3; // duck head down
      return;
    }

    // Normal ground state
    actor.group.position.y = 0;
    actor.head.rotation.x = 0;

    if (isMoving) {
      // Run cycle
      const swing = Math.sin(actor.animTime);
      actor.leftLeg.rotation.x = swing * 0.85;
      actor.rightLeg.rotation.x = -swing * 0.85;
      actor.leftArm.rotation.x = -swing * 0.85;
      actor.rightArm.rotation.x = swing * 0.85;
      // Torso bobbing
      actor.torso.position.y = 1.05 + Math.abs(Math.sin(actor.animTime * 2)) * 0.08;
    } else {
      // Idle breathing
      const breath = Math.sin(actor.animTime * 0.35);
      actor.leftLeg.rotation.x = THREE.MathUtils.damp(actor.leftLeg.rotation.x, 0, 6, delta);
      actor.rightLeg.rotation.x = THREE.MathUtils.damp(actor.rightLeg.rotation.x, 0, 6, delta);
      actor.leftArm.rotation.x = THREE.MathUtils.damp(actor.leftArm.rotation.x, 0, 6, delta);
      actor.rightArm.rotation.x = THREE.MathUtils.damp(actor.rightArm.rotation.x, 0, 6, delta);
      actor.torso.position.y = 1.05 + breath * 0.03;
      actor.leftArm.rotation.z = -0.15 + breath * 0.05;
      actor.rightArm.rotation.z = 0.15 - breath * 0.05;
    }
  }
}
