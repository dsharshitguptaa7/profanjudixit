import * as THREE from 'three';

/**
 * World-Class Quantum & Condensed Matter Hero Visualization
 * Features:
 * - Dynamic 3D Perovskite Supercell Lattice with core & glow nodes
 * - Luminous chemical bonds with pulsating charge wave packets
 * - Orbiting electron probability waves with quantum carrier particles
 * - Undulating quantum potential surface (phonon wave simulation)
 * - Inertial mouse & touch parallax with cinematic depth of field
 * - Performance-optimized (capped DPR, tab visibility throttle, reduced motion support)
 */
export function initHeroScene(canvasContainer) {
  if (!canvasContainer) return null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // WebGL support test
  const testCanvas = document.createElement('canvas');
  const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
  if (!gl) {
    canvasContainer.innerHTML = `
      <div class="webgl-fallback">
        <div class="fallback-glow"></div>
        <p class="fallback-text">Quantum Field Simulation (High-Performance Mode)</p>
      </div>`;
    return null;
  }

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05080D, 0.038);

  const width = canvasContainer.clientWidth || window.innerWidth;
  const height = canvasContainer.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 1.2, 16);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  canvasContainer.appendChild(renderer.domElement);

  // Main interactive transform group
  const worldGroup = new THREE.Group();
  scene.add(worldGroup);

  // Group for the floating crystal lattice - centered as subtle background element
  const latticeGroup = new THREE.Group();
  latticeGroup.position.set(0, 0.25, -2.2);
  worldGroup.add(latticeGroup);

  // 1. DUAL-LAYER ATOMIC NODES (Scale reduced ~30% for elegant typography harmony)
  const isMobile = window.innerWidth < 768;
  const gridSize = 3; // 3x3x3 focused perovskite core
  const spacing = 1.45; // Compact spacing (reduced from 2.1)
  const startOffset = -((gridSize - 1) * spacing) / 2;

  // Refined, delicate atom node geometries
  const coreBaGeo = new THREE.SphereGeometry(0.095, 20, 20);
  const glowBaGeo = new THREE.SphereGeometry(0.16, 16, 16);
  const coreTiGeo = new THREE.SphereGeometry(0.125, 20, 20);
  const glowTiGeo = new THREE.SphereGeometry(0.20, 16, 16);

  const baCoreMat = new THREE.MeshStandardMaterial({
    color: 0x56D9FF,
    roughness: 0.18,
    metalness: 0.85,
    emissive: 0x0E5C8A,
    emissiveIntensity: 0.65
  });

  const baGlowMat = new THREE.MeshBasicMaterial({
    color: 0x56D9FF,
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending,
    wireframe: true
  });

  const tiCoreMat = new THREE.MeshStandardMaterial({
    color: 0xC084FC,
    roughness: 0.18,
    metalness: 0.85,
    emissive: 0x6B21A8,
    emissiveIntensity: 0.75
  });

  const tiGlowMat = new THREE.MeshBasicMaterial({
    color: 0xA78BFA,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    wireframe: true
  });

  const atomNodes = [];

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        const isBsite = (x === 1 && y === 1 && z === 1); // Center Ti cation
        const posX = startOffset + x * spacing;
        const posY = startOffset + y * spacing;
        const posZ = startOffset + z * spacing;

        const nodeContainer = new THREE.Group();
        nodeContainer.position.set(posX, posY, posZ);

        if (isBsite) {
          const core = new THREE.Mesh(coreTiGeo, tiCoreMat);
          const glow = new THREE.Mesh(glowTiGeo, tiGlowMat);
          nodeContainer.add(core, glow);
        } else {
          const core = new THREE.Mesh(coreBaGeo, baCoreMat);
          const glow = new THREE.Mesh(glowBaGeo, baGlowMat);
          nodeContainer.add(core, glow);
        }

        latticeGroup.add(nodeContainer);
        atomNodes.push({
          group: nodeContainer,
          baseY: posY,
          phase: (x * 0.5 + y * 0.7 + z * 0.3)
        });
      }
    }
  }

  // 2. CRYSTALLINE BONDS WITH SUBTLE ADDITIVE GLOW
  const bondMaterial = new THREE.LineBasicMaterial({
    color: 0x38BDF8,
    transparent: true,
    opacity: 0.24,
    blending: THREE.AdditiveBlending
  });

  const bondPoints = [];
  for (let i = 0; i < atomNodes.length; i++) {
    for (let j = i + 1; j < atomNodes.length; j++) {
      const p1 = atomNodes[i].group.position;
      const p2 = atomNodes[j].group.position;
      const dist = p1.distanceTo(p2);
      if (Math.abs(dist - spacing) < 0.10) {
        bondPoints.push(p1);
        bondPoints.push(p2);
      }
    }
  }

  const bondGeometry = new THREE.BufferGeometry().setFromPoints(bondPoints);
  const bondLines = new THREE.LineSegments(bondGeometry, bondMaterial);
  latticeGroup.add(bondLines);

  // 3. PULSATING CHARGE PACKETS
  const packetCount = isMobile ? 8 : 16;
  const packetGeo = new THREE.SphereGeometry(0.045, 12, 12);
  const packetMat = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    blending: THREE.AdditiveBlending
  });

  const chargePackets = [];
  for (let p = 0; p < packetCount; p++) {
    const mesh = new THREE.Mesh(packetGeo, packetMat);
    const startIdx = Math.floor(Math.random() * (atomNodes.length - 1));
    mesh.position.copy(atomNodes[startIdx].group.position);
    latticeGroup.add(mesh);
    chargePackets.push({
      mesh,
      currentPos: atomNodes[startIdx].group.position.clone(),
      targetPos: atomNodes[(startIdx + 1) % atomNodes.length].group.position.clone(),
      progress: Math.random(),
      speed: 0.007 + Math.random() * 0.010
    });
  }

  // 4. SECONDARY QUANTUM ORBITALS - Restrained, non-intrusive opacity
  const orbitalGroup = new THREE.Group();
  worldGroup.add(orbitalGroup);

  const orbitalConfigs = [
    { radius: 4.8, tube: 0.012, color: 0x56D9FF, rotX: 0.5, rotY: 0.4, speed: 0.002 },
    { radius: 6.2, tube: 0.010, color: 0xA78BFA, rotX: -0.9, rotY: 0.6, speed: -0.0016 },
    { radius: 7.6, tube: 0.008, color: 0x38BDF8, rotX: 1.2, rotY: -0.7, speed: 0.0014 }
  ];

  const orbitals = orbitalConfigs.map(cfg => {
    const geom = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 120);
    const mat = new THREE.MeshBasicMaterial({
      color: cfg.color,
      transparent: true,
      opacity: 0.16, // Reduced opacity so it never obstructs text
      blending: THREE.AdditiveBlending
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.rotation.x = cfg.rotX;
    mesh.rotation.y = cfg.rotY;
    orbitalGroup.add(mesh);
    return { mesh, cfg };
  });

  // 5. RESTRAINED PHONON GRID - Lowered contrast and coverage
  const planeSize = 18;
  const planeSegments = isMobile ? 24 : 36;
  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize, planeSegments, planeSegments);
  planeGeo.rotateX(-Math.PI / 2);
  planeGeo.translate(0, -5.6, -2);

  const planeMat = new THREE.MeshBasicMaterial({
    color: 0x1E3A5F,
    wireframe: true,
    transparent: true,
    opacity: 0.09, // Subdued grid contrast
    blending: THREE.AdditiveBlending
  });

  const phononGrid = new THREE.Mesh(planeGeo, planeMat);
  worldGroup.add(phononGrid);

  const planePosAttr = planeGeo.attributes.position;
  const planeBaseY = new Float32Array(planePosAttr.count);
  for (let i = 0; i < planePosAttr.count; i++) {
    planeBaseY[i] = planePosAttr.getY(i);
  }

  // 6. AMBIENT CARRIER PARTICLES
  const particleCount = isMobile ? 100 : 220;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particlePhases = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const r = 3 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = r * Math.cos(phi);
    particlePhases[i] = Math.random() * Math.PI * 2;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x56D9FF,
    size: isMobile ? 0.06 : 0.05,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  worldGroup.add(particleSystem);

  // 7. RESTRAINED CINEMATIC LIGHTING
  const ambientLight = new THREE.AmbientLight(0x0A1424, 1.8);
  scene.add(ambientLight);

  const cyanKeyLight = new THREE.PointLight(0x56D9FF, 2.4, 25);
  cyanKeyLight.position.set(7, 6, 8);
  scene.add(cyanKeyLight);

  const violetRimLight = new THREE.PointLight(0xA78BFA, 2.0, 25);
  violetRimLight.position.set(-8, -4, 6);
  scene.add(violetRimLight);

  // 8. INTERACTIVE CURSOR PARALLAX (Smooth Damped Easing)
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const onMouseMove = (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Touch Support
  const onTouchMove = (e) => {
    if (e.touches.length > 0) {
      mouse.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  };
  window.addEventListener('touchmove', onTouchMove, { passive: true });

  // Handle Resize
  const onResize = () => {
    if (!canvasContainer) return;
    const w = canvasContainer.clientWidth;
    const h = canvasContainer.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };
  window.addEventListener('resize', onResize);

  // Tab Visibility Throttling
  let isPageVisible = !document.hidden;
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
  });

  // ANIMATION LOOP
  let animationFrameId;
  let clock = new THREE.Clock();

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    if (!isPageVisible) return;

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      // Easing mouse coords
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Rotate lattice group continuously with parallax influence
      latticeGroup.rotation.y = elapsedTime * 0.09 + mouse.x * 0.4;
      latticeGroup.rotation.x = 0.18 + mouse.y * 0.25;

      // Orbitals rotation
      orbitals.forEach(({ mesh, cfg }) => {
        mesh.rotation.z += cfg.speed;
        mesh.rotation.x = cfg.rotX + mouse.y * 0.15;
        mesh.rotation.y = cfg.rotY + mouse.x * 0.15;
      });

      // Quantum thermal lattice vibration
      for (let i = 0; i < atomNodes.length; i++) {
        const item = atomNodes[i];
        item.group.position.y = item.baseY + Math.sin(elapsedTime * 2.4 + item.phase) * 0.05;
      }

      // Charge packet transport
      for (let p = 0; p < chargePackets.length; p++) {
        const pkt = chargePackets[p];
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1.0) {
          pkt.progress = 0;
          pkt.currentPos.copy(pkt.targetPos);
          const nextIdx = Math.floor(Math.random() * atomNodes.length);
          pkt.targetPos.copy(atomNodes[nextIdx].group.position);
        }
        pkt.mesh.position.lerpVectors(pkt.currentPos, pkt.targetPos, pkt.progress);
      }

      // Undulating Phonon Wave Grid
      const positions = planePosAttr.array;
      for (let i = 0; i < planePosAttr.count; i++) {
        const vx = planePosAttr.getX(i);
        const vz = planePosAttr.getZ(i);
        const wave = Math.sin(vx * 0.35 + elapsedTime * 1.5) * Math.cos(vz * 0.35 + elapsedTime * 1.2) * 0.35;
        positions[i * 3 + 1] = planeBaseY[i] + wave;
      }
      planePosAttr.needsUpdate = true;

      // Particle system gentle oscillation
      const pPositions = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pPositions[i * 3 + 1] += Math.sin(elapsedTime + particlePhases[i]) * 0.003;
      }
      particleGeo.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  animate();

  return {
    cleanup: () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
  };
}
