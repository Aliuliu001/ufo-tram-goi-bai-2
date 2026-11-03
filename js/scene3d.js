import { abductionProgress } from './world3d-state.js';
import { panicSpeed, getEscapeAction } from './movement-profile.js';

const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

export async function createWorld3D(mount, labels, onReady) {
  await loadThree();
  const THREE = window.THREE;
  const world = new UfoWorld(THREE, mount, labels);
  world.setStudents(['An Nhiên', 'Bảo Ngọc', 'Gia Hân', 'Minh Khang', 'Thanh Vy']);
  world.start();
  onReady?.(world);
  return world;
}

function loadThree() {
  if (window.THREE) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = THREE_URL;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
}

class UfoWorld {
  constructor(THREE, mount, labels) {
    this.T = THREE;
    this.mount = mount;
    this.labels = labels;
    this.clock = new THREE.Clock();
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x04071b);
    this.scene.fog = new THREE.FogExp2(0x04071b, .015);
    
    this.camera = new THREE.PerspectiveCamera(47, 1, .1, 250);
    this.orbit = { theta: .55, phi: .93, radius: 35, dragging: false, x: 0, y: 0 };
    this.baseCameraRadius = 35;
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.replaceChildren(this.renderer.domElement);
    
    this.students = [];
    this.activeName = null;
    this.abducting = null;
    this.scanNames = [];
    this.scanActive = false;
    this.cameraMode = 'overview';
    this.characterSkin = 'astronaut';
    this.hideouts = [];
    this.skin = { accent: 0x9af76d, accent2: 0x6ddaf7 };
    
    this.huntingPhase = 'idle';
    this.lockTarget = null;
    this.lockStartTime = 0;
    this.slowMo = false;
    this.slowMoFactor = 1.0;
    this.targetSlowMoFactor = 1.0;
    
    // Sequence ID to cancel old callbacks
    this.sequenceId = 0;
    
    this.setupLights();
    this.buildTown();
    this.buildUfo();
    this.bindCamera();
    this.resize();
    
