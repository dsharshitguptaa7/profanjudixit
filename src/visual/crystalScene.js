import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Robust, World-Class Interactive BaTiO₃ Perovskite Crystal Inspector
 * Includes:
 * 1. Three.js WebGL 3D Real-Time Visualizer with OrbitControls & Raycaster
 * 2. 2D Canvas Fallback if WebGL is unavailable
 * 3. Upper-Right Electric Dipole & Polarization Vector 2D Schematic
 * 4. ResizeObserver for dynamic, zero-dimension resilient layout
 */

function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export function initCrystalScene(containerEl, infoPanelEl) {
  if (!containerEl) return null;

  // Initialize the Upper-Right 2D Polarization Schematic
  const dipoleCanvas = document.getElementById('dipole-canvas');
  const schematicController = initDipoleSchematic(dipoleCanvas);

  // If WebGL is not supported, initialize the 2D interactive projected fallback
  if (!checkWebGLSupport()) {
    return initCanvas2DFallback(containerEl, schematicController);
  }

  try {
    return initWebGLCrystal(containerEl, schematicController);
  } catch (err) {
    console.warn('WebGL Initialization failed, falling back to 2D canvas:', err);
    return initCanvas2DFallback(containerEl, schematicController);
  }
}

/**
 * 1. WEBGL THREE.JS CRYSTAL IMPLEMENTATION
 */
