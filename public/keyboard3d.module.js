// 3D Keyboard - Embeddable Module (No Blur)
// Usage:
// <div id="kb" style="width:800px;height:500px"></div>
// <script type="module" src="/keyboard3d.module.js"></script>
// <script type="module">
//   window.createKeyboard3D('#kb', { background: '#0b0e12' });
// </script>

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'https://unpkg.com/three-stdlib@2.29.5/geometries/RoundedBoxGeometry.js';

function createKeyboard3D(target, options = {}) {
  const opts = {
    background: '#0b0e12',
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    camera: { position: [1.8, 1.2, 2.2], fov: 40 },
    controls: { minDistance: 1.2, maxDistance: 5, enablePan: false },
    colors: {
      chassis: '#1a1d23',
      topPlate: '#111417',
      keycap: '#e9eef5',
    },
    ...options,
  };

  const container = typeof target === 'string' ? document.querySelector(target) : target;
  if (!container) throw new Error('createKeyboard3D: target element not found');

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(opts.pixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(new THREE.Color(opts.background), 1);
  container.appendChild(renderer.domElement);

  // Scene
  const scene = new THREE.Scene();
  scene.fog = null; // Ensure no atmospheric blur

  // Camera
  const aspect = container.clientWidth / container.clientHeight;
  const camera = new THREE.PerspectiveCamera(opts.camera.fov, aspect, 0.1, 100);
  camera.position.set(...opts.camera.position);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = !!opts.controls.enablePan;
  controls.minDistance = opts.controls.minDistance;
  controls.maxDistance = opts.controls.maxDistance;

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(2.5, 5, 3);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  scene.add(keyLight);

  const fill1 = new THREE.DirectionalLight(0x88aaff, 0.4);
  fill1.position.set(-3, 2, -2);
  scene.add(fill1);

  const rim = new THREE.DirectionalLight(0xffddaa, 0.35);
  rim.position.set(0, 3, -4);
  scene.add(rim);

  // Materials
  const chassisMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(opts.colors.chassis),
    metalness: 0.2,
    roughness: 0.35,
  });
  const topPlateMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(opts.colors.topPlate),
    metalness: 0.1,
    roughness: 0.4,
  });
  const keyMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(opts.colors.keycap),
    metalness: 0.0,
    roughness: 0.5,
  });

  // Layout parameters
  const U = 0.19;          // 1u width
  const keyHeight = 0.06;  // key height
  const keyDepth = 0.18;   // front-to-back depth of 1u key
  const rowSpacing = 0.21;
  const hSpacing = 0.02;
  const bevelRadius = 0.015;

  const rows = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
    [1.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.25],
    [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
    [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.75],
    [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25],
  ];

  function computeTotalWidth() {
    const widest = Math.max(
      ...rows.map(row => row.reduce((sum, w) => sum + w * U + hSpacing, -hSpacing))
    );
    return widest + 0.16;
  }
  function computeTotalDepth() {
    return rows.length * rowSpacing + 0.16;
  }

  const totalWidth = computeTotalWidth();
  const totalDepth = computeTotalDepth();

  // Chassis
  const chassisGeo = new RoundedBoxGeometry(totalWidth, 0.06, totalDepth, 6, 0.03);
  const chassis = new THREE.Mesh(chassisGeo, chassisMaterial);
  chassis.position.set(0, 0.02, 0);
  scene.add(chassis);

  // Top plate
  const topPlateGeo = new RoundedBoxGeometry(totalWidth - 0.08, 0.01, totalDepth - 0.08, 6, 0.02);
  const topPlate = new THREE.Mesh(topPlateGeo, topPlateMaterial);
  topPlate.position.set(0, 0.055, 0);
  scene.add(topPlate);

  // Keys
  let zStart = (rows.length - 1) * rowSpacing * 0.5;
  rows.forEach((row) => {
    const rowWidth = row.reduce((sum, w) => sum + w * U + hSpacing, -hSpacing);
    let xStart = -rowWidth / 2;
    row.forEach((w) => {
      const wMeters = w * U;
      const keyGeo = new RoundedBoxGeometry(
        wMeters,
        keyHeight,
        keyDepth,
        5,
        Math.min(bevelRadius, Math.min(wMeters, keyDepth) / 4)
      );
      const keyMesh = new THREE.Mesh(keyGeo, keyMaterial);
      keyMesh.position.set(xStart + wMeters / 2, keyHeight / 2 + 0.025, zStart);
      scene.add(keyMesh);
      xStart += wMeters + hSpacing;
    });
    zStart -= rowSpacing;
  });

  // Optional floor to catch light (kept same color as background)
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(opts.background), metalness: 0, roughness: 1 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  scene.add(floor);

  // Resize handler
  function onResize() {
    const { clientWidth, clientHeight } = container;
    renderer.setSize(clientWidth, clientHeight);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  // Render loop
  let rafId;
  function animate() {
    controls.update();
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }
  animate();

  // Return a simple API for cleanup and access
  return {
    scene, camera, renderer, controls,
    dispose: () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    }
  };
}

// Expose globally for easy embedding
window.createKeyboard3D = createKeyboard3D;

// Auto-init if dev adds data-keyboard3d attribute
// <div data-keyboard3d style="width:800px;height:500px"></div>
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-keyboard3d]').forEach((el) => {
      if (!el.__keyboard3d) {
        el.__keyboard3d = window.createKeyboard3D(el);
      }
    });
  });
}
