/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CameraMode, GameState, StudentData } from '../types/game';
import { ActorBuilder, StudentActor, UfoActor } from './actorBuilder';
import { WorldBuilder, WorldObjects } from './worldBuilder';

export interface GameEngineCallbacks {
  onStateChange: (state: GameState) => void;
  onStudentSelected: (student: StudentData) => void;
  onBeamedComplete: (student: StudentData) => void;
  onScanTick?: (secondsLeft: number) => void;
}

export class GameEngine {
  private container: HTMLElement;
  private callbacks: GameEngineCallbacks;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private clock = new THREE.Clock();
  private frameId: number = 0;
  private isDestroyed = false;
  private isSoftwareGl = false;

  // Actors and World
  private worldObjects!: WorldObjects;
  private ufo!: UfoActor;
  private students: StudentActor[] = [];
  private activeStudentIndex: number = 0;
  private playerManualControl: boolean = false;

  // Lighting & Theme
  private sunLight!: THREE.DirectionalLight;
  private hemiLight!: THREE.HemisphereLight;
  public currentTheme: 'light' | 'dark' = 'light';
  private targetBgColor = new THREE.Color(0xbbe1fa);
  private targetFogColor = new THREE.Color(0xbbe1fa);
  private targetSunColor = new THREE.Color(0xfffbeb);
  private targetHemiSky = new THREE.Color(0xbae6fd);
  private targetHemiGround = new THREE.Color(0x4ade80);
  private targetSunIntensity = 2.2;
  private targetHemiIntensity = 0.9;

  // Game Loop State
  public gameState: GameState = 'IDLE';
  public cameraMode: CameraMode = 'CHASE';
  private targetStudent: StudentActor | null = null;
  private chaseTimer: number = 0;
  private scanPhase: number = 0;
  private scanDurationMs = 6000;
  private scanDeadlineMs = 0;
  private scanTickId: number | null = null;
  private phaseFallbackId: number | null = null;

  private clearPhaseFallback() {
    if (this.phaseFallbackId !== null) {
      window.clearTimeout(this.phaseFallbackId);
      this.phaseFallbackId = null;
    }
    if (this.scanTickId !== null) {
      window.clearInterval(this.scanTickId);
      this.scanTickId = null;
    }
  }

  private moveToChasePhase() {
    if (this.gameState !== 'SCANNING') return;
    this.clearPhaseFallback();
    this.callbacks.onScanTick?.(0);
    this.gameState = 'CHASING';
    this.callbacks.onStateChange('CHASING');
    this.phaseFallbackId = window.setTimeout(() => this.moveToBeamPhase(), 6000);
  }

  private moveToBeamPhase() {
    if (this.gameState !== 'CHASING' || !this.targetStudent) return;
    this.gameState = 'BEAMING';
    this.callbacks.onStateChange('BEAMING');
    this.targetStudent.isBeamed = true;
    this.targetStudent.data.state = 'beamed';
    this.clearPhaseFallback();
    this.phaseFallbackId = window.setTimeout(() => {
      if (this.gameState !== 'BEAMING' || !this.targetStudent) return;
      this.gameState = 'QUIZ';
      this.callbacks.onStateChange('QUIZ');
      this.callbacks.onBeamedComplete(this.targetStudent.data);
    }, 2400);
  }

  // Keyboard input for manual control
  private keys: Record<string, boolean> = {};

  // Camera damping targets
  private camTargetPos = new THREE.Vector3(0, 18, 32);
  private camLookTarget = new THREE.Vector3(0, 3, 0);

  constructor(container: HTMLElement, studentList: StudentData[], callbacks: GameEngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    this.initRenderer();
    this.initScene();
    this.initActors(studentList);
    this.initInputListeners();
    this.startLoop();
  }

  private initRenderer() {
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.container.appendChild(this.renderer.domElement);
  }

