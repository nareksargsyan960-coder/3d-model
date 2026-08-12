/**
 * CADORO — procedural jewelry viewer
 * ---------------------------------------------------------------------------
 * A single three.js scene factory shared by all three design variants. Every
 * piece of jewellery is generated in code (no .glb assets), so the viewer works
 * from a plain static file server with nothing but CDN modules.
 *
 * Usage:
 *   import { createJewelryViewer, METALS, MODELS } from '../shared/jewelry-3d.js';
 *   const viewer = createJewelryViewer(canvasEl, { wireColor: 0xd4af37 });
 *   viewer.setMetal('rose'); viewer.setWireframe(true); viewer.setModel('signet');
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { METALS } from './site-data.js';

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                   */
/* -------------------------------------------------------------------------- */

export { METALS };

export const MODELS = {
  solitaire: { label: 'Solitaire Ring', specs: '4-prong · 1.20 ct · 1.9 mm band' },
  eternity:  { label: 'Eternity Band',  specs: '24 stones · shared prong · 2.4 mm' },
  signet:    { label: 'Signet Ring',    specs: 'oval face · 13 × 11 mm · bevelled' },
  pendant:   { label: 'Halo Pendant',   specs: '18 stone halo · 1.4 mm bail' },
};

/* -------------------------------------------------------------------------- */
/* Geometry helpers                                                            */
/* -------------------------------------------------------------------------- */

const UP = new THREE.Vector3(0, 1, 0);

/** Round-brilliant silhouette: truncated-cone crown welded to a pavilion cone. */
function gemGeometry(r, seg) {
  const crown = new THREE.CylinderGeometry(r * 0.52, r, r * 0.40, seg, 1);
  crown.translate(0, r * 0.20, 0);
  const pavilion = new THREE.ConeGeometry(r, r * 0.92, seg, 1);
  pavilion.rotateX(Math.PI);          // apex points down
  pavilion.translate(0, -r * 0.46, 0); // girdle sits on y = 0
  const merged = mergeGeometries([crown, pavilion], false);
  merged.computeVertexNormals();
  return merged;
}

/**
 * Lays small stones over the outer face of a band that lives in the XY plane.
 * Returns an InstancedMesh so a 24-stone eternity band stays one draw call.
 */
function paveRing({ count, from, to, ringRadius, tube, stoneR, seg, material, seat }) {
  const geo = gemGeometry(stoneR, seg);
  const mesh = new THREE.InstancedMesh(geo, material, count);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const pos = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const scl = new THREE.Vector3(1, 1, 1);
  const span = to - from;
  // Seat the girdle level with the metal surface so the crown stands proud —
  // stones placed at the tube centre would be swallowed by the band.
  const radius = seat != null ? seat : ringRadius + tube;

  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const a = from + span * t;
    dir.set(Math.cos(a), Math.sin(a), 0);
    pos.copy(dir).multiplyScalar(radius);
    q.setFromUnitVectors(UP, dir);
    m.compose(pos, q, scl);
    mesh.setMatrixAt(i, m);
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  return mesh;
}

/* -------------------------------------------------------------------------- */
/* Models — each returns a Group of meshes tagged metal / gem                   */
/* -------------------------------------------------------------------------- */

/** A torus flattened front-to-back, which reads as a band rather than a donut. */
function bandGeometry(R, tube, width, q) {
  const geo = new THREE.TorusGeometry(R, tube, q.rs, q.ts);
  geo.scale(1, 1, width);
  return geo;
}