    new ResizeObserver(() => this.resize()).observe(mount);
  }

  setupLights() {
    const T = this.T;
    this.scene.add(new T.HemisphereLight(0x7dd3fc, 0x10152f, 1.65));
    const key = new T.DirectionalLight(0xbddcff, 1.55);
    key.position.set(22, 31, 19);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -28;
    key.shadow.camera.right = 28;
    key.shadow.camera.top = 28;
    key.shadow.camera.bottom = -28;
    this.scene.add(key);
  }

  buildTown() {
    const T = this.T;
    const ground = new T.Mesh(new T.CylinderGeometry(29, 32, 2, 56), new T.MeshStandardMaterial({ color: 0x111a3b, roughness: .9 }));
    ground.position.y = -1;
    ground.receiveShadow = true;
    this.scene.add(ground);
    
    const roadMat = new T.MeshStandardMaterial({ color: 0x242c51, roughness: .85 });
    [[55, .14, 6], [6, .14, 55]].forEach(([x, y, z]) => {
      const road = new T.Mesh(new T.BoxGeometry(x, y, z), roadMat);
      road.position.y = .02;
      road.receiveShadow = true;
      this.scene.add(road);
    });
    
    const neon = new T.MeshBasicMaterial({ color: 0x38dff6 });
    const ring = new T.Mesh(new T.RingGeometry(4.8, 5.12, 40), neon);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = .1;
    this.scene.add(ring);
    
    for (let n = -24; n <= 24; n += 4) {
      if (Math.abs(n) < 6) continue;
      for (const [x, z, w, d] of [[n, 0, 1.7, .16], [0, n, .16, 1.7]]) {
        const dash = new T.Mesh(new T.BoxGeometry(w, .06, d), new T.MeshBasicMaterial({ color: 0x9af76d }));
        dash.position.set(x, .1, z);
        this.scene.add(dash);
      }
    }
    
    const configs = [[-13, -13, 0xee7d8e], [-20, -8, 0x806bf0], [-14, 15, 0x46b5db], [13, -13, 0xfcbd55], [20, -8, 0xa178ec], [14, 15, 0x49d8ac], [-21, 8, 0xff7595], [21, 10, 0x5cd3f3]];
    configs.forEach(([x, z, color], i) => this.house(x, z, color, 4.3 + (i % 3), 4.2 + (i % 2) * 1.2));
    
    for (const [x, z] of [[-8, -8], [8, -8], [-8, 8], [8, 8], [-18, 2], [18, 2], [-2, -18], [2, 18]]) {
      this.tree(x, z);
    }
    
    [[-10, 4, 'bush'], [10, 4, 'bush'], [-4, 13, 'fence'], [4, -13, 'fence'], [-16, -2, 'pond'], [16, 2, 'pond']].forEach(([x, z, type]) => this.hideout(x, z, type));
    
    const stars = new T.BufferGeometry();
    const pos = [];
    for (let i = 0; i < 500; i++) {
      const r = 52 + Math.random() * 72;
      const a = Math.random() * Math.PI * 2;
      const p = Math.random() * Math.PI * .52;
      pos.push(r * Math.sin(p) * Math.cos(a), Math.abs(r * Math.cos(p)) + 7, r * Math.sin(p) * Math.sin(a));
    }
    stars.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    this.stars = new T.Points(stars, new T.PointsMaterial({ color: 0xdff7ff, size: .52, transparent: true, opacity: .9 }));
    this.scene.add(this.stars);
    
    this.planet = new T.Group();
    const p = new T.Mesh(new T.SphereGeometry(5.7, 24, 20), new T.MeshStandardMaterial({ color: 0x715ee8, emissive: 0x27205c, emissiveIntensity: .8 }));
    const pr = new T.Mesh(new T.RingGeometry(7, 9.4, 36), new T.MeshBasicMaterial({ color: 0x5fe1fb, transparent: true, opacity: .55, side: T.DoubleSide }));
    pr.rotation.x = 1.08;
    this.planet.add(p, pr);
    this.planet.position.set(-31, 23, -39);
    this.scene.add(this.planet);
  }

  house(x, z, color, w, h) {
    const T = this.T;
    const g = new T.Group();
    const body = new T.Mesh(new T.BoxGeometry(w, h, w), new T.MeshStandardMaterial({ color, roughness: .58, metalness: .12 }));
    body.position.y = h / 2;
    body.castShadow = true;
    g.add(body);
    const roof = new T.Mesh(new T.ConeGeometry(w * .86, 2.5, 4), new T.MeshStandardMaterial({ color: 0x27335e, roughness: .5 }));
    roof.position.y = h + 1.22;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    g.add(roof);
    for (let yi = 1; yi < h; yi += 1.45) {
      for (let xi = -1; xi <= 1; xi += 2) {
        const win = new T.Mesh(new T.PlaneGeometry(.65, .78), new T.MeshBasicMaterial({ color: 0xfff4a5 }));
        win.position.set(xi * w * .25, yi, 0);
        win.position.z = w / 2 + .01;
        g.add(win);
      }
    }
    g.position.set(x, 0, z);
    this.scene.add(g);
  }

  tree(x, z) {
    const T = this.T;
    const g = new T.Group();
    const tr = new T.Mesh(new T.CylinderGeometry(.23, .34, 1.5, 7), new T.MeshStandardMaterial({ color: 0x6f482e }));
    tr.position.y = .75;
    g.add(tr);
    [0, 1].forEach(n => {
      const leaf = new T.Mesh(new T.ConeGeometry(1.35 - n * .22, 2.25, 9), new T.MeshStandardMaterial({ color: n ? 0x56de87 : 0x24b970 }));
      leaf.position.y = 2.05 + n * .85;
      leaf.castShadow = true;
      g.add(leaf);
    });
    g.position.set(x, 0, z);
    this.scene.add(g);
  }

  hideout(x, z, type) {
    const T = this.T;
    const g = new T.Group();
    if (type === 'bush') {
      for (const dx of [-.7, 0, .7]) {
        const b = new T.Mesh(new T.SphereGeometry(.82, 10, 8), new T.MeshStandardMaterial({ color: 0x197a54 }));
        b.position.set(dx, .7, 0);
        g.add(b);
      }
    } else if (type === 'fence') {
      for (let i = -1; i <= 1; i++) {
        const post = new T.Mesh(new T.BoxGeometry(.14, 1.15, .14), new T.MeshStandardMaterial({ color: 0xe6a54b }));
        post.position.set(i * 1.1, .58, 0);
        g.add(post);
      }
      const rail = new T.Mesh(new T.BoxGeometry(3, .13, .13), new T.MeshStandardMaterial({ color: 0xffd071 }));
      rail.position.y = .7;
      g.add(rail);
    } else {
      const pond = new T.Mesh(new T.CylinderGeometry(1.65, 1.65, .18, 20), new T.MeshStandardMaterial({ color: 0x2caed8, emissive: 0x075a8c, emissiveIntensity: .6, transparent: true, opacity: .8 }));
      pond.position.y = .1;
      g.add(pond);
    }
    g.position.set(x, 0, z);
    this.scene.add(g);
    this.hideouts.push(new T.Vector3(x, 0, z));
  }

  buildUfo() {
    const T = this.T;
    this.ufo = new T.Group();
    this.ufo.position.set(0, 12, 0);
    this.ufoTarget = new T.Vector3(0, 12, 0);
    
    const hull = new T.Mesh(new T.CylinderGeometry(1.65, 3.65, 1.08, 32), new T.MeshStandardMaterial({ color: 0xaebbd0, metalness: .8, roughness: .2 }));
    hull.castShadow = true;
    this.ufo.add(hull);
    
    // UFO type-specific geometry
    this.buildUfoVariant(T);
    
    this.rimMat = new T.MeshStandardMaterial({ color: this.skin.accent2, emissive: this.skin.accent2, emissiveIntensity: 1.1 });
    const rim = new T.Mesh(new T.TorusGeometry(3.67, .22, 12, 42), this.rimMat);
    rim.rotation.x = Math.PI / 2;
    this.ufo.add(rim);
    
    const dome = new T.Mesh(new T.SphereGeometry(1.95, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshStandardMaterial({ color: 0x8bf4ff, transparent: true, opacity: .57, roughness: .1, metalness: .28 }));
    dome.position.y = .42;
    this.ufo.add(dome);
    
    const alien = new T.Mesh(new T.SphereGeometry(.62, 16, 14), new T.MeshStandardMaterial({ color: 0xa2e75e, emissive: 0x477319, emissiveIntensity: .4 }));
    alien.position.y = 1.1;
    this.ufo.add(alien);
    
    for (const x of [-.22, .22]) {
      const eye = new T.Mesh(new T.SphereGeometry(.13, 8, 8), new T.MeshBasicMaterial({ color: 0x071020 }));
      eye.position.set(x, 1.2, .55);
      this.ufo.add(eye);
    }
    
    this.lights = [];
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      const orb = new T.Mesh(new T.SphereGeometry(.2, 8, 8), new T.MeshBasicMaterial({ color: i % 2 ? this.skin.accent : this.skin.accent2 }));
      orb.position.set(Math.cos(a) * 3.72, -.08, Math.sin(a) * 3.72);
      this.ufo.add(orb);
      this.lights.push(orb);
    }
    
    this.beamMat = new T.MeshBasicMaterial({ color: this.skin.accent, transparent: true, opacity: .13, side: T.DoubleSide, depthWrite: false });
    const beam = new T.Mesh(new T.ConeGeometry(4.6, 14, 32, 1, true), this.beamMat);
    beam.geometry.translate(0, -7, 0);
    beam.position.y = -.4;
    this.ufo.add(beam);
    this.mainBeam = beam;
    
    this.sideBeams = [];
    for (const side of [-1, 1]) {
      const mat = new T.MeshBasicMaterial({ color: this.skin.accent2, transparent: true, opacity: .1, side: T.DoubleSide, depthWrite: false });
      const ray = new T.Mesh(new T.ConeGeometry(2.1, 11, 20, 1, true), mat);
      ray.geometry.translate(0, -5.5, 0);
      ray.position.set(side * 3.2, -.2, 0);
      ray.rotation.z = side * .22;
      this.ufo.add(ray);
      this.sideBeams.push(ray);
    }
    
    this.beamRings = [];
    for (let i = 0; i < 4; i++) {
      const ring = new T.Mesh(new T.TorusGeometry(1.5 + i * .8, .08, 8, 24), new T.MeshBasicMaterial({ color: this.skin.accent, transparent: true, opacity: 0 }));
      ring.position.y = -3 - i * 1.5;
      ring.rotation.x = Math.PI / 2;
      this.ufo.add(ring);
      this.beamRings.push(ring);
    }
    
    this.scene.add(this.ufo);
  }

  buildUfoVariant(T) {
    const type = this.ufoType || 'scout';
    
    if (type === 'rescue') {
      // Rescue pods on sides
      for (const side of [-1, 1]) {
        const pod = new T.Mesh(
          new T.SphereGeometry(.6, 12, 10),
          new T.MeshStandardMaterial({ color: 0xff8f6a, metalness: .7, roughness: .3 })
        );
        pod.position.set(side * 4.2, -.3, 0);
        this.ufo.add(pod);
        
        // Beacon light
        const beacon = new T.Mesh(
          new T.SphereGeometry(.15, 8, 8),
          new T.MeshBasicMaterial({ color: 0xff4d4d })
        );
        beacon.position.set(side * 4.2, .2, 0);
        this.ufo.add(beacon);
      }
    } else if (type === 'treasure') {
      // Three energy rings
      for (let i = 0; i < 3; i++) {
        const ring = new T.Mesh(
          new T.TorusGeometry(2.2 + i * .5, .12, 8, 24),
          new T.MeshBasicMaterial({ 
            color: [0xd2a8ff, 0x9b7aff, 0x7ba9ff][i], 
            transparent: true, 
            opacity: .7 
          })
        );
        ring.rotation.x = Math.PI / 2 + i * .15;
        ring.position.y = .8 + i * .3;
        this.ufo.add(ring);
      }
    } else if (type === 'storm') {
      // Two fins
      for (const side of [-1, 1]) {
        const finGeo = new T.BoxGeometry(.3, 2.5, 1.2);
        const fin = new T.Mesh(
          finGeo,
          new T.MeshStandardMaterial({ color: 0x4a4a6a, metalness: .85, roughness: .15 })
        );
        fin.position.set(side * 3.8, .5, 0);
        fin.rotation.z = side * .25;
        fin.castShadow = true;
        this.ufo.add(fin);
      }
      
      // Glowing core
      const core = new T.Mesh(
        new T.SphereGeometry(.45, 16, 16),
        new T.MeshBasicMaterial({ color: 0xffcf58 })
      );
      core.position.y = -.5;
      this.ufo.add(core);
    }
  }

  setStudents(names) {
    this.students.forEach(a => {
      this.scene.remove(a.group);
      a.label.remove();
    });
    this.students = [];
    
    names.forEach((name, i) => {
      const T = this.T;
      const g = new T.Group();
      const color = [0x55c8fa, 0xa2e75e, 0xff8fb7, 0xffd35e, 0xa98bff][i % 5];
      const mat = new T.MeshStandardMaterial({ color, roughness: .45 });
      
      // Crew skin rendering
      if (this.characterSkin === 'forest') {
        this.buildForestCrew(g, T, i);
      } else if (this.characterSkin === 'robots') {
        this.buildRobotCrew(g, T, i);
      } else if (this.characterSkin === 'animals') {
        this.buildAnimalCrew(g, T, mat, i);
      } else {
        // Default astronaut
        this.buildAstronautCrew(g, T, mat);
      }
      
      const limbs = [];
      for (const [x, y] of [[-.18, .35], [.18, .35], [-.5, 1.18], [.5, 1.18]]) {
        const limb = new T.Mesh(new T.CylinderGeometry(.11, .11, .65, 7), new T.MeshStandardMaterial({ color: 0xe8efff }));
        limb.position.set(x, y, 0);
        g.add(limb);
        limbs.push(limb);
      }
      
      const angle = i / Math.max(1, names.length) * Math.PI * 2;
      const dist = 5 + (i % 3) * 3.2;
      const pos = new T.Vector3(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
      g.position.copy(pos);
      this.scene.add(g);
      
      const label = document.createElement('span');
      label.className = 'student-3d-label';
      label.textContent = name;
      this.labels.append(label);
      
      this.students.push({
        name,
        group: g,
        label,
        pos,
        target: this.streetPoint(),
        speed: 1.8 + Math.random() * 0.4,
        phase: Math.random() * 7,
        limbs,
        abduct: false,
        escapeAction: null,
        escapeProgress: 0
      });
    });
  }

  streetPoint() {
    return Math.random() > .5 ? new this.T.Vector3((Math.random() - .5) * 38, 0, (Math.random() - .5) * 4) : new this.T.Vector3((Math.random() - .5) * 4, 0, (Math.random() - .5) * 38);
  }

  setSkin(skin) {
    this.skin = { accent: parseInt(skin.accent.replace('#', ''), 16), accent2: parseInt(skin.accent2.replace('#', ''), 16) };
    this.ufoType = skin.type || 'scout';
    this.rimMat.color.setHex(this.skin.accent2);
    this.rimMat.emissive.setHex(this.skin.accent2);
    this.beamMat.color.setHex(this.skin.accent);
    this.lights.forEach((x, i) => x.material.color.setHex(i % 2 ? this.skin.accent : this.skin.accent2));
  }

  setCharacterSkin(kind) {
    this.characterSkin = kind;
    const names = this.students.map(a => a.name);
    this.setStudents(names);
  }

  buildAstronautCrew(group, T, mat) {
    const body = new T.Mesh(new T.CylinderGeometry(.4, .48, 1.1, 12), mat);
    body.position.y = 1.08;
    body.castShadow = true;
    group.add(body);
    
    const head = new T.Mesh(new T.SphereGeometry(.49, 14, 12), new T.MeshStandardMaterial({ color: 0xf5fbff, roughness: .2 }));
    head.position.y = 1.96;
    group.add(head);
    
    const visor = new T.Mesh(new T.SphereGeometry(.34, 12, 10), new T.MeshStandardMaterial({ color: 0x208ec7, emissive: 0x34d9f7, emissiveIntensity: .35, metalness: .8 }));
    visor.position.set(0, 1.98, .27);
    group.add(visor);
  }

  buildAnimalCrew(group, T, mat, index) {
    const body = new T.Mesh(new T.CylinderGeometry(.4, .48, 1.1, 12), mat);
    body.position.y = 1.08;
    body.castShadow = true;
    group.add(body);
    
    const head = new T.Mesh(new T.SphereGeometry(.49, 14, 12), new T.MeshStandardMaterial({ color: 0xf5fbff, roughness: .2 }));
    head.position.y = 1.96;
    group.add(head);
    
    const visor = new T.Mesh(new T.SphereGeometry(.34, 12, 10), new T.MeshStandardMaterial({ color: 0x208ec7, emissive: 0x34d9f7, emissiveIntensity: .35, metalness: .8 }));
    visor.position.set(0, 1.98, .27);
    group.add(visor);
    
    const fur = [0xffc857, 0xf49ac2, 0xb990ff, 0x83dfb0, 0xff9a65][index % 5];
    const animalMat = new T.MeshStandardMaterial({ color: fur, roughness: .55 });
    group.scale.setScalar(1.28);
    
    for (const x of [-.38, .38]) {
      const ear = new T.Mesh(new T.ConeGeometry(.27, .78, 8), animalMat);
      ear.position.set(x, 2.72, 0);
      group.add(ear);
    }
    
    const muzzle = new T.Mesh(new T.SphereGeometry(.27, 10, 8), animalMat);
    muzzle.position.set(0, 1.93, .46);
    group.add(muzzle);
    
    const tail = new T.Mesh(new T.SphereGeometry(.31, 10, 8), animalMat);
    tail.position.set(0, .95, -.62);
    group.add(tail);
  }

  buildForestCrew(group, T, index) {
    const colors = [0x8b7355, 0xa68a6d, 0x6b5344, 0x9d8569, 0x7a6049];
    const leafColors = [0x4a7c59, 0x5d9c6b, 0x3f6b4d, 0x6bab78, 0x528a5f];
    
    // Tree trunk body
    const trunk = new T.Mesh(
      new T.CylinderGeometry(.35, .42, 1.3, 8),
      new T.MeshStandardMaterial({ color: colors[index % 5], roughness: .75 })
    );
    trunk.position.y = .9;
    trunk.castShadow = true;
    group.add(trunk);
    
    // Crown (foliage)
    const crown = new T.Mesh(
      new T.SphereGeometry(.65, 10, 8),
      new T.MeshStandardMaterial({ color: leafColors[index % 5], roughness: .6 })
    );
    crown.position.y = 2.1;
    crown.castShadow = true;
    group.add(crown);
    
    // Sprouts on crown
    for (let j = 0; j < 3; j++) {
      const angle = j / 3 * Math.PI * 2;
      const sprout = new T.Mesh(
        new T.ConeGeometry(.15, .4, 6),
        new T.MeshStandardMaterial({ color: leafColors[index % 5] })
      );
      sprout.position.set(Math.cos(angle) * .4, 2.5, Math.sin(angle) * .4);
      group.add(sprout);
    }
  }

  buildRobotCrew(group, T, index) {
    const colors = [0x7a8a9a, 0x9aa5b0, 0x6a7a8a, 0x8a9aaa, 0x7a8a9a];
    
    // Box body
    const body = new T.Mesh(
      new T.BoxGeometry(.7, 1, .6),
      new T.MeshStandardMaterial({ color: colors[index % 5], metalness: .85, roughness: .2 })
    );
    body.position.y = 1.1;
    body.castShadow = true;
    group.add(body);
    
    // Screen on chest
    const screen = new T.Mesh(
      new T.PlaneGeometry(.4, .3),
      new T.MeshBasicMaterial({ color: 0x4dffff })
    );
    screen.position.set(0, 1.2, .31);
    group.add(screen);
    
    // Box head
    const head = new T.Mesh(
      new T.BoxGeometry(.5, .5, .5),
      new T.MeshStandardMaterial({ color: colors[index % 5], metalness: .85, roughness: .2 })
    );
    head.position.y = 2;
    group.add(head);
    
    // Eyes
    for (const x of [-.15, .15]) {
      const eye = new T.Mesh(
        new T.SphereGeometry(.08, 8, 8),
        new T.MeshBasicMaterial({ color: 0xffff4d })
      );
      eye.position.set(x, 2.05, .26);
      group.add(eye);
    }
    
    // Antenna
    const antennaStem = new T.Mesh(
      new T.CylinderGeometry(.03, .03, .5, 6),
      new T.MeshStandardMaterial({ color: 0x555555, metalness: .9 })
    );
    antennaStem.position.y = 2.5;
    group.add(antennaStem);
    
    const antennaBall = new T.Mesh(
      new T.SphereGeometry(.1, 8, 8),
      new T.MeshBasicMaterial({ color: 0xff4d4d })
    );
    antennaBall.position.y = 2.8;
    group.add(antennaBall);
  }

  abduct(name) {
    const actor = this.students.find(x => x.name === name);
    if (!actor) return;
    this.activeName = name;
    this.abducting = { actor, start: this.clock.getElapsedTime() };
    this.ufoTarget.set(actor.pos.x, 11.5, actor.pos.z);
    this.beamMat.opacity = .39;
    this.huntingPhase = 'abduct';
  }

  beginScan(names) {
    this.scanNames = [...names];
    this.scanActive = true;
    this.activeName = null;
    this.scanPulse = 0;
    this.beamMat.opacity = .16;
    this.huntingPhase = 'scan';
  }

  scanTarget(name, intensity = 0) {
    if (!this.scanActive) return;
    this.activeName = name;
    this.scanPulse = intensity;
    
    const actor = this.students.find(x => x.name === name);
    if (!actor) return;
    
    if (intensity < 0.3) {
      this.huntingPhase = 'scan';
      this.ufoTarget.set(actor.pos.x, 13, actor.pos.z);
      this.beamMat.opacity = .16 + intensity * .2;
      this.beamMat.color.lerp(new this.T.Color(0xffe06a), 0.3);
      
    } else if (intensity < 0.7) {
      this.huntingPhase = 'detect';
      this.ufoTarget.set(actor.pos.x, 12, actor.pos.z);
      this.beamMat.opacity = .24 + intensity * .15;
      this.beamMat.color.lerp(new this.T.Color(0xff9a4d), 0.4);
      actor.panicking = 0.5;
      actor.target = this.streetPoint();
      
    } else {
      this.huntingPhase = 'lock';
      this.lockTarget = actor;
      
      if (!this.slowMo) {
        this.slowMo = true;
        this.targetSlowMoFactor = 0.45;
        this.lockStartTime = this.clock.getElapsedTime();
        const escape = getEscapeAction(actor, this.hideouts, actor.pos);
        actor.escapeAction = escape.action;
        actor.escapeTarget = escape.target;
        actor.escapeProgress = 0;
      }
      
      this.ufoTarget.set(actor.pos.x, 11, actor.pos.z);
      this.beamMat.opacity = .38 + intensity * .22;
      this.beamMat.color.lerp(new this.T.Color(0xff4d4d), 0.6);
      this.targetCameraRadius = 22;
      actor.panicking = 1;
    }
    
    this.ufo.scale.setScalar(1 + intensity * .15);
  }

  finishScan(names, done) {
    this.scanActive = false;
    this.huntingPhase = 'idle';
    this.slowMo = false;
    this.targetSlowMoFactor = 1.0;
    this.lockTarget = null;
    
    const currentSequence = ++this.sequenceId;
    
    let index = 0;
    const next = () => {
      // Check if this sequence was cancelled
      if (this.sequenceId !== currentSequence) return;
      
      if (index >= names.length) {
        this.activeName = null;
        done?.();
        return;
      }
      const name = names[index++];
      this.abduct(name);
      setTimeout(next, 1400);
    };
    next();
  }

  cancelScan() {
    this.sequenceId++; // Cancel any pending callbacks
    this.scanActive = false;
    this.huntingPhase = 'idle';
    this.activeName = null;
    this.abducting = null;
    this.beamMat.opacity = .12;
    this.slowMo = false;
    this.targetSlowMoFactor = 1.0;
    this.lockTarget = null;
  }

  setCameraMode(mode) {
    this.cameraMode = mode;
  }

  bindCamera() {
    const c = this.renderer.domElement;
    c.addEventListener('pointerdown', e => {
      this.orbit.dragging = true;
      this.orbit.x = e.clientX;
      this.orbit.y = e.clientY;
    });
    window.addEventListener('pointermove', e => {
      if (!this.orbit.dragging) return;
      this.orbit.theta -= (e.clientX - this.orbit.x) * .007;
      this.orbit.phi = Math.max(.4, Math.min(1.38, this.orbit.phi - (e.clientY - this.orbit.y) * .006));
      this.orbit.x = e.clientX;
      this.orbit.y = e.clientY;
    });
    window.addEventListener('pointerup', () => this.orbit.dragging = false);
    c.addEventListener('wheel', e => {
      e.preventDefault();
      this.baseCameraRadius = Math.max(19, Math.min(53, this.baseCameraRadius + e.deltaY * .025));
    }, { passive: false });
  }

  resize() {
    const w = this.mount.clientWidth || 800;
    const h = this.mount.clientHeight || 450;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  start() {
    this.renderer.setAnimationLoop(() => this.tick());
  }

  tick() {
    const T = this.T;
    const rawDt = Math.min(this.clock.getDelta(), .06);
    const t = this.clock.getElapsedTime();
    
    this.slowMoFactor += (this.targetSlowMoFactor - this.slowMoFactor) * rawDt * 8;
    const dt = rawDt * this.slowMoFactor;
    
    this.students.forEach(a => {
      if (a.abduct) return;
      const to = a.target.clone().sub(a.pos);
      to.y = 0;
      
      if (to.length() < .6) {
        a.target = this.streetPoint();
      } else {
        to.normalize();
        const panicLevel = this.scanActive ? this.scanPulse || 0 : 0;
        const speed = panicSpeed(panicLevel);
        
        if (a.escapeAction && this.lockTarget === a) {
          a.escapeProgress += dt * 2.5;
          
          if (a.escapeAction === 'roll') {
            a.group.rotation.x = a.escapeProgress * Math.PI * 2;
            a.group.rotation.z = Math.sin(a.escapeProgress * 8) * .8;
          } else if (a.escapeAction === 'dive' && a.escapeTarget) {
            const diveDir = a.escapeTarget.clone().sub(a.pos).normalize();
            a.pos.addScaledVector(diveDir, speed * dt * 1.5);
            a.group.rotation.x = -Math.PI / 6;
          } else if (a.escapeAction === 'jump') {
            const jumpHeight = Math.sin(a.escapeProgress * Math.PI) * 2.5;
            a.pos.y = jumpHeight;
            a.group.rotation.x = a.escapeProgress * Math.PI;
          }
          
          if (a.escapeProgress > 1) {
            a.escapeAction = null;
            a.escapeProgress = 0;
            a.group.rotation.x = 0;
            a.group.rotation.z = 0;
          }
        } else {
          a.pos.addScaledVector(to, a.speed * speed * dt);
          a.pos.y = Math.abs(Math.sin(t * (this.scanActive ? 16 : 9) + a.phase)) * (this.scanActive ? .45 : .18);
          a.group.rotation.y = Math.atan2(to.x, to.z);
          
          if (this.scanActive && a.panicking) {
            const escapeWave = Math.sin(t * 25 + a.phase);
            a.group.rotation.z = escapeWave * .45 * a.panicking;
            a.group.rotation.x = Math.cos(t * 20 + a.phase) * .25 * a.panicking;
            a.panicking = Math.max(0, a.panicking - dt * 1.2);
            a.label.classList.toggle('escaping', a.panicking > .12);
          } else {
            if (!a.escapeAction) {
              a.group.rotation.z = 0;
              a.group.rotation.x = 0;
            }
            a.label.classList.remove('escaping');
          }
        }
        
        a.group.position.copy(a.pos);
      }
      
      const limbSpeed = this.scanActive ? 20 : 10;
      const sw = Math.sin(t * limbSpeed + a.phase) * .85;
      a.limbs.forEach((l, i) => l.rotation.x = (i % 2 ? 1 : -1) * sw);
    });
    
    if (this.abducting) {
      const elapsed = t - this.abducting.start;
      const p = abductionProgress(elapsed);
      
      if (elapsed > .65) {
        const a = this.abducting.actor;
        a.abduct = true;
        a.pos.lerp(new T.Vector3(this.ufo.position.x, this.ufo.position.y - 1, this.ufo.position.z), Math.min(1, dt * 3.8));
        a.pos.y += dt * 3.6;
        a.group.position.copy(a.pos);
        a.group.rotation.y += dt * 7;
      }
      
      if (p >= 1) {
        this.abducting.actor.group.visible = false;
        this.abducting.actor.label.style.display = 'none';
        this.abducting = null;
        this.beamMat.opacity = .12;
      }
    }
    
    if (this.scanActive) {
      const blink = (Math.sin(t * 18) + 1) / 2;
      this.lights.forEach((light, i) => light.scale.setScalar(.8 + blink * (i % 2 ? 1.4 : .7)));
      this.sideBeams.forEach((beam, i) => {
        beam.material.opacity = .08 + blink * (.15 + this.scanPulse * .18);
        beam.rotation.y = t * (i ? -.8 : .8);
      });
      this.rimMat.emissiveIntensity = 1.2 + blink * (2.2 + this.scanPulse * 1.5);
      
      if (this.huntingPhase === 'lock') {
        this.beamRings.forEach((ring, i) => {
          const phase = (t * 3 + i * 0.5) % 2;
          ring.material.opacity = Math.max(0, 1 - phase) * .6;
          ring.position.y = -3 - phase * 8;
        });
      }
    } else {
      this.ufoTarget.set(Math.sin(t * .55) * 9, 12 + Math.sin(t * 1.4) * .5, Math.cos(t * .4) * 7);
      this.rimMat.emissiveIntensity = 1.1;
      this.beamRings.forEach(ring => ring.material.opacity = 0);
    }
    
    this.ufo.position.lerp(this.ufoTarget, dt * 2.5);
    this.ufo.rotation.y += dt * .35;
    this.planet.rotation.y += dt * .08;
    this.stars.rotation.y += dt * .015;
    
    const targetRadius = this.slowMo ? (this.targetCameraRadius || 22) : this.baseCameraRadius;
    this.orbit.radius += (targetRadius - this.orbit.radius) * dt * 4;
    
    if (this.cameraMode === 'follow') {
      this.camera.position.set(this.ufo.position.x + Math.cos(t * .4) * 15, this.ufo.position.y + 8, this.ufo.position.z + Math.sin(t * .4) * 15);
      this.camera.lookAt(this.ufo.position);
    } else if (this.cameraMode === 'street' && this.lockTarget) {
      const target = this.lockTarget;
      this.camera.position.set(target.pos.x + 8, target.pos.y + 3, target.pos.z + 8);
      this.camera.lookAt(target.pos);
    } else {
      const x = Math.sin(this.orbit.theta) * Math.sin(this.orbit.phi) * this.orbit.radius;
      const y = Math.cos(this.orbit.phi) * this.orbit.radius;
      const z = Math.cos(this.orbit.theta) * Math.sin(this.orbit.phi) * this.orbit.radius;
      this.camera.position.set(x, y, z);
      this.camera.lookAt(0, 3, 0);
    }
    
    this.updateLabels();
    this.renderer.render(this.scene, this.camera);
  }

  updateLabels() {
    const v = new this.T.Vector3();
    const w = this.mount.clientWidth;
    const h = this.mount.clientHeight;
    
    this.students.forEach(a => {
      if (a.abduct || !a.group.visible) return;
      v.copy(a.group.position);
      v.y += 2.6;
      v.project(this.camera);
      
      if (v.z > 1) {
        a.label.style.display = 'none';
        return;
      }
      
      a.label.style.display = 'block';
      a.label.style.left = `${(v.x * .5 + .5) * w}px`;
      a.label.style.top = `${(-v.y * .5 + .5) * h}px`;
      a.label.classList.toggle('targeted', a.name === this.activeName);
    });
  }
}