function initWebGLCrystal(containerEl, schematicController) {
  // Clear any previous children
  containerEl.innerHTML = '';

  const rect = containerEl.getBoundingClientRect();
  const width = rect.width || containerEl.clientWidth || containerEl.parentElement.clientWidth || 700;
  const height = rect.height || containerEl.clientHeight || 560;

  // Scene & Camera
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05080D, 0.035);

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(6.2, 4.8, 8.4);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  containerEl.appendChild(renderer.domElement);

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.minDistance = 3.6;
  controls.maxDistance = 16.0;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;
  controls.target.set(0, 0, 0);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x0E1A2B, 2.2);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0x56D9FF, 3.5);
  keyLight.position.set(7, 9, 8);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xA78BFA, 2.8);
  fillLight.position.set(-8, -5, -6);
  scene.add(fillLight);

  const bottomLight = new THREE.DirectionalLight(0x38BDF8, 1.4);
  bottomLight.position.set(0, -8, 2);
  scene.add(bottomLight);

  // Unit Cell Group
  const unitCellGroup = new THREE.Group();
  scene.add(unitCellGroup);

  const a = 3.2;
  const halfA = a / 2;

  // State
  let isFerroelectric = false;
  let targetTiShift = 0.0;
  let currentTiShift = 0.0;
  let targetOShift = 0.0;
  let currentOShift = 0.0;
  let targetCaRatio = 1.0;
  let currentCaRatio = 1.0;

  // Materials
  const baMaterial = new THREE.MeshStandardMaterial({
    color: 0x56D9FF,
    roughness: 0.18,
    metalness: 0.85,
    emissive: 0x0E3B5C,
    emissiveIntensity: 0.55
  });

  const tiMaterial = new THREE.MeshStandardMaterial({
    color: 0xC084FC,
    roughness: 0.15,
    metalness: 0.85,
    emissive: 0x581C87,
    emissiveIntensity: 0.85
  });

  const oMaterial = new THREE.MeshStandardMaterial({
    color: 0xFB7185,
    roughness: 0.25,
    metalness: 0.45,
    emissive: 0x881337,
    emissiveIntensity: 0.45
  });

  const highlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.1,
    metalness: 0.95,
    emissive: 0x56D9FF,
    emissiveIntensity: 1.3
  });

  // Geometries
  const baGeo = new THREE.SphereGeometry(0.36, 32, 32);
  const tiGeo = new THREE.SphereGeometry(0.28, 32, 32);
  const oGeo = new THREE.SphereGeometry(0.22, 32, 32);

  const atoms = [];
  const raycastMeshes = [];

  function addAtom(geo, mat, pos, element, valence, role, wyckoff, coordNumber, description) {
    const mesh = new THREE.Mesh(geo, mat.clone());
    mesh.position.copy(pos);
    unitCellGroup.add(mesh);

    const atomData = {
      mesh,
      element,
      valence,
      role,
      wyckoff,
      coordNumber,
      description,
      originalPosition: pos.clone(),
      originalMaterial: mesh.material
    };
    mesh.userData = atomData;
    atoms.push(atomData);
    raycastMeshes.push(mesh);
    return atomData;
  }

  // 1. 8 Corner Ba²⁺ Atoms
  const cornerCoords = [
    [-halfA, -halfA, -halfA],
    [halfA, -halfA, -halfA],
    [-halfA, halfA, -halfA],
    [halfA, halfA, -halfA],
    [-halfA, -halfA, halfA],
    [halfA, -halfA, halfA],
    [-halfA, halfA, halfA],
    [halfA, halfA, halfA],
  ];

  cornerCoords.forEach(coord => {
    addAtom(
      baGeo,
      baMaterial,
      new THREE.Vector3(...coord),
      'Barium (Ba)',
      'Ba²⁺',
      'A-Site Vertex Ion',
      '1a (0, 0, 0)',
      '12 (Cuboctahedral)',
      'Large electropositive cation maintaining the perovskite lattice stability (Goldschmidt tolerance factor t ≈ 1.06). A-site can be substituted with Bi³⁺ or Sr²⁺ to tune the Curie point and suppress dielectric loss.'
    );
  });

  // 2. Central Ti⁴⁺ Atom
  const tiAtom = addAtom(
    tiGeo,
    tiMaterial,
    new THREE.Vector3(0, 0, 0),
    'Titanium (Ti)',
    'Ti⁴⁺',
    'B-Site Central Cation',
    '1b (½, ½, ½)',
    '6 (Octahedral)',
    'Small, highly charged transition metal cation centered in the TiO₆ oxygen cage. In the ferroelectric phase below Tc ≈ 120°C, Ti⁴⁺ shifts off-center by ~0.12 Å along the [001] c-axis, driving spontaneous ferroelectric polarization.'
  );

  // 3. 6 Face-Centered O²⁻ Atoms
  const faceCoords = [
    [0, 0, -halfA], // Back
    [0, 0, halfA],  // Front
    [0, -halfA, 0], // Bottom
    [0, halfA, 0],  // Top
    [-halfA, 0, 0], // Left
    [halfA, 0, 0],  // Right
  ];

  const oxygenAtoms = faceCoords.map(coord => {
    return addAtom(
      oGeo,
      oMaterial,
      new THREE.Vector3(...coord),
      'Oxygen (O)',
      'O²⁻',
      'Face-Centered Anion',
      '3c (0, ½, ½)',
      '6 (Coordination with 2 Ti + 4 Ba)',
      'Surrounds the central Ti⁴⁺ ion to form the TiO₆ octahedron. Under spontaneous symmetry breaking, the equatorial and apical oxygen atoms undergo hybridization changes with Ti 3d orbitals.'
    );
  });

  // 4. Bounding Box Frame Wireframe
  const boxGeo = new THREE.BoxGeometry(a, a, a);
  const boxEdges = new THREE.EdgesGeometry(boxGeo);
  const boxLineMat = new THREE.LineBasicMaterial({
    color: 0x56D9FF,
    transparent: true,
    opacity: 0.4
  });
  const boxFrame = new THREE.LineSegments(boxEdges, boxLineMat);
  unitCellGroup.add(boxFrame);

  // 5. Translucent TiO₆ Octahedron Mesh & Wireframe
  const octahedronGeometry = new THREE.BufferGeometry();
  const octaVerts = [
    // Top pyramid
    0, halfA, 0,    0, 0, -halfA,   halfA, 0, 0,
    0, halfA, 0,    halfA, 0, 0,    0, 0, halfA,
    0, halfA, 0,    0, 0, halfA,    -halfA, 0, 0,
    0, halfA, 0,    -halfA, 0, 0,   0, 0, -halfA,
    // Bottom pyramid
    0, -halfA, 0,   halfA, 0, 0,    0, 0, -halfA,
    0, -halfA, 0,   0, 0, halfA,    halfA, 0, 0,
    0, -halfA, 0,   -halfA, 0, 0,   0, 0, halfA,
    0, -halfA, 0,   0, 0, -halfA,   -halfA, 0, 0,
  ];
  octahedronGeometry.setAttribute('position', new THREE.Float32BufferAttribute(octaVerts, 3));
  octahedronGeometry.computeVertexNormals();

  const octaMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xA78BFA,
    transparent: true,
    opacity: 0.18,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.85,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const octaMesh = new THREE.Mesh(octahedronGeometry, octaMaterial);
  unitCellGroup.add(octaMesh);

  const octaEdges = new THREE.EdgesGeometry(octahedronGeometry);
  const octaEdgeMat = new THREE.LineBasicMaterial({
    color: 0xC084FC,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  const octaWireframe = new THREE.LineSegments(octaEdges, octaEdgeMat);
  unitCellGroup.add(octaWireframe);

  // 6. Ti - O Octahedral Bonds
  const bondGroup = new THREE.Group();
  unitCellGroup.add(bondGroup);

  const bondLineMat = new THREE.LineBasicMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });

  function updateBonds(tiY, oY) {
    while (bondGroup.children.length > 0) {
      bondGroup.remove(bondGroup.children[0]);
    }
    const currentTi = new THREE.Vector3(0, tiY, 0);

    oxygenAtoms.forEach(o => {
      const currentO = new THREE.Vector3(o.originalPosition.x, o.originalPosition.y + oY, o.originalPosition.z);
      const geom = new THREE.BufferGeometry().setFromPoints([currentTi, currentO]);
      const line = new THREE.Line(geom, bondLineMat);
      bondGroup.add(line);
    });
  }
  updateBonds(0, 0);

  // 7. Electric Dipole Moment Vector Arrow (P⃗)
  const arrowDirection = new THREE.Vector3(0, 1, 0);
  const arrowOrigin = new THREE.Vector3(0, -2.0, 0);
  const dipoleArrow = new THREE.ArrowHelper(arrowDirection, arrowOrigin, 4.0, 0x56D9FF, 0.65, 0.4);
  dipoleArrow.line.material.linewidth = 3;
  dipoleArrow.visible = false;
  unitCellGroup.add(dipoleArrow);

  // Curved Dipole Field Lines
  const dipoleFieldLinesGroup = new THREE.Group();
  for (let curveIdx = 0; curveIdx < 4; curveIdx++) {
    const angle = (curveIdx / 4) * Math.PI * 2;
    const rad = 2.4;
    const curvePoints = [];
    for (let t = 0; t <= 24; t++) {
      const u = t / 24;
      const py = THREE.MathUtils.lerp(2.0, -2.0, u);
      const pr = Math.sin(u * Math.PI) * rad;
      const px = Math.cos(angle) * pr;
      const pz = Math.sin(angle) * pr;
      curvePoints.push(new THREE.Vector3(px, py, pz));
    }
    const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMat = new THREE.LineBasicMaterial({
      color: 0x56D9FF,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const curveLine = new THREE.Line(curveGeo, curveMat);
    dipoleFieldLinesGroup.add(curveLine);
  }
  dipoleFieldLinesGroup.visible = false;
  unitCellGroup.add(dipoleFieldLinesGroup);

  // 8. Selection Highlight Ring
  const ringGeo = new THREE.RingGeometry(0.42, 0.46, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x56D9FF,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const highlightRing = new THREE.Mesh(ringGeo, ringMat);
  highlightRing.visible = false;
  scene.add(highlightRing);

  // Raycasting for Hover & Click
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let selectedAtom = null;

  function updateTelemetry(atomData) {
    const roleEl = document.getElementById('telemetry-role');
    const badgeEl = document.getElementById('telemetry-badge');
    const titleEl = document.getElementById('telemetry-title');
    const descEl = document.getElementById('telemetry-desc');
    const systemEl = document.getElementById('param-system');
    const paramAEl = document.getElementById('param-a');
    const paramCEl = document.getElementById('param-c');
    const paramCaEl = document.getElementById('param-ca');
    const paramPsEl = document.getElementById('param-ps');
    const tagEl = document.getElementById('schematic-tag');

    if (tagEl) {
      tagEl.textContent = isFerroelectric ? 'P4mm (Tetragonal)' : 'Pm3̄m (Cubic)';
    }

    if (!atomData) {
      if (roleEl) roleEl.textContent = 'Unit Cell Geometry';
      if (badgeEl) badgeEl.textContent = isFerroelectric ? 'P4mm (Polar)' : 'Perovskite ABO₃';
      if (titleEl) {
        titleEl.textContent = 'BaTiO₃ Unit Cell';
        titleEl.style.color = '#F4F6FA';
      }
      if (descEl) {
        descEl.textContent = 'Click or hover any atom node in the 3D crystal to inspect its crystallographic coordinates, ionic radius, and polarization role.';
      }
    } else {
      if (roleEl) roleEl.textContent = atomData.role;
      if (badgeEl) badgeEl.textContent = atomData.valence;
      if (titleEl) {
        titleEl.textContent = `${atomData.element} [${atomData.wyckoff}]`;
        titleEl.style.color = atomData.valence.startsWith('Ba') ? '#56D9FF' : atomData.valence.startsWith('Ti') ? '#C084FC' : '#FB7185';
      }
      if (descEl) {
        descEl.textContent = `${atomData.description} (Coordination: ${atomData.coordNumber})`;
      }
    }

    if (systemEl) systemEl.textContent = isFerroelectric ? 'Tetragonal (Polar Axis [001])' : 'Cubic (Centrosymmetric)';
    if (paramAEl) paramAEl.textContent = isFerroelectric ? '3.992 Å' : '4.008 Å';
    if (paramCEl) paramCEl.textContent = isFerroelectric ? '4.036 Å' : '4.008 Å';
    if (paramCaEl) paramCaEl.textContent = isFerroelectric ? '1.011 (Tetragonal Strain)' : '1.000 (c = a)';
    if (paramPsEl) paramPsEl.textContent = isFerroelectric ? '~26 µC/cm² (Along c-axis)' : '0 µC/cm² (Zero net dipole)';
  }
  updateTelemetry(null);

  function handleInteraction(clientX, clientY) {
    const rect = containerEl.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(raycastMeshes);

    if (intersects.length > 0) {
      containerEl.style.cursor = 'pointer';
      const intersectedMesh = intersects[0].object;
      if (selectedAtom !== intersectedMesh) {
        if (selectedAtom) selectedAtom.material = selectedAtom.userData.originalMaterial;
        selectedAtom = intersectedMesh;
        selectedAtom.material = highlightMaterial;
        updateTelemetry(selectedAtom.userData);

        highlightRing.visible = true;
        highlightRing.position.copy(selectedAtom.getWorldPosition(new THREE.Vector3()));
        highlightRing.lookAt(camera.position);
      }
    } else {
      containerEl.style.cursor = 'grab';
      if (selectedAtom) {
        selectedAtom.material = selectedAtom.userData.originalMaterial;
        selectedAtom = null;
        highlightRing.visible = false;
        updateTelemetry(null);
      }
    }
  }

  containerEl.addEventListener('mousemove', e => handleInteraction(e.clientX, e.clientY), { passive: true });
  containerEl.addEventListener('click', e => handleInteraction(e.clientX, e.clientY));

  // Mode Transition Function
  function setPolarizationMode(ferroelectric) {
    isFerroelectric = ferroelectric;
    if (ferroelectric) {
      targetTiShift = 0.38; // Upward shift along c
      targetOShift = -0.12; // Oxygen counter shift
      targetCaRatio = 1.06;
      dipoleArrow.visible = true;
      dipoleFieldLinesGroup.visible = true;
    } else {
      targetTiShift = 0.0;
      targetOShift = 0.0;
      targetCaRatio = 1.0;
      dipoleArrow.visible = false;
      dipoleFieldLinesGroup.visible = false;
    }

    if (schematicController) {
      schematicController.setMode(ferroelectric);
    }
    updateTelemetry(selectedAtom ? selectedAtom.userData : null);
    renderer.render(scene, camera);
  }

  function resetView() {
    controls.reset();
    camera.position.set(6.2, 4.8, 8.4);
    camera.lookAt(0, 0, 0);
    controls.autoRotate = true;
    if (selectedAtom) {
      selectedAtom.material = selectedAtom.userData.originalMaterial;
      selectedAtom = null;
      highlightRing.visible = false;
    }
    updateTelemetry(null);
    renderer.render(scene, camera);
  }

  // ResizeObserver: Essential for resilient sizing
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      const cr = entry.contentRect;
      if (cr.width > 0 && cr.height > 0) {
        camera.aspect = cr.width / cr.height;
        camera.updateProjectionMatrix();
        renderer.setSize(cr.width, cr.height);
        renderer.render(scene, camera);
      }
    }
  });
  resizeObserver.observe(containerEl);

  // Synchronous immediate first render
  renderer.render(scene, camera);

  // Animation Loop
  let animationFrameId;
  let clock = new THREE.Clock();

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Lerp phase transition parameters
    currentTiShift += (targetTiShift - currentTiShift) * 0.08;
    currentOShift += (targetOShift - currentOShift) * 0.08;
    currentCaRatio += (targetCaRatio - currentCaRatio) * 0.08;

    tiAtom.mesh.position.y = tiAtom.originalPosition.y + currentTiShift;
    oxygenAtoms.forEach(o => {
      o.mesh.position.y = o.originalPosition.y + currentOShift;
    });

    octaMesh.scale.set(1.0, currentCaRatio, 1.0);
    octaWireframe.scale.set(1.0, currentCaRatio, 1.0);
    boxFrame.scale.set(1.0, currentCaRatio, 1.0);

    updateBonds(currentTiShift, currentOShift);

    if (isFerroelectric) {
      dipoleArrow.position.y = Math.sin(elapsedTime * 4.0) * 0.08;
      dipoleFieldLinesGroup.rotation.y = elapsedTime * 0.4;
    }

    if (highlightRing.visible && selectedAtom) {
      highlightRing.position.copy(selectedAtom.getWorldPosition(new THREE.Vector3()));
      highlightRing.lookAt(camera.position);
    }

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  return {
    setPolarizationMode,
    resetView,
    toggleAutoRotate: val => { controls.autoRotate = val; },
    getIsFerroelectric: () => isFerroelectric,
    cleanup: () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
  };
}