function buildSolitaire(ctx) {
  const { q, metal, gem } = ctx;
  const g = new THREE.Group();
  const R = 1, tube = 0.105;

  g.add(tag(new THREE.Mesh(bandGeometry(R, tube, 0.78, q), metal), 'metal'));

  // basket under the stone
  const basket = new THREE.CylinderGeometry(0.155, 0.085, 0.17, 20);
  basket.translate(0, R + 0.075, 0);
  g.add(tag(new THREE.Mesh(basket, metal), 'metal'));

  const gemR = 0.25;
  const gemY = R + 0.17 + gemR * 0.46;
  const stone = tag(new THREE.Mesh(gemGeometry(gemR, q.gemSeg), gem), 'gem');
  stone.position.y = gemY;
  g.add(stone);

  // four claws hugging the girdle
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const claw = new THREE.CylinderGeometry(0.019, 0.032, 0.34, 10);
    const mesh = tag(new THREE.Mesh(claw, metal), 'metal');
    mesh.position.set(Math.cos(a) * gemR * 0.94, gemY + 0.03, Math.sin(a) * gemR * 0.94);
    mesh.rotation.z = -Math.cos(a) * 0.2;
    mesh.rotation.x = Math.sin(a) * 0.2;
    g.add(mesh);
  }

  // pavé running down both shoulders
  const half = Math.PI / 2;
  g.add(tag(paveRing({
    count: 9, from: half + 0.34, to: half + 1.28,
    ringRadius: R, tube, stoneR: 0.042, seg: q.paveSeg, material: gem,
  }), 'gem'));
  g.add(tag(paveRing({
    count: 9, from: half - 0.34, to: half - 1.28,
    ringRadius: R, tube, stoneR: 0.042, seg: q.paveSeg, material: gem,
  }), 'gem'));

  return g;
}

function buildEternity(ctx) {
  const { q, metal, gem } = ctx;
  const g = new THREE.Group();
  const R = 1, tube = 0.105, width = 1.9;

  g.add(tag(new THREE.Mesh(bandGeometry(R, tube, width, q), metal), 'metal'));

  // two rails either side of the stone channel
  for (const z of [-1, 1]) {
    const rail = new THREE.TorusGeometry(R + tube * 0.34, 0.026, 10, q.ts);
    rail.translate(0, 0, z * tube * width * 0.74);
    g.add(tag(new THREE.Mesh(rail, metal), 'metal'));
  }

  const stones = tag(paveRing({
    count: 24, from: 0, to: Math.PI * 2 * (23 / 24),
    ringRadius: R, tube, stoneR: 0.098, seg: q.paveSeg, material: gem,
  }), 'gem');
  g.add(stones);

  return g;
}

function buildSignet(ctx) {
  const { q, metal } = ctx;
  const g = new THREE.Group();
  const R = 1, tube = 0.105;

  g.add(tag(new THREE.Mesh(bandGeometry(R, tube, 1.0, q), metal), 'metal'));

  // tapered oval face
  const face = new THREE.CylinderGeometry(0.40, 0.50, 0.21, 44);
  face.scale(1.24, 1, 1);
  face.translate(0, R + 0.03, 0);
  g.add(tag(new THREE.Mesh(face, metal), 'metal'));

  // bevelled rim sunk into the face
  const rim = new THREE.TorusGeometry(0.31, 0.026, 10, 48);
  rim.rotateX(Math.PI / 2);
  rim.scale(1.24, 1, 1);
  rim.translate(0, R + 0.135, 0);
  g.add(tag(new THREE.Mesh(rim, metal), 'metal'));

  // raised monogram bar
  const bar = new THREE.BoxGeometry(0.30, 0.035, 0.055);
  bar.translate(0, R + 0.148, 0);
  g.add(tag(new THREE.Mesh(bar, metal), 'metal'));

  // shoulders swelling into the face
  for (const s of [-1, 1]) {
    const sh = new THREE.SphereGeometry(0.16, 20, 14);
    sh.scale(1, 0.75, 0.62);
    sh.translate(s * 0.42, R - 0.20, 0);
    g.add(tag(new THREE.Mesh(sh, metal), 'metal'));
  }

  return g;
}