  private initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xbbe1fa); // Crisp bright daytime sky
    this.scene.fog = new THREE.FogExp2(0xbbe1fa, 0.009);

    // Camera setup
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.5, 300);
    this.camera.position.set(0, 22, 38);

    // OrbitControls for manual inspection
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = !this.isSoftwareGl;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03; // Don't clip below ground
    this.controls.minDistance = 6;
    this.controls.maxDistance = 110;
    this.controls.target.set(0, 2, 0);

    // PBR Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Warm Sun Key Light
    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    this.sunLight.position.set(35, 45, 25);
    this.sunLight.castShadow = !this.isSoftwareGl;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 130;
    this.sunLight.shadow.camera.left = -40;
    this.sunLight.shadow.camera.right = 40;
    this.sunLight.shadow.camera.top = 40;
    this.sunLight.shadow.camera.bottom = -40;
    this.sunLight.shadow.bias = -0.0004;
    this.sunLight.shadow.normalBias = 0.02;
    this.scene.add(this.sunLight);

    // Cool Sky & Ground Hemisphere Fill Light
    this.hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x4ade80, 0.9);
    this.hemiLight.position.set(0, 50, 0);
    this.scene.add(this.hemiLight);

    // World Geometry Builder
    const builder = new WorldBuilder(this.scene);
    this.worldObjects = builder.build();

    // Resize listener
    window.addEventListener('resize', this.onResize);
  }

  private initActors(studentList: StudentData[]) {
    // 1. UFO Boss
    this.ufo = ActorBuilder.buildUfo();
    this.scene.add(this.ufo.group);
    this.scene.add(this.ufo.groundReticle);

    // Initial student spawn coordinates across village zones
    const spawnPoints: [number, number, number, number][] = [
      [2, 0, 4, 0],          // Maya: Near central path
      [-3, 0, 10, 0.3],      // Liam: Near low jump fence
      [14, 0, -12, -0.6],    // Sophie: Near School front porch
      [16, 0, 14, 1.2],      // Ethan: Near Turquoise lake bridge
      [-14, 0, -10, 2.1],    // Chloe: Walking towards crystal cave
      [-4, 0, -3, -1.8],     // Noah: Near pumpkin patch
    ];

    studentList.forEach((data, idx) => {
      const spawn = spawnPoints[idx % spawnPoints.length];
      const studentData: StudentData = {
        ...data,
        position: [spawn[0], spawn[1], spawn[2]],
        rotation: spawn[3],
        state: 'idle',
      };
      const actor = ActorBuilder.buildStudent(studentData);
      this.students.push(actor);
      this.scene.add(actor.group);
    });

    if (this.students.length > 0) {
      this.students[0].data.isPlayerControlled = true;
    }
  }

  private initInputListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space' && this.playerManualControl) {
        e.preventDefault();
        const activeActor = this.students[this.activeStudentIndex];
        if (activeActor && !activeActor.isJumping && !activeActor.isBeamed) {
          activeActor.isJumping = true;
          activeActor.jumpProgress = 0;
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  private onResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  // ----------------------------------------------------
  // PUBLIC CONTROLS & API
  // ----------------------------------------------------

  public startChase(customTargetStudentId?: string, scanSeconds = 6) {
    if (this.gameState === 'SCANNING' || this.gameState === 'CHASING' || this.gameState === 'BEAMING' || this.gameState === 'QUIZ' || this.students.length === 0) return;

    this.clearPhaseFallback();
    this.scanDurationMs = [3, 6, 8, 10].includes(scanSeconds) ? scanSeconds * 1000 : 6000;
    this.scanDeadlineMs = Date.now() + this.scanDurationMs;
    this.gameState = 'SCANNING';
    this.callbacks.onStateChange('SCANNING');
    this.chaseTimer = 0;
    this.scanPhase = 0;

    // The winner is chosen now but stays hidden until scanning has ended.
    if (customTargetStudentId) {
      this.targetStudent = this.students.find(s => s.data.id === customTargetStudentId) || this.students[0];
    } else {
      const randomIdx = Math.floor(Math.random() * this.students.length);
      this.targetStudent = this.students[randomIdx];
    }
    this.callbacks.onStudentSelected(this.targetStudent.data);

    const publishScanClock = () => {
      const secondsLeft = Math.max(0, Math.ceil((this.scanDeadlineMs - Date.now()) / 1000));
      this.callbacks.onScanTick?.(secondsLeft);
      if (secondsLeft === 0) this.moveToChasePhase();
    };
    publishScanClock();
    this.scanTickId = window.setInterval(publishScanClock, 125);
    this.phaseFallbackId = window.setTimeout(() => this.moveToChasePhase(), this.scanDurationMs + 50);
  }

  public completeQuizSuccess() {
    this.gameState = 'CELEBRATING';
    this.callbacks.onStateChange('CELEBRATING');

    if (this.targetStudent) {
      // Float down gently back to ground
      setTimeout(() => {
        if (this.targetStudent) {
          this.targetStudent.isBeamed = false;
          this.targetStudent.beamLiftY = 0;
          this.targetStudent.group.position.y = 0;
          this.targetStudent.data.state = 'idle';
        }
        this.gameState = 'IDLE';
        this.callbacks.onStateChange('IDLE');
        this.targetStudent = null;
      }, 2500);
    }
  }

  public setCameraMode(mode: CameraMode) {
    this.cameraMode = mode;
    this.controls.enabled = (mode === 'ORBIT');
  }

  public setTheme(theme: 'light' | 'dark') {
    this.currentTheme = theme;
    if (theme === 'dark') {
      // Default presentation: night blue, but with enough fill light to read
      // every student, path and hiding place from a classroom projector.
      this.targetBgColor.set(0x16223b);
      this.targetFogColor.set(0x1d2c49);
      this.targetSunColor.set(0xdbeafe);
      this.targetSunIntensity = 1.35;
      this.targetHemiSky.set(0x475569);
      this.targetHemiGround.set(0x14532d);
      this.targetHemiIntensity = 0.82;
    } else {
      // Soft daylight: deliberately muted so bright grass/sky do not wash out
      // the small running characters and cyan UFO beam.
      this.targetBgColor.set(0x9fb7c6);
      this.targetFogColor.set(0x9fb7c6);
      this.targetSunColor.set(0xffedd5);
      this.targetSunIntensity = 1.55;
      this.targetHemiSky.set(0xa7c0cd);
      this.targetHemiGround.set(0x2f6b4f);
      this.targetHemiIntensity = 0.72;
    }
  }

  public setPlayerManualControl(enabled: boolean) {
    this.playerManualControl = enabled;
  }

  public setActiveStudent(studentId: string) {
    const idx = this.students.findIndex(s => s.data.id === studentId);
    if (idx !== -1) {
      this.activeStudentIndex = idx;
      this.students.forEach((s, i) => {
        s.data.isPlayerControlled = (i === idx);
      });
    }
  }

  // ----------------------------------------------------
  // ANIMATION LOOP & KINEMATICS
  // ----------------------------------------------------

  private startLoop() {
    // Software WebGL is common on school laptops and automated browsers. A
    // regular timer is safer than waiting on a GPU fence, which can stay
    // unsignalled forever and leave the UFO stuck at “Scanning”.
    const afterDraw = (cb: () => void) => {
      this.frameId = window.setTimeout(cb, 33);
    };

    const tick = () => {
      if (this.isDestroyed) return;
      const delta = Math.min(this.clock.getDelta(), 0.1);

      this.updateUfo(delta);
      this.updateStudents(delta);
      this.updateCamera(delta);
      this.updateEnvironment(delta);

      if (this.cameraMode === 'ORBIT') {
        this.controls.update();
      }

      this.renderer.render(this.scene, this.camera);

      // A timer keeps the educational round moving even when a projector,
      // embedded browser, or power-saving laptop throttles animation frames.
      afterDraw(tick);
    };

    tick();
  }

  private updateUfo(delta: number) {
    // UFO ring continuous rotation
    this.ufo.ring.rotation.y += delta * 2.2;
    this.ufo.beacons.forEach((b, i) => {
      b.scale.setScalar(1 + Math.sin(this.clock.getElapsedTime() * 8 + i) * 0.2);
    });

    const time = this.clock.getElapsedTime();

    if (this.gameState === 'IDLE') {
      // Gentle floating hover over the village center
      const idleY = 16 + Math.sin(time * 1.5) * 0.6;
      this.ufo.group.position.x = THREE.MathUtils.damp(this.ufo.group.position.x, 0, 2, delta);
      this.ufo.group.position.y = THREE.MathUtils.damp(this.ufo.group.position.y, idleY, 3, delta);
      this.ufo.group.position.z = THREE.MathUtils.damp(this.ufo.group.position.z, 0, 2, delta);
      this.ufo.beamCone.scale.set(0.6, 1, 0.6);
      this.ufo.beamLight.intensity = 2;
      this.ufo.groundReticle.position.set(0, 0.05, 0);
    } else if (this.gameState === 'SCANNING') {
      // UFO swoops lower and sweeps beam across village
      this.chaseTimer += delta;
      const sweepX = Math.sin(time * 3) * 14;
      const sweepZ = Math.cos(time * 2.2) * 12;

      this.ufo.group.position.x = sweepX;
      this.ufo.group.position.y = THREE.MathUtils.damp(this.ufo.group.position.y, 11, 3, delta);
      this.ufo.group.position.z = sweepZ;

      // Ground reticle tracks scanning spotlight
      this.ufo.groundReticle.position.set(sweepX, 0.05, sweepZ);
      this.ufo.beamLight.intensity = 6;

    } else if (this.gameState === 'CHASING') {
      // UFO actively closes in on target student
      this.chaseTimer += delta;
      if (this.targetStudent) {
        const tPos = this.targetStudent.group.position;
        this.ufo.group.position.x = THREE.MathUtils.damp(this.ufo.group.position.x, tPos.x, 2.5, delta);
        this.ufo.group.position.z = THREE.MathUtils.damp(this.ufo.group.position.z, tPos.z, 2.5, delta);
        this.ufo.group.position.y = THREE.MathUtils.damp(this.ufo.group.position.y, 9.5, 3, delta);

        this.ufo.groundReticle.position.set(tPos.x, 0.05, tPos.z);
        this.ufo.beamLight.intensity = 9;

        // When aligned over student
        const dist = new THREE.Vector2(this.ufo.group.position.x - tPos.x, this.ufo.group.position.z - tPos.z).length();
        if (dist < 1.2 && this.chaseTimer > 6.0) {
          this.moveToBeamPhase();
        }
      }
    } else if (this.gameState === 'BEAMING' || this.gameState === 'QUIZ') {
      // Hover steadily directly over the beamed student
      if (this.targetStudent) {
        const tPos = this.targetStudent.group.position;
        this.ufo.group.position.x = tPos.x;
        this.ufo.group.position.z = tPos.z;
        this.ufo.group.position.y = 11;
        this.ufo.groundReticle.position.set(tPos.x, 0.05, tPos.z);
        this.ufo.beamLight.intensity = 14;
      }
    }
  }

  private updateStudents(delta: number) {
    // Waypoints across village terrain zones
    const escapeWaypoints = [
      new THREE.Vector3(18, 0, -16), // School steps
      new THREE.Vector3(-18, 0, -14), // Crystal Cave rocks
      new THREE.Vector3(18, 0, 16),  // Lake footbridge
      new THREE.Vector3(-2, 0, 14),  // Across low jump fence
      new THREE.Vector3(6, 0, 4),    // Pumpkin garden
      new THREE.Vector3(-8, 0, -2),  // Path intersection
    ];

    this.students.forEach((actor, idx) => {
      let isMoving = false;

      // 1. Manual Player Control for Active Student
      if (this.playerManualControl && idx === this.activeStudentIndex && !actor.isBeamed) {
        const moveVec = new THREE.Vector3(0, 0, 0);
        if (this.keys['KeyW'] || this.keys['ArrowUp']) moveVec.z -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) moveVec.z += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveVec.x -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) moveVec.x += 1;

        if (moveVec.lengthSq() > 0) {
          moveVec.normalize();
          const speed = 7.5;
          actor.group.position.x += moveVec.x * speed * delta;
          actor.group.position.z += moveVec.z * speed * delta;

          // Boundary clamp (-32 to 32)
          actor.group.position.x = THREE.MathUtils.clamp(actor.group.position.x, -30, 30);
          actor.group.position.z = THREE.MathUtils.clamp(actor.group.position.z, -30, 30);

          // Rotate to face movement direction
          const targetAngle = Math.atan2(moveVec.x, moveVec.z);
          actor.group.rotation.y = THREE.MathUtils.damp(actor.group.rotation.y, targetAngle, 12, delta);
          isMoving = true;
          actor.data.state = 'running';
        } else {
          actor.data.state = 'idle';
        }
      } 
      // 2. Autonomous Classroom Chase & Wander Behaviors
      else if (!actor.isBeamed) {
        if (this.gameState === 'CHASING' || this.gameState === 'SCANNING') {
          // Flee away from UFO spotlight!
          const ufoPos = this.ufo.group.position;
          const toActor = new THREE.Vector3(actor.group.position.x - ufoPos.x, 0, actor.group.position.z - ufoPos.z);
          const distToUfo = toActor.length();

          // Designated action routes for specific students per gameplay story:
          if (idx === 1 && !actor.isJumping) {
            // Liam jumps over the low garden fence!
            const fenceJumpSpot = new THREE.Vector3(-1, 0, 12);
            if (actor.group.position.distanceTo(fenceJumpSpot) < 1.4) {
              actor.isJumping = true;
              actor.jumpProgress = 0;
            }
          }

          if (idx === 4) {
            // Chloe crouches behind cave boulders!
            const caveHiding = new THREE.Vector3(-20, 0, -16);
            if (actor.group.position.distanceTo(caveHiding) < 3.0) {
              actor.isCrouching = true;
              actor.data.state = 'crouching';
            }
          }

          // Move towards escape waypoint
          const targetWaypoint = escapeWaypoints[idx % escapeWaypoints.length];
          const dir = targetWaypoint.clone().sub(actor.group.position);
          if (dir.length() > 0.8) {
            dir.normalize();
            const fleeSpeed = 5.8;
            actor.group.position.x += dir.x * fleeSpeed * delta;
            actor.group.position.z += dir.z * fleeSpeed * delta;
            actor.group.rotation.y = THREE.MathUtils.damp(actor.group.rotation.y, Math.atan2(dir.x, dir.z), 10, delta);
            isMoving = true;
            if (!actor.isCrouching) actor.data.state = 'running';
          }
        } else {
          // Idle gentle wandering around their zone
          const wanderTime = this.clock.getElapsedTime() + idx * 2.5;
          const slowDrift = Math.sin(wanderTime * 0.5);
          if (Math.abs(slowDrift) > 0.6) {
            isMoving = true;
            actor.group.rotation.y += delta * 0.4;
          }
          actor.isCrouching = false;
        }
      }

      ActorBuilder.updateStudentAnimation(actor, delta, isMoving);
    });
  }

  private updateCamera(delta: number) {
    if (this.cameraMode === 'ORBIT') return;

    if (this.cameraMode === 'CHASE') {
      if (this.gameState === 'CHASING' || this.gameState === 'BEAMING' || this.gameState === 'QUIZ') {
        // Dynamic cinematic follow: follow the UFO and target student
        const focusPoint = this.targetStudent ? this.targetStudent.group.position : this.ufo.group.position;
        this.camLookTarget.copy(focusPoint);
        this.camLookTarget.y += 2.5;

        // Camera smoothly glides behind and above the action
        this.camTargetPos.set(focusPoint.x - 8, focusPoint.y + 11, focusPoint.z + 16);
      } else {
        // General panoramic view of the cheerful village
        this.camLookTarget.set(0, 3, 0);
        this.camTargetPos.set(0, 22, 38);
      }
    } else if (this.cameraMode === 'PRESET_SCHOOL') {
      this.camLookTarget.set(20, 5, -18);
      this.camTargetPos.set(8, 12, -4);
    } else if (this.cameraMode === 'PRESET_CAVE') {
      this.camLookTarget.set(-20, 4, -16);
      this.camTargetPos.set(-8, 10, -3);
    } else if (this.cameraMode === 'PRESET_LAKE') {
      this.camLookTarget.set(18, 2, 18);
      this.camTargetPos.set(8, 9, 7);
    } else if (this.cameraMode === 'PRESET_UFO') {
      // Looking straight down from above the UFO
      this.camLookTarget.copy(this.ufo.group.position);
      this.camTargetPos.set(this.ufo.group.position.x, this.ufo.group.position.y + 18, this.ufo.group.position.z + 0.1);
    }

    // Exponential smooth damping
    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, this.camTargetPos.x, 3.5, delta);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, this.camTargetPos.y, 3.5, delta);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, this.camTargetPos.z, 3.5, delta);

    this.camera.lookAt(this.camLookTarget);
  }

  private updateEnvironment(delta: number) {
    const time = this.clock.getElapsedTime();

    // Smooth theme transitions (Daylight Sun <-> Midnight Starlight)
    (this.scene.background as THREE.Color).lerp(this.targetBgColor, delta * 3.5);
    (this.scene.fog as THREE.FogExp2).color.lerp(this.targetFogColor, delta * 3.5);
    this.sunLight.color.lerp(this.targetSunColor, delta * 3.5);
    this.sunLight.intensity = THREE.MathUtils.damp(this.sunLight.intensity, this.targetSunIntensity, 3.5, delta);
    this.hemiLight.color.lerp(this.targetHemiSky, delta * 3.5);
    this.hemiLight.groundColor.lerp(this.targetHemiGround, delta * 3.5);
    this.hemiLight.intensity = THREE.MathUtils.damp(this.hemiLight.intensity, this.targetHemiIntensity, 3.5, delta);

    // Floating Clouds drifting gently across the blue sky
    this.worldObjects.clouds.position.x = Math.sin(time * 0.04) * 6;

    // Water surface subtle ripple
    this.worldObjects.waterMesh.rotation.z = Math.sin(time * 0.5) * 0.02;

    // Glowing Crystals breathing luminescence
    this.worldObjects.crystals.forEach((c, idx) => {
      c.scale.setScalar(1 + Math.sin(time * 3 + idx) * 0.05);
    });

    // Floating letter props gentle hover & rotation
    this.worldObjects.letterProps.forEach((lp, idx) => {
      lp.position.y = 1.4 + Math.sin(time * 2 + idx) * 0.2;
      lp.rotation.y += delta * 0.8;
    });
  }

  public dispose() {
    this.isDestroyed = true;
    window.removeEventListener('resize', this.onResize);
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
    this.controls?.dispose();
    this.renderer?.dispose();
    if (this.renderer?.domElement?.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