/**
 * 2. 2D CANVAS DIPOLE & POLARIZATION SCHEMATIC (Upper-Right Panel)
 */
function initDipoleSchematic(canvasEl) {
  if (!canvasEl) return { setMode: () => {} };

  const ctx = canvasEl.getContext('2d');
  let isFerroelectric = false;
  let animProgress = 0;

  function render() {
    const w = canvasEl.width;
    const h = canvasEl.height;

    ctx.clearRect(0, 0, w, h);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#07111F');
    grad.addColorStop(1, '#05080D');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Grid dots
    ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
    for (let gx = 15; gx < w; gx += 20) {
      for (let gy = 15; gy < h; gy += 20) {
        ctx.fillRect(gx, gy, 1, 1);
      }
    }

    const centerX = w / 2;
    const centerY = h / 2;
    const cellW = 100;
    const cellH = isFerroelectric ? 114 : 100;

    // Unit cell box
    ctx.strokeStyle = isFerroelectric ? 'rgba(86, 217, 255, 0.7)' : 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(centerX - cellW / 2, centerY - cellH / 2, cellW, cellH);

    // Octahedron diamond cross-section in dashed lines
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.45)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - cellH / 2); // Top O
    ctx.lineTo(centerX + cellW / 2, centerY); // Right O
    ctx.lineTo(centerX, centerY + cellH / 2); // Bottom O
    ctx.lineTo(centerX - cellW / 2, centerY); // Left O
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // Corner Ba atoms (8 corners in 2D profile = 4 corners)
    const corners = [
      [centerX - cellW / 2, centerY - cellH / 2],
      [centerX + cellW / 2, centerY - cellH / 2],
      [centerX - cellW / 2, centerY + cellH / 2],
      [centerX + cellW / 2, centerY + cellH / 2]
    ];

    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#56D9FF';
      ctx.shadowColor = '#56D9FF';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Face-centered O atoms
    const oxygens = [
      [centerX, centerY - cellH / 2],
      [centerX, centerY + cellH / 2],
      [centerX - cellW / 2, centerY],
      [centerX + cellW / 2, centerY]
    ];

    oxygens.forEach(([ox, oy]) => {
      ctx.beginPath();
      ctx.arc(ox, oy, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FB7185';
      ctx.shadowColor = '#FB7185';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Central Ti cation position
    const tiDisplacement = isFerroelectric ? -16 : 0;
    const tiY = centerY + tiDisplacement;

    // Central Ti atom
    ctx.beginPath();
    ctx.arc(centerX, tiY, 8.5, 0, Math.PI * 2);
    ctx.fillStyle = '#C084FC';
    ctx.shadowColor = '#C084FC';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Symbol inside Ti
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Ti⁴⁺', centerX, tiY);

    if (isFerroelectric) {
      // Draw spontaneous polarization vector arrow P⃗
      const arrowStartX = centerX + 68;
      const arrowStartY = centerY + 42;
      const arrowEndY = centerY - 42;

      ctx.strokeStyle = '#56D9FF';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#56D9FF';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowStartY);
      ctx.lineTo(arrowStartX, arrowEndY);
      ctx.stroke();

      // Arrowhead
      ctx.fillStyle = '#56D9FF';
      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowEndY - 8);
      ctx.lineTo(arrowStartX - 5, arrowEndY);
      ctx.lineTo(arrowStartX + 5, arrowEndY);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // P⃗ label
      ctx.fillStyle = '#56D9FF';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('P⃗', arrowStartX + 10, centerY - 8);
      ctx.font = '8px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('[001]', arrowStartX + 10, centerY + 6);

      // Bound surface charge signs: + on top, - on bottom
      ctx.fillStyle = '#56D9FF';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('+ + + +', centerX, centerY - cellH / 2 - 8);
      ctx.fillStyle = '#FB7185';
      ctx.fillText('− − − −', centerX, centerY + cellH / 2 + 14);

      // Label below
      ctx.fillStyle = '#38BDF8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Δz ≈ +0.12 Å · Ps ≈ 26 µC/cm²', 12, h - 8);
    } else {
      // Paraelectric Centrosymmetric indicator
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Centrosymmetric · Net Dipole P⃗ = 0', 12, h - 8);

      ctx.fillStyle = '#64748B';
      ctx.font = '9px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('T > 120 °C', w - 12, h - 8);
    }
  }

  render();

  return {
    setMode: val => {
      isFerroelectric = val;
      render();
    }
  };
}