function buildPendant(ctx) {
  const { q, metal, gem } = ctx;
  const g = new THREE.Group();
  const gemR = 0.46;

  // centre stone laid face-on to the camera
  const stone = tag(new THREE.Mesh(gemGeometry(gemR, q.gemSeg), gem), 'gem');
  stone.rotation.x = -Math.PI / 2;
  g.add(stone);

  // bezel + halo sit in the XY plane around it
  const bezel = new THREE.TorusGeometry(gemR * 1.02, 0.032, 12, 56);
  g.add(tag(new THREE.Mesh(bezel, metal), 'metal'));

  const halo = tag(paveRing({
    count: 18, from: 0, to: Math.PI * 2 * (17 / 18),
    ringRadius: gemR * 1.06, tube: 0.14, stoneR: 0.062, seg: q.paveSeg, material: gem,
  }), 'gem');
  halo.rotation.z = 0;
  // point the halo stones at the camera rather than radially outwards
  reorientTowards(halo, 18);
  g.add(halo);

  const outerRail = new THREE.TorusGeometry(gemR * 1.30, 0.024, 10, 64);
  g.add(tag(new THREE.Mesh(outerRail, metal), 'metal'));

  // bail
  const bail = new THREE.TorusGeometry(0.10, 0.030, 12, 32);
  bail.translate(0, gemR * 1.30 + 0.09, 0);
  g.add(tag(new THREE.Mesh(bail, metal), 'metal'));

  // a connector welding the bail to the outer rail
  const link = new THREE.CylinderGeometry(0.026, 0.026, 0.10, 12);
  link.translate(0, gemR * 1.30 + 0.01, 0);
  g.add(tag(new THREE.Mesh(link, metal), 'metal'));

  return g;
}

/** Re-lays an instanced halo so each stone points along +Z (towards the viewer). */
function reorientTowards(instanced, count) {
  const m = new THREE.Matrix4();
  const pos = new THREE.Vector3();
  const q = new THREE.Quaternion().setFromUnitVectors(UP, new THREE.Vector3(0, 0, 1));
  const scl = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < count; i++) {
    instanced.getMatrixAt(i, m);
    pos.setFromMatrixPosition(m);
    pos.z = 0.06;
    m.compose(pos, q, scl);
    instanced.setMatrixAt(i, m);
  }
  instanced.instanceMatrix.needsUpdate = true;
}

const BUILDERS = {
  solitaire: buildSolitaire,
  eternity: buildEternity,
  signet: buildSignet,
  pendant: buildPendant,
};

function tag(mesh, kind) {
  mesh.userData.kind = kind;
  mesh.userData.solidMaterial = mesh.material;
  return mesh;
}

/**
 * Centres a group on the origin, normalises it to a consistent on-screen size,
 * and reports the bounding-sphere radius the camera has to clear.
 */
function frame(group, target) {
  const box = new THREE.Box3().setFromObject(group);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = target / Math.max(size.x, size.y, size.z);
  group.scale.setScalar(scale);
  group.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  return sphere.radius * scale;
}

/* -------------------------------------------------------------------------- */
/* Viewer                                                                      */
/* -------------------------------------------------------------------------- */

export function isWebGLAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) {
    return false;
  }
}

export function createJewelryViewer(canvas, options = {}) {
  const opts = Object.assign({
    model: 'solitaire',
    metal: 'yellow',
    wireframe: false,
    wireColor: 0xd4af37,
    background: null,      // null keeps the canvas transparent
    exposure: 1.0,
    autoRotate: true,
    autoRotateSpeed: 1.1,
    grid: false,           // CAD-style floor grid (V3)
    fitMargin: 1.16,       // >1 leaves breathing room around the piece
  }, options);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const lowPower = coarse || window.innerWidth < 720;

  // Quality budget: phones get fewer segments and a cheaper gem shader.
  const q = lowPower
    ? { rs: 14, ts: 56, gemSeg: 12, paveSeg: 8, transmission: false }
    : { rs: 20, ts: 96, gemSeg: 20, paveSeg: 12, transmission: true };

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: opts.background === null,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure;

  const scene = new THREE.Scene();
  if (opts.background !== null) scene.background = new THREE.Color(opts.background);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  // Three-quarter view — a ring shot straight on is just a circle.
  camera.position.set(0.464, 0.375, 0.803).setLength(4);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minPolarAngle = Math.PI * 0.12;
  controls.maxPolarAngle = Math.PI * 0.88;
  controls.autoRotate = opts.autoRotate && !reduceMotion;
  controls.autoRotateSpeed = opts.autoRotateSpeed;

  // Studio lighting from a procedural room — no HDRI file to download.
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;

  // A key light gives the metal a crisp highlight the room alone can't provide.
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(2.4, 3.2, 3.0);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.9);
  rim.position.set(-2.8, 1.4, -2.2);
  scene.add(rim);

  const metalMat = new THREE.MeshPhysicalMaterial({
    color: METALS[opts.metal].color,
    metalness: 1.0,
    roughness: METALS[opts.metal].roughness,
    envMapIntensity: 1.5,
  });

  const gemMat = q.transmission
    ? new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: 0, roughness: 0.03,
        transmission: 1, thickness: 0.45, ior: 2.4,
        envMapIntensity: 2.6, clearcoat: 1, clearcoatRoughness: 0.02,
        flatShading: true,
      })
    : new THREE.MeshPhysicalMaterial({
        color: 0xeef2ff, metalness: 0.1, roughness: 0.05,
        envMapIntensity: 3.2, clearcoat: 1, flatShading: true,
      });

  const wireMat = new THREE.MeshBasicMaterial({
    color: opts.wireColor, wireframe: true, transparent: true, opacity: 0.55,
  });

  let grid = null;
  if (opts.grid) {
    grid = new THREE.GridHelper(8, 16, opts.wireColor, opts.wireColor);
    grid.position.y = -1.4;
    grid.material.transparent = true;
    grid.material.opacity = 0.16;
    scene.add(grid);
  }

  const root = new THREE.Group();
  scene.add(root);

  let current = null;
  let wireframe = opts.wireframe;
  let gemsVisible = true;
  let modelKey = opts.model;
  let objectRadius = 1.4;

  /** Pulls the camera back far enough that the piece clears both screen axes. */
  function fitCamera() {
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const dist = Math.max(
      objectRadius / Math.sin(vFov / 2),
      objectRadius / Math.sin(hFov / 2),
    ) * opts.fitMargin;
    camera.position.setLength(dist);
    controls.minDistance = dist * 0.55;
    controls.maxDistance = dist * 2.2;
    controls.update();
  }

  function disposeGroup(group) {
    group.traverse((o) => {
      if (o.isMesh || o.isInstancedMesh) o.geometry.dispose();
    });
  }

  function applyMaterials() {
    root.traverse((o) => {
      if (!o.userData.kind) return;
      const solid = o.userData.kind === 'gem' ? gemMat : metalMat;
      o.material = wireframe ? wireMat : solid;
      if (o.userData.kind === 'gem') o.visible = gemsVisible;
    });
  }

  function setModel(key) {
    if (!BUILDERS[key]) return;
    modelKey = key;
    if (current) { root.remove(current); disposeGroup(current); }
    current = BUILDERS[key]({ q, metal: metalMat, gem: gemMat });
    objectRadius = frame(current, 2.4);
    root.add(current);
    applyMaterials();
    fitCamera();
  }

  function setMetal(key) {
    const m = METALS[key];
    if (!m) return;
    metalMat.color.setHex(m.color);
    metalMat.roughness = m.roughness;
  }

  function setWireframe(on) {
    wireframe = !!on;
    applyMaterials();
  }

  function setGems(on) {
    gemsVisible = !!on;
    applyMaterials();
  }

  function setAutoRotate(on) {
    controls.autoRotate = !!on && !reduceMotion;
  }

  setModel(modelKey);
  setWireframe(wireframe);

  /* -- sizing -------------------------------------------------------------- */

  function resize() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    if (canvas.width === w && canvas.height === h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    fitCamera();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* -- render loop, paused whenever the canvas is off-screen ---------------- */

  let onScreen = true;
  let running = false;

  function tick() {
    controls.update();
    renderer.render(scene, camera);
  }

  function start() {
    if (running) return;
    running = true;
    renderer.setAnimationLoop(tick);
  }

  function stop() {
    if (!running) return;
    running = false;
    renderer.setAnimationLoop(null);
  }

  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen && !document.hidden) start(); else stop();
  }, { threshold: 0.01 });
  io.observe(canvas);

  const onVisibility = () => {
    if (!document.hidden && onScreen) start(); else stop();
  };
  document.addEventListener('visibilitychange', onVisibility);

  function dispose() {
    stop();
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    if (current) disposeGroup(current);
    controls.dispose();
    envRT.dispose();
    pmrem.dispose();
    metalMat.dispose();
    gemMat.dispose();
    wireMat.dispose();
    renderer.dispose();
  }

  return {
    setModel, setMetal, setWireframe, setGems, setAutoRotate,
    resize, dispose, start, stop,
    get model() { return modelKey; },
    get wireframe() { return wireframe; },
    renderer, scene, camera, controls,
  };
}