/**
 * 3. INTERACTIVE 2D PROJECTED CRYSTAL FALLBACK
 * Guaranteed to work even if WebGL is disabled or driver crashed.
 */
function initCanvas2DFallback(containerEl, schematicController) {
  containerEl.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  containerEl.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let isFerroelectric = false;
  let rotX = 0.35;
  let rotY = -0.6;
  let autoRotate = true;
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;

  function resize() {
    canvas.width = containerEl.clientWidth || 700;
    canvas.height = containerEl.clientHeight || 560;
  }
  resize();
  window.addEventListener('resize', resize);

  // Model definition in 3D coordinates
  const a = 140;
  const halfA = a / 2;

  const corners = [
    [-halfA, -halfA, -halfA], [halfA, -halfA, -halfA],
    [-halfA, halfA, -halfA],  [halfA, halfA, -halfA],
    [-halfA, -halfA, halfA],  [halfA, -halfA, halfA],
    [-halfA, halfA, halfA],   [halfA, halfA, halfA]
  ];

  const faceOxygens = [
    [0, 0, -halfA], [0, 0, halfA],
    [0, -halfA, 0], [0, halfA, 0],
    [-halfA, 0, 0], [halfA, 0, 0]
  ];

  const edges = [
    [0,1], [1,3], [3,2], [2,0],
    [4,5], [5,7], [7,6], [6,4],
    [0,4], [1,5], [2,6], [3,7]
  ];

  function project(p, cx, cy) {
    // 3D rotation matrix
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

    let x = p[0] * cosY + p[2] * sinY;
    let z = -p[0] * sinY + p[2] * cosY;
    let y = p[1] * cosX - z * sinX;
    z = p[1] * sinX + z * cosX;

    const fov = 450;
    const scale = fov / (fov + z + 200);
    return {
      x: cx + x * scale,
      y: cy + y * scale,
      z: z
    };
  }

  function render2D() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    // Unit cell frame edges
    ctx.strokeStyle = 'rgba(86, 217, 255, 0.4)';
    ctx.lineWidth = 1.5;
    edges.forEach(([i, j]) => {
      const p1 = project(corners[i], cx, cy);
      const p2 = project(corners[j], cx, cy);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    // Central Ti cation position
    const tiShiftY = isFerroelectric ? -22 : 0;
    const ti3D = [0, tiShiftY, 0];
    const tiProj = project(ti3D, cx, cy);

    // Octahedral bond lines from Ti to 6 Oxygens
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    faceOxygens.forEach(op => {
      const oProj = project(op, cx, cy);
      ctx.beginPath();
      ctx.moveTo(tiProj.x, tiProj.y);
      ctx.lineTo(oProj.x, oProj.y);
      ctx.stroke();
    });

    // Draw Corner Ba atoms
    corners.forEach(cp => {
      const pt = project(cp, cx, cy);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#56D9FF';
      ctx.shadowColor = '#56D9FF';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw Face Oxygen atoms
    faceOxygens.forEach(op => {
      const pt = project(op, cx, cy);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#FB7185';
      ctx.shadowColor = '#FB7185';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw Central Ti cation
    ctx.beginPath();
    ctx.arc(tiProj.x, tiProj.y, 11, 0, Math.PI * 2);
    ctx.fillStyle = '#C084FC';
    ctx.shadowColor = '#C084FC';
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Label on Ti
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Ti⁴⁺', tiProj.x, tiProj.y);

    if (isFerroelectric) {
      // Draw vertical dipole arrow P⃗
      ctx.strokeStyle = '#56D9FF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tiProj.x, tiProj.y + 40);
      ctx.lineTo(tiProj.x, tiProj.y - 45);
      ctx.stroke();

      ctx.fillStyle = '#56D9FF';
      ctx.beginPath();
      ctx.moveTo(tiProj.x, tiProj.y - 52);
      ctx.lineTo(tiProj.x - 6, tiProj.y - 42);
      ctx.lineTo(tiProj.x + 6, tiProj.y - 42);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Animation Loop
  let rafId;
  function loop() {
    rafId = requestAnimationFrame(loop);
    if (autoRotate && !isDragging) {
      rotY += 0.008;
    }
    render2D();
  }
  loop();

  // Mouse & Touch Controls
  canvas.addEventListener('mousedown', e => {
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    rotY += (e.clientX - prevX) * 0.01;
    rotX += (e.clientY - prevY) * 0.01;
    prevX = e.clientX;
    prevY = e.clientY;
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  return {
    setPolarizationMode: val => {
      isFerroelectric = val;
      if (schematicController) schematicController.setMode(val);
      render2D();
    },
    resetView: () => {
      rotX = 0.35;
      rotY = -0.6;
      autoRotate = true;
      render2D();
    },
    toggleAutoRotate: val => { autoRotate = val; },
    getIsFerroelectric: () => isFerroelectric,
    cleanup: () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    }
  };
}
