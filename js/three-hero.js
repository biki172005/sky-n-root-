/**
 * SKYNROOT — THE LIVING GLASS WORLD
 * High-End 3D WebGL Hero Experience built with Three.js
 *
 * Core Concept:
 * A gigantic transparent glass sphere suspended in space contains a living
 * miniature botanical ecosystem (mossy terrain, sculpted stones, living ferns,
 * floating water droplets, golden spores, and soft atmospheric mist).
 *
 * As the user scrolls, the camera travels into the sphere, breaching the glass boundary,
 * foreground leaves part naturally, and the central SKYNROOT serum bottle is revealed
 * under a soft illuminating light ray with orbiting water droplets.
 */

export class SkynrootHeroExperience {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // 3D Groups
    this.worldGroup = null;          // Entire 3D assembly
    this.glassSphereGroup = null;    // Outer glass sphere, brass meridian ring, contact shadow
    this.terrariumGroup = null;      // Inner living ecosystem (base, stones, plants, water, bottle)
    this.bottleGroup = null;         // SKYNROOT Serum Bottle
    this.serumLiquidMesh = null;
    this.outerGlassMesh = null;
    this.glassInnerRefractMesh = null;
    this.dropperCollarMesh = null;
    this.dropperBulbMesh = null;

    // Interactive elements
    this.partingLeaves = [];         // Leaves that move aside on approach
    this.organicLeaves = [];         // Ambient living leaves with wind sway
    this.floatingDroplets = [];      // Suspended atmospheric droplets
    this.orbitingDroplets = [];      // Droplets circling the serum bottle
    this.sporeParticles = null;      // Swirling golden particles
    this.mistPlanes = [];            // Atmospheric mist layers
    this.revealSpotLight = null;     // Product illumination ray

    // Interaction & Animation State
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.manualOrbitY = 0;
    this.manualOrbitX = 0;
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;

    // DOM UI references
    this.heroTrack = document.getElementById('hero-track');
    this.introContent = document.getElementById('hero-intro-content');
    this.serumHud = document.getElementById('serum-reveal-hud');
    this.journeyFillBar = document.getElementById('journey-fill-bar');
    this.journeyLabel = document.getElementById('journey-label');
    this.enterWorldBtn = document.getElementById('enter-world-btn');

    // Themes for real-time atmosphere & elixir customization
    this.themes = {
      amber: {
        liquid: 0xd69a47,
        roughness: 0.12,
        transmission: 0.88,
        light: 0xffe8ce,
        sphereTint: 0xdce7d9,
        name: 'Amber Botanical'
      },
      sage: {
        liquid: 0x6e8f69,
        roughness: 0.15,
        transmission: 0.85,
        light: 0xd8ebd5,
        sphereTint: 0xd5e3d2,
        name: 'Sage Infusion'
      },
      crystal: {
        liquid: 0xf3f1e8,
        roughness: 0.08,
        transmission: 0.95,
        light: 0xffffff,
        sphereTint: 0xe6ebe2,
        name: 'Pure Hydration'
      },
      plum: {
        liquid: 0x4f2d48,
        roughness: 0.18,
        transmission: 0.82,
        light: 0xf1d2ec,
        sphereTint: 0xe2d6de,
        name: 'Blackberry Shield'
      }
    };
    this.currentTheme = 'amber';

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded. Falling back to static luxury visual.');
      return;
    }

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const isMobile = width <= 768;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera: Responsive perspective adapted to device aspect ratio
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.cameraDistanceFactor = 1.0;
    this.cameraYOffset = 0;
    this.updateCameraFraming();
    this.camera.position.set(0, 0.25, 6.6 * this.cameraDistanceFactor);

    // 3. WebGL Renderer with High-End Color Science & Mobile GPU Protection
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    const maxDpr = isMobile ? 1.5 : 2;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Master World Group
    this.worldGroup = new THREE.Group();
    this.scene.add(this.worldGroup);

    // 4. Lighting Rig
    this.setupLighting();

    // 5. Build The Living Glass Sphere & Environment
    this.buildGlassSphere();
    this.buildTerrariumBase();
    this.buildBotanicals();
    this.buildWaterElements();
    this.buildAtmosphere();
    this.buildSerumBottle();

    // 6. Setup Event Listeners & UI Binding
    this.setupEvents();

    // 7. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // A. Soft Warm Studio Ambient
    const ambientLight = new THREE.AmbientLight(0xf7f5ef, 1.25);
    this.scene.add(ambientLight);

    // B. Key Directional Sunlight (Casting soft shadows)
    const isMobile = (this.container.clientWidth || window.innerWidth) <= 768;
    const shadowRes = isMobile ? 512 : 1024;
    this.keyLight = new THREE.DirectionalLight(0xfff6eb, 2.6);
    this.keyLight.position.set(4.5, 6.5, 5.0);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = shadowRes;
    this.keyLight.shadow.mapSize.height = shadowRes;
    this.keyLight.shadow.bias = -0.0004;
    this.scene.add(this.keyLight);

    // C. Sage-Green Botanical Rim Light (Accentuates glass and leaf silhouettes)
    this.rimLight = new THREE.DirectionalLight(0xa6b39a, 2.4);
    this.rimLight.position.set(-5.0, 3.5, -3.0);
    this.scene.add(this.rimLight);

    // D. Under-Glow Caustic Point Light (Simulates luminous fluid and moss glow)
    this.glowLight = new THREE.PointLight(0xd69a47, 1.4, 7);
    this.glowLight.position.set(0, -1.2, 0.4);
    this.scene.add(this.glowLight);

    // E. Overhead Soft Fill Light
    const fillLight = new THREE.DirectionalLight(0xb9a77a, 0.9);
    fillLight.position.set(0, 5.0, 2.0);
    this.scene.add(fillLight);

    // F. Focused Product Reveal Spotlight (God-Ray that shines when inside the world)
    this.revealSpotLight = new THREE.SpotLight(0xfff5ea, 0, 8.5, Math.PI / 4.5, 0.4, 1.2);
    this.revealSpotLight.position.set(1.4, 3.2, 2.4);
    this.revealSpotLight.castShadow = true;
    this.scene.add(this.revealSpotLight);
    this.scene.add(this.revealSpotLight.target);
  }

  // ================= 1. THE GIANT LIVING GLASS SPHERE =================
  buildGlassSphere() {
    this.glassSphereGroup = new THREE.Group();

    // A. Outer Glass Sphere Material (PBR Refraction & Reflections)
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.02,
      roughness: 0.05,
      transmission: 0.95,
      ior: 1.52,
      transparent: true,
      opacity: 0.94,
      reflectivity: 0.88,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06
    });
    this.sphereGlassMaterial = glassMaterial;

    const sphereGeo = new THREE.SphereGeometry(2.35, 64, 64);
    this.outerGlassMesh = new THREE.Mesh(sphereGeo, glassMaterial);
    this.outerGlassMesh.castShadow = true;
    this.outerGlassMesh.receiveShadow = true;
    this.glassSphereGroup.add(this.outerGlassMesh);

    // B. Inner Refraction Shell (Adds depth and internal reflections)
    const innerGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5f9f4,
      roughness: 0.12,
      transmission: 0.92,
      transparent: true,
      opacity: 0.45,
      side: THREE.BackSide,
      ior: 1.48
    });
    const innerSphereGeo = new THREE.SphereGeometry(2.31, 48, 48);
    this.glassInnerRefractMesh = new THREE.Mesh(innerSphereGeo, innerGlassMat);
    this.glassSphereGroup.add(this.glassInnerRefractMesh);

    // C. Decorative Thin Champagne Gold Meridian Ring (Apothecary craftsmanship)
    const ringGeo = new THREE.TorusGeometry(2.37, 0.012, 16, 96);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xb9a77a,
      metalness: 0.9,
      roughness: 0.22
    });
    const meridianRing = new THREE.Mesh(ringGeo, ringMat);
    meridianRing.rotation.x = Math.PI / 2.35;
    meridianRing.rotation.y = Math.PI / 6.5;
    this.glassSphereGroup.add(meridianRing);

    // D. Soft Atmospheric Contact Shadow Below the Sphere
    const shadowGeo = new THREE.PlaneGeometry(5.2, 5.2);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(128, 128, 8, 128, 128, 120);
    grad.addColorStop(0, 'rgba(20, 32, 25, 0.52)');
    grad.addColorStop(0.45, 'rgba(36, 59, 46, 0.22)');
    grad.addColorStop(0.8, 'rgba(166, 179, 154, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.38;
    this.glassSphereGroup.add(shadowPlane);

    this.worldGroup.add(this.glassSphereGroup);
  }

  // ================= 2. THE MINIATURE TERRARIUM ECOSYSTEM BASE =================
  buildTerrariumBase() {
    this.terrariumGroup = new THREE.Group();

    // A. Mossy Undulating Terrain Floor inside the bottom hemisphere
    const baseGeo = new THREE.CylinderGeometry(1.88, 1.75, 0.45, 36);
    const mossMaterial = new THREE.MeshStandardMaterial({
      color: 0x243b2e,
      roughness: 0.92,
      metalness: 0.05
    });
    const baseTerrain = new THREE.Mesh(baseGeo, mossMaterial);
    baseTerrain.position.y = -1.18;
    baseTerrain.receiveShadow = true;
    this.terrariumGroup.add(baseTerrain);

    // B. Miniature Moss-Covered Stones & Boulders
    const stoneGeo = new THREE.DodecahedronGeometry(0.24, 1);
    const stoneMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xc8c1b2, roughness: 0.88, metalness: 0.05 }), // Travertine
      new THREE.MeshStandardMaterial({ color: 0x445a49, roughness: 0.94, metalness: 0.05 }), // Moss stone
      new THREE.MeshStandardMaterial({ color: 0x93a38a, roughness: 0.85, metalness: 0.08 })  // Sage slate
    ];

    const stoneConfigs = [
      { x: -0.95, y: -0.92, z: 0.45, s: [1.3, 0.8, 1.1], rot: 0.4, mat: 0 },
      { x: -1.25, y: -0.98, z: -0.35, s: [0.9, 0.6, 0.8], rot: 1.1, mat: 1 },
      { x: 0.88, y: -0.94, z: 0.52, s: [1.2, 0.7, 1.0], rot: -0.6, mat: 0 },
      { x: 1.20, y: -0.96, z: -0.25, s: [1.0, 0.9, 0.9], rot: 2.1, mat: 1 },
      { x: -0.35, y: -0.98, z: 1.10, s: [0.8, 0.5, 0.7], rot: 0.8, mat: 2 },
      { x: 0.42, y: -0.99, z: 1.05, s: [0.7, 0.6, 0.8], rot: -1.2, mat: 1 },
      { x: 0.0, y: -1.02, z: -1.15, s: [1.4, 0.7, 1.2], rot: 0.1, mat: 0 }
    ];

    stoneConfigs.forEach(cfg => {
      const stone = new THREE.Mesh(stoneGeo, stoneMaterials[cfg.mat]);
      stone.position.set(cfg.x, cfg.y, cfg.z);
      stone.scale.set(cfg.s[0], cfg.s[1], cfg.s[2]);
      stone.rotation.set(cfg.rot, cfg.rot * 0.7, cfg.rot * 0.3);
      stone.castShadow = true;
      stone.receiveShadow = true;
      this.terrariumGroup.add(stone);
    });

    this.worldGroup.add(this.terrariumGroup);
  }

  // ================= 3. LIVING BOTANICAL PLANTS & FERN LEAVES =================
  buildBotanicals() {
    // Leaf Material Definition
    const darkForestLeafMat = new THREE.MeshStandardMaterial({
      color: 0x223829,
      roughness: 0.45,
      metalness: 0.08,
      side: THREE.DoubleSide
    });

    const sageLeafMat = new THREE.MeshStandardMaterial({
      color: 0x48644e,
      roughness: 0.50,
      metalness: 0.06,
      side: THREE.DoubleSide
    });

    const emeraldLeafMat = new THREE.MeshStandardMaterial({
      color: 0x2f4c37,
      roughness: 0.40,
      metalness: 0.10,
      side: THREE.DoubleSide
    });

    // Helper: Create an organic arched leaf geometry
    const createCurvedLeafGeometry = (width = 0.38, length = 1.1) => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.quadraticCurveTo(width, length * 0.35, width * 0.7, length * 0.75);
      shape.quadraticCurveTo(width * 0.15, length * 0.95, 0, length);
      shape.quadraticCurveTo(-width * 0.15, length * 0.95, -width * 0.7, length * 0.75);
      shape.quadraticCurveTo(-width, length * 0.35, 0, 0);
      return new THREE.ShapeGeometry(shape, 12);
    };

    // Helper: Create a feathery fern frond geometry
    const createFernFrondGroup = (length = 1.3, leafletsCount = 9, mat = sageLeafMat) => {
      const frondGroup = new THREE.Group();
      
      // Stem
      const stemGeo = new THREE.CylinderGeometry(0.015, 0.025, length, 8);
      stemGeo.translate(0, length / 2, 0);
      const stem = new THREE.Mesh(stemGeo, darkForestLeafMat);
      frondGroup.add(stem);

      // Leaflets along stem
      const leafletGeo = createCurvedLeafGeometry(0.12, 0.32);
      for (let i = 1; i <= leafletsCount; i++) {
        const t = i / (leafletsCount + 1);
        const y = t * length;
        const scale = (1 - t * 0.6) * 0.85;

        // Left leaflet
        const leftLeaf = new THREE.Mesh(leafletGeo, mat);
        leftLeaf.position.set(-0.01, y, 0);
        leftLeaf.scale.set(scale, scale, scale);
        leftLeaf.rotation.set(0.1, 0.2, 0.9 + (1 - t) * 0.2);
        frondGroup.add(leftLeaf);

        // Right leaflet
        const rightLeaf = new THREE.Mesh(leafletGeo, mat);
        rightLeaf.position.set(0.01, y, 0);
        rightLeaf.scale.set(scale, scale, scale);
        rightLeaf.rotation.set(-0.1, -0.2, -0.9 - (1 - t) * 0.2);
        frondGroup.add(rightLeaf);
      }

      return frondGroup;
    };

    // A. FOREGROUND PARTING LEAVES (Conceal the bottle initially, move aside on scroll approach)
    const largeLeafGeo = createCurvedLeafGeometry(0.42, 1.45);

    // 1. Parting Left Leaf
    this.partingLeafLeft = new THREE.Mesh(largeLeafGeo, emeraldLeafMat);
    this.partingLeafLeft.position.set(-0.42, -0.75, 0.85);
    this.partingLeafLeft.rotation.set(0.35, 0.45, -0.25);
    this.partingLeafLeft.userData = {
      baseX: -0.42,
      baseRotZ: -0.25,
      targetOpenX: -1.75,
      targetOpenRotZ: -1.35
    };
    this.terrariumGroup.add(this.partingLeafLeft);
    this.partingLeaves.push(this.partingLeafLeft);

    // 2. Parting Right Leaf
    this.partingLeafRight = new THREE.Mesh(largeLeafGeo, darkForestLeafMat);
    this.partingLeafRight.position.set(0.44, -0.80, 0.82);
    this.partingLeafRight.rotation.set(0.30, -0.40, 0.22);
    this.partingLeafRight.userData = {
      baseX: 0.44,
      baseRotZ: 0.22,
      targetOpenX: 1.75,
      targetOpenRotZ: 1.35
    };
    this.terrariumGroup.add(this.partingLeafRight);
    this.partingLeaves.push(this.partingLeafRight);

    // B. FEATHERY FERN FRONDS (Midground & Background Layers)
    const fernConfigs = [
      { x: -0.85, y: -0.95, z: 0.2, scale: 0.95, rotX: 0.25, rotY: 0.5, rotZ: 0.4 },
      { x: 0.88, y: -0.95, z: 0.15, scale: 0.90, rotX: 0.20, rotY: -0.6, rotZ: -0.45 },
      { x: -1.05, y: -0.95, z: -0.4, scale: 1.1, rotX: -0.2, rotY: 1.1, rotZ: 0.6 },
      { x: 1.05, y: -0.95, z: -0.4, scale: 1.1, rotX: -0.15, rotY: -1.2, rotZ: -0.65 },
      { x: 0.0, y: -0.95, z: -0.85, scale: 1.25, rotX: -0.4, rotY: 0.0, rotZ: 0.1 }
    ];

    fernConfigs.forEach((cfg, idx) => {
      const fern = createFernFrondGroup(1.3, 8, idx % 2 === 0 ? sageLeafMat : emeraldLeafMat);
      fern.position.set(cfg.x, cfg.y, cfg.z);
      fern.scale.set(cfg.scale, cfg.scale, cfg.scale);
      fern.rotation.set(cfg.rotX, cfg.rotY, cfg.rotZ);
      fern.userData = {
        baseRotX: cfg.rotX,
        baseRotZ: cfg.rotZ,
        speed: 0.0012 + idx * 0.0004,
        phase: idx * 1.5,
        depthFactor: 0.15 + (idx * 0.05)
      };
      this.terrariumGroup.add(fern);
      this.organicLeaves.push(fern);
    });

    // C. ARCHED TROPICAL BROAD LEAVES (Surrounding the serum bottle)
    const midLeafGeo = createCurvedLeafGeometry(0.35, 1.2);
    const broadConfigs = [
      { x: -0.65, y: -0.90, z: -0.15, s: 0.85, rx: 0.2, ry: 0.8, rz: 0.5 },
      { x: 0.68, y: -0.90, z: -0.12, s: 0.85, rx: 0.2, ry: -0.8, rz: -0.5 },
      { x: -0.30, y: -0.95, z: -0.65, s: 0.95, rx: -0.3, ry: 0.3, rz: 0.3 },
      { x: 0.32, y: -0.95, z: -0.65, s: 0.95, rx: -0.3, ry: -0.3, rz: -0.3 }
    ];

    broadConfigs.forEach((cfg, idx) => {
      const leaf = new THREE.Mesh(midLeafGeo, idx % 2 === 0 ? darkForestLeafMat : sageLeafMat);
      leaf.position.set(cfg.x, cfg.y, cfg.z);
      leaf.scale.set(cfg.s, cfg.s, cfg.s);
      leaf.rotation.set(cfg.rx, cfg.ry, cfg.rz);
      leaf.userData = {
        baseRotX: cfg.rx,
        baseRotZ: cfg.rz,
        speed: 0.0016 + idx * 0.0005,
        phase: idx * 1.8
      };
      this.terrariumGroup.add(leaf);
      this.organicLeaves.push(leaf);
    });
  }

  // ================= 4. WATER DROPLETS & MICRO-STREAMS =================
  buildWaterElements() {
    const dropletMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.98,
      roughness: 0.02,
      ior: 1.33,
      transparent: true,
      opacity: 0.92,
      reflectivity: 0.95,
      clearcoat: 1.0
    });

    // A. Suspended Water Droplets (18 droplets scattered inside the sphere)
    const dropletGeo = new THREE.SphereGeometry(0.045, 16, 16);
    dropletGeo.scale(1, 1.25, 1);

    for (let i = 0; i < 18; i++) {
      const drop = new THREE.Mesh(dropletGeo, dropletMaterial);
      const angle = (i / 18) * Math.PI * 2;
      const radius = 0.55 + Math.random() * 1.15;
      const y = -0.7 + Math.random() * 1.8;
      const z = Math.sin(angle) * radius * 0.8;
      const x = Math.cos(angle) * radius;

      const scale = 0.5 + Math.random() * 0.8;
      drop.scale.set(scale, scale * 1.2, scale);
      drop.position.set(x, y, z);
      drop.userData = {
        baseY: y,
        baseX: x,
        speed: 0.0015 + Math.random() * 0.0015,
        phase: Math.random() * Math.PI * 2,
        depthFactor: 0.25 + Math.random() * 0.2
      };
      this.terrariumGroup.add(drop);
      this.floatingDroplets.push(drop);
    }

    // B. Orbiting Serum Droplets (Gently circulate around the bottle)
    for (let i = 0; i < 4; i++) {
      const orbitDrop = new THREE.Mesh(dropletGeo, dropletMaterial);
      orbitDrop.scale.set(0.65, 0.85, 0.65);
      orbitDrop.userData = {
        orbitIndex: i,
        orbitRadius: 0.52 + (i * 0.08),
        orbitSpeed: 0.8 + (i * 0.15),
        baseY: 0.1 + (i * 0.22)
      };
      this.terrariumGroup.add(orbitDrop);
      this.orbitingDroplets.push(orbitDrop);
    }

    // C. Micro-Water Stream Bead String (Dripping naturally near moss stones)
    const streamGroup = new THREE.Group();
    for (let j = 0; j < 5; j++) {
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.022 - j * 0.002, 12, 12), dropletMaterial);
      bead.position.set(-0.85, -0.45 - (j * 0.08), 0.35);
      streamGroup.add(bead);
    }
    this.terrariumGroup.add(streamGroup);
  }

  // ================= 5. ATMOSPHERIC MIST & GOLDEN SPORES =================
  buildAtmosphere() {
    // A. Golden Botanical Spores (75 floating particles)
    const count = 75;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      const r = Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = (Math.random() - 0.4) * 2.2;
      positions[i + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const sporeMat = new THREE.PointsMaterial({
      color: 0xb9a77a,
      size: 0.038,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending
    });

    this.sporeParticles = new THREE.Points(geometry, sporeMat);
    this.terrariumGroup.add(this.sporeParticles);

    // B. Soft Atmospheric Mist Discs
    const mistGeo = new THREE.PlaneGeometry(2.4, 0.8);
    const mistCanvas = document.createElement('canvas');
    mistCanvas.width = 256;
    mistCanvas.height = 128;
    const mCtx = mistCanvas.getContext('2d');
    const mGrad = mCtx.createRadialGradient(128, 64, 10, 128, 64, 110);
    mGrad.addColorStop(0, 'rgba(235, 242, 230, 0.18)');
    mGrad.addColorStop(0.5, 'rgba(166, 179, 154, 0.09)');
    mGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    mCtx.fillStyle = mGrad;
    mCtx.fillRect(0, 0, 256, 128);

    const mistTex = new THREE.CanvasTexture(mistCanvas);
    const mistMat = new THREE.MeshBasicMaterial({
      map: mistTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false
    });

    for (let k = 0; k < 3; k++) {
      const mistPlane = new THREE.Mesh(mistGeo, mistMat);
      mistPlane.position.set(0, -0.65 + k * 0.25, -0.2 + k * 0.15);
      mistPlane.rotation.y = k * 0.8;
      this.terrariumGroup.add(mistPlane);
      this.mistPlanes.push(mistPlane);
    }
  }

  // ================= 6. THE SKYNROOT SERUM BOTTLE REVEAL =================
  buildSerumBottle() {
    this.bottleGroup = new THREE.Group();

    // A. Frosted Glass Body Material
    const frostedGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xfbfaf6,
      metalness: 0.04,
      roughness: 0.20, // Luxurious frosted apothecary finish
      transmission: 0.89,
      ior: 1.50,
      transparent: true,
      opacity: 0.95,
      clearcoat: 0.75,
      clearcoatRoughness: 0.12
    });
    this.frostedGlassMat = frostedGlassMat;

    // B. Inner Botanical Elixir Liquid Material
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: this.themes[this.currentTheme].liquid,
      metalness: 0.0,
      roughness: 0.12,
      transmission: 0.85,
      ior: 1.42,
      transparent: true,
      opacity: 0.88
    });
    this.liquidMaterial = liquidMaterial;

    // C. Muted Sage-Green Dropper Cap Material
    const sageBulbMat = new THREE.MeshStandardMaterial({
      color: 0x6e8f69, // Muted sage-green requested
      roughness: 0.82,
      metalness: 0.04
    });
    this.dropperBulbMeshMat = sageBulbMat;

    // D. Brushed Champagne Gold Collar Material
    const goldCollarMat = new THREE.MeshStandardMaterial({
      color: 0xb9a77a,
      metalness: 0.90,
      roughness: 0.20
    });

    // 1. Frosted Cylindrical Bottle Body
    const bottleBodyGeo = new THREE.CylinderGeometry(0.48, 0.48, 1.55, 48);
    const bottleBody = new THREE.Mesh(bottleBodyGeo, frostedGlassMat);
    bottleBody.position.y = 0;
    bottleBody.castShadow = true;
    bottleBody.receiveShadow = true;
    this.bottleGroup.add(bottleBody);

    // Thick Beveled Glass Base
    const baseGeo = new THREE.CylinderGeometry(0.47, 0.46, 0.20, 48);
    const bottleBase = new THREE.Mesh(baseGeo, frostedGlassMat);
    bottleBase.position.y = -0.85;
    this.bottleGroup.add(bottleBase);

    // Curved Shoulder
    const shoulderGeo = new THREE.CylinderGeometry(0.30, 0.48, 0.22, 48);
    const bottleShoulder = new THREE.Mesh(shoulderGeo, frostedGlassMat);
    bottleShoulder.position.y = 0.85;
    this.bottleGroup.add(bottleShoulder);

    // Bottle Neck
    const neckGeo = new THREE.CylinderGeometry(0.30, 0.30, 0.20, 48);
    const bottleNeck = new THREE.Mesh(neckGeo, frostedGlassMat);
    bottleNeck.position.y = 1.02;
    this.bottleGroup.add(bottleNeck);

    // 2. Inner Golden Serum Fluid Core
    const fluidGeo = new THREE.CylinderGeometry(0.41, 0.41, 1.35, 36);
    this.serumLiquidMesh = new THREE.Mesh(fluidGeo, liquidMaterial);
    this.serumLiquidMesh.position.y = -0.06;
    this.bottleGroup.add(this.serumLiquidMesh);

    // 3. Metallic Champagne Gold Dropper Collar
    const collarGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.28, 48);
    this.dropperCollarMesh = new THREE.Mesh(collarGeo, goldCollarMat);
    this.dropperCollarMesh.position.y = 1.22;
    this.dropperCollarMesh.castShadow = true;
    this.bottleGroup.add(this.dropperCollarMesh);

    // Accent ribbed ring on collar
    const collarRingGeo = new THREE.TorusGeometry(0.33, 0.02, 16, 48);
    const collarRing = new THREE.Mesh(collarRingGeo, goldCollarMat);
    collarRing.rotation.x = Math.PI / 2;
    collarRing.position.y = 1.22;
    this.bottleGroup.add(collarRing);

    // 4. Muted Sage-Green Rubber Pipette Bulb
    const bulbGeo = new THREE.SphereGeometry(0.24, 32, 24);
    bulbGeo.scale(1, 1.45, 1);
    this.dropperBulbMesh = new THREE.Mesh(bulbGeo, sageBulbMat);
    this.dropperBulbMesh.position.y = 1.64;
    this.bottleGroup.add(this.dropperBulbMesh);

    // 5. Internal Glass Pipette Tube & Tip Droplet
    const tubeGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.65, 20);
    const tubeMesh = new THREE.Mesh(tubeGeo, frostedGlassMat);
    tubeMesh.position.y = 0.40;
    this.bottleGroup.add(tubeMesh);

    const tipDropGeo = new THREE.SphereGeometry(0.055, 16, 16);
    tipDropGeo.scale(1, 1.35, 1);
    const tipDrop = new THREE.Mesh(tipDropGeo, liquidMaterial);
    tipDrop.position.y = -0.52;
    this.bottleGroup.add(tipDrop);

    // 6. Minimal Luxury Ivory Label
    const labelGeo = new THREE.CylinderGeometry(0.485, 0.485, 0.98, 48, 1, true, -Math.PI / 3, (2 * Math.PI) / 3);
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 1024;
    labelCanvas.height = 768;
    const ctx = labelCanvas.getContext('2d');

    // Warm ivory parchment background
    ctx.fillStyle = '#F7F5EF';
    ctx.fillRect(0, 0, 1024, 768);

    // Delicate champagne gold border
    ctx.strokeStyle = '#B9A77A';
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, 960, 704);

    // Brand Wordmark: SKYnROOT
    ctx.fillStyle = '#243B2E';
    ctx.font = '600 46px "Cinzel", "Playfair Display", serif';
    ctx.textAlign = 'right';
    ctx.fillText('SKY', 484, 215);

    ctx.font = 'italic 58px "Alex Brush", "Playfair Display", cursive, serif';
    ctx.textAlign = 'center';
    ctx.fillText('n', 512, 215);

    ctx.font = '600 46px "Cinzel", "Playfair Display", serif';
    ctx.textAlign = 'left';
    ctx.fillText('ROOT', 540, 215);

    // Sub-label: SKINCARE
    ctx.fillStyle = '#182820';
    ctx.font = '500 18px "Cinzel", "Plus Jakarta Sans", serif';
    ctx.textAlign = 'center';
    ctx.fillText('SKINCARE', 512, 255);

    // Formulation: SIGNATURE SERUM
    ctx.fillStyle = '#B9A77A';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SIGNATURE SERUM', 512, 310);

    // Volume & Origin
    ctx.fillStyle = '#4B554D';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('COLD-PRESSED WILD BOTANICALS  •  30 ML', 512, 360);

    // Divider Line
    ctx.strokeStyle = 'rgba(185, 167, 122, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(370, 410);
    ctx.lineTo(654, 410);
    ctx.stroke();

    // Editorial Tagline
    ctx.fillStyle = '#5A675E';
    ctx.font = 'italic 18px "Cormorant Garamond", serif';
    ctx.fillText('Natural Skincare Meets Modern Luxury', 512, 460);

    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelMaterial = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.65,
      metalness: 0.08,
      transparent: true,
      side: THREE.DoubleSide
    });

    const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
    labelMesh.position.y = -0.05;
    this.bottleGroup.add(labelMesh);

    // Bottle position inside the terrarium (centered within sphere)
    this.bottleGroup.position.set(0, -0.32, 0);
    this.terrariumGroup.add(this.bottleGroup);

    // Aim Reveal Spotlight directly at the bottle
    if (this.revealSpotLight) {
      this.revealSpotLight.target = this.bottleGroup;
    }
  }

  // ================= 7. EVENT LISTENERS & UI SYNCHRONIZATION =================
  setupEvents() {
    // A. Mouse Parallax & Drag Orbit
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;
        this.manualOrbitY += deltaX * 0.006;
        this.manualOrbitX += deltaY * 0.003;
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    const dom = this.renderer.domElement;
    dom.style.cursor = 'grab';

    dom.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      dom.style.cursor = 'grabbing';
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      dom.style.cursor = 'grab';
    });

    // Touch support for mobile devices without fighting vertical scroll
    let touchStartX = 0;
    let touchStartY = 0;
    let isVerticalScroll = false;

    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        this.previousMousePosition = { x: touchStartX, y: touchStartY };
        isVerticalScroll = false;
        this.isDragging = false;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && !isVerticalScroll) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;
        const totalX = Math.abs(e.touches[0].clientX - touchStartX);
        const totalY = Math.abs(e.touches[0].clientY - touchStartY);

        // If user is predominantly scrolling vertically, release drag to browser
        if (totalY > totalX + 6 && !this.isDragging) {
          isVerticalScroll = true;
          return;
        }

        if (totalX > 6) {
          this.isDragging = true;
          this.manualOrbitY += deltaX * 0.006;
          this.manualOrbitX += deltaY * 0.003;
          this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
      isVerticalScroll = false;
    });

    // B. Scroll Tracking through the Cinematic Track
    const updateScroll = () => {
      if (!this.heroTrack) {
        const maxScroll = window.innerHeight * 2;
        this.targetScrollProgress = Math.min(window.scrollY / maxScroll, 1);
        return;
      }

      const rect = this.heroTrack.getBoundingClientRect();
      const trackHeight = this.heroTrack.offsetHeight - window.innerHeight;
      const progress = trackHeight > 0 ? Math.max(0, Math.min(-rect.top / trackHeight, 1)) : 0;
      this.targetScrollProgress = progress;
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    // C. "ENTER THE WORLD" CTA Click Handling
    if (this.enterWorldBtn) {
      this.enterWorldBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.heroTrack) {
          const trackTop = this.heroTrack.offsetTop;
          const trackHeight = this.heroTrack.offsetHeight - window.innerHeight;
          // Smoothly scroll to 58% of the track (inside the world facing the serum bottle)
          const targetY = trackTop + (trackHeight * 0.58);
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
        }
      });
    }

    // D. Atmosphere & Finish Theme Toggle Swatches
    const themeButtons = document.querySelectorAll('[data-finish-theme]');
    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-finish-theme');
        this.setTheme(theme);
        themeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // E. Responsive Window Resize & Dynamic Viewport Framing
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer) return;
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;
      this.updateCameraFraming();
      this.renderer.setSize(width, height);
      const isMobile = width <= 768;
      const maxDpr = isMobile ? 1.5 : 2;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    });

    // F. Performance Optimization: Pause Render Loop when hero is off-screen or tab hidden
    this.isSceneVisible = true;
    this.animationFrameId = null;

    if ('IntersectionObserver' in window && this.heroTrack) {
      this.visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const wasVisible = this.isSceneVisible;
          this.isSceneVisible = entry.isIntersecting;
          if (!wasVisible && this.isSceneVisible && !this.animationFrameId) {
            this.animate(performance.now());
          }
        });
      }, { threshold: 0.02 });
      this.visibilityObserver.observe(this.heroTrack);
    }

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isSceneVisible && !this.animationFrameId) {
        this.animate(performance.now());
      }
    });

    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = motionQuery.matches;
    motionQuery.addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
    });
  }

  updateCameraFraming() {
    if (!this.camera || !this.container) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const aspect = width / height;
    this.camera.aspect = aspect;

    if (aspect < 0.6) {
      // Small/standard mobile portrait (e.g. 320px–430px)
      this.camera.fov = 48;
      this.cameraDistanceFactor = 1.30;
      this.cameraYOffset = 0.22; // Elevate sphere so it sits naturally above bottom elements
    } else if (aspect < 0.85) {
      // Large phone / small tablet portrait (e.g. 431px–600px)
      this.camera.fov = 44;
      this.cameraDistanceFactor = 1.18;
      this.cameraYOffset = 0.14;
    } else if (aspect < 1.05) {
      // Tablet portrait / square (e.g. 601px–1024px)
      this.camera.fov = 40;
      this.cameraDistanceFactor = 1.08;
      this.cameraYOffset = 0.06;
    } else {
      // Desktop / wide
      this.camera.fov = 38;
      this.cameraDistanceFactor = 1.0;
      this.cameraYOffset = 0;
    }
    this.camera.updateProjectionMatrix();
  }

  setTheme(themeKey) {
    if (!this.themes[themeKey]) return;
    this.currentTheme = themeKey;
    const theme = this.themes[themeKey];

    if (this.liquidMaterial && this.liquidMaterial.color) {
      this.liquidMaterial.color.setHex(theme.liquid);
      this.liquidMaterial.roughness = theme.roughness;
      this.liquidMaterial.transmission = theme.transmission;
    }

    if (this.glowLight && this.glowLight.color) {
      this.glowLight.color.setHex(theme.liquid);
    }
  }

  // ================= 8. ANIMATION LOOP & CHOREOGRAPHY =================
  animate(timestamp) {
    // If scene is hidden or tab inactive, pause rendering to protect mobile battery & CPU
    if (!this.isSceneVisible || document.hidden) {
      this.animationFrameId = null;
      return;
    }

    this.animationFrameId = requestAnimationFrame(this.animate);

    const time = timestamp * 0.001;

    // Smooth lerping of mouse coordinates
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.06;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.06;

    // Smooth lerping of scroll progress
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;
    const p = this.scrollProgress;

    // Auto-spin damping when not dragging (respects prefers-reduced-motion)
    if (!this.isDragging && !this.prefersReducedMotion) {
      this.manualOrbitY += 0.0018; // Slow majestic rotation
      this.manualOrbitX *= 0.94;
    }

    // ================= A. CAMERA JOURNEY INTO THE LIVING GLASS =================
    // Camera travels from wide sphere -> breaches glass surface -> lands inside near bottle
    const dFactor = this.cameraDistanceFactor || 1.0;
    const yOff = this.cameraYOffset || 0;

    let camZ, camY, camX;
    let glassOpacity;
    let partingFactor = 0;
    let spotIntensity = 0;

    if (p < 0.40) {
      // Phase 1: Wide Shot approaching the Glass Sphere
      const subT = p / 0.40;
      camZ = (7.0 * dFactor) - subT * (4.0 * dFactor);
      camY = (0.35 + yOff) - subT * 0.25;
      camX = this.mouseX * 0.35;
      glassOpacity = 0.94;
      partingFactor = 0;
      spotIntensity = 0;
    } else if (p < 0.55) {
      // Phase 2: Breaching the Glass Surface into the Miniature Ecosystem
      const subT = (p - 0.40) / 0.15;
      camZ = (3.0 * dFactor) - subT * (1.35 * dFactor);
      camY = (0.10 + yOff * 0.6) - subT * 0.20;
      camX = this.mouseX * 0.22;
      glassOpacity = 0.94 - subT * 0.78;
      partingFactor = subT * 0.5;
      spotIntensity = subT * 1.8;
    } else if (p < 0.80) {
      // Phase 3: The Serum Reveal - Camera arrives at the central bottle
      const subT = (p - 0.55) / 0.25;
      camZ = (1.65 * Math.min(1.15, dFactor)) - subT * 0.15;
      camY = (-0.10 + yOff * 0.3) + Math.sin(time * 0.8) * 0.015;
      camX = this.mouseX * 0.15;
      glassOpacity = 0.16;
      partingFactor = 0.5 + subT * 0.5;
      spotIntensity = 1.8 + subT * 1.7;
    } else {
      // Phase 4: Transition into the website & Apothecary Collection
      const subT = (p - 0.80) / 0.20;
      camZ = (1.50 + subT * 0.95) * dFactor;
      camY = (-0.10 + yOff * 0.3) + subT * 0.90;
      camX = this.mouseX * 0.15 - subT * 0.6;
      glassOpacity = 0.16 + subT * 0.4;
      partingFactor = 1.0;
      spotIntensity = 3.5 * (1 - subT);
    }

    // Apply Camera transforms
    this.camera.position.set(camX, camY + this.mouseY * 0.15, camZ);
    this.camera.lookAt(0, -0.22 + yOff * 0.5, 0);

    // Update Outer Glass Opacity dynamically during journey
    if (this.outerGlassMesh && this.sphereGlassMaterial) {
      this.sphereGlassMaterial.opacity = Math.max(0.12, glassOpacity);
    }
    if (this.glassInnerRefractMesh) {
      this.glassInnerRefractMesh.material.opacity = Math.max(0.08, glassOpacity * 0.45);
    }

    // Update Product Illumination SpotLight
    if (this.revealSpotLight) {
      this.revealSpotLight.intensity = spotIntensity;
    }

    // ================= B. BOTTLE & WORLD DYNAMICS =================
    if (this.worldGroup) {
      // World responds with restrained, organic parallax
      this.worldGroup.rotation.y = this.manualOrbitY + this.mouseX * 0.12;
      this.worldGroup.rotation.x = this.manualOrbitX + this.mouseY * 0.06;

      // Subtle breathing levitation
      const breathFloat = Math.sin(time * 1.3) * 0.035;
      this.worldGroup.position.y = breathFloat;
    }

    // Foreground Leaves Parting Reveal
    if (this.partingLeafLeft) {
      const targetX = THREE.MathUtils.lerp(this.partingLeafLeft.userData.baseX, this.partingLeafLeft.userData.targetOpenX, partingFactor);
      const targetRotZ = THREE.MathUtils.lerp(this.partingLeafLeft.userData.baseRotZ, this.partingLeafLeft.userData.targetOpenRotZ, partingFactor);
      this.partingLeafLeft.position.x = targetX;
      this.partingLeafLeft.rotation.z = targetRotZ + Math.sin(time * 1.5) * 0.02;
    }
    if (this.partingLeafRight) {
      const targetX = THREE.MathUtils.lerp(this.partingLeafRight.userData.baseX, this.partingLeafRight.userData.targetOpenX, partingFactor);
      const targetRotZ = THREE.MathUtils.lerp(this.partingLeafRight.userData.baseRotZ, this.partingLeafRight.userData.targetOpenRotZ, partingFactor);
      this.partingLeafRight.position.x = targetX;
      this.partingLeafRight.rotation.z = targetRotZ - Math.sin(time * 1.5) * 0.02;
    }

    // Living Ferns & Ambient Leaves Organic Sway
    this.organicLeaves.forEach(leaf => {
      const data = leaf.userData;
      if (data) {
        leaf.rotation.x = data.baseRotX + Math.sin(time * 1.4 + data.phase) * 0.035;
        leaf.rotation.z = data.baseRotZ + Math.cos(time * 1.1 + data.phase) * 0.025;
      }
    });

    // Floating Water Droplets Bobbing
    this.floatingDroplets.forEach(drop => {
      const data = drop.userData;
      drop.position.y = data.baseY + Math.sin(time * 1.8 + data.phase) * 0.045;
    });

    // Orbiting Droplets around Serum Bottle Neck
    this.orbitingDroplets.forEach(drop => {
      const data = drop.userData;
      const angle = time * data.orbitSpeed + (data.orbitIndex * (Math.PI / 2));
      drop.position.x = Math.cos(angle) * data.orbitRadius;
      drop.position.z = Math.sin(angle) * data.orbitRadius;
      drop.position.y = data.baseY + Math.sin(time * 2.2 + data.orbitIndex) * 0.05;
    });

    // Golden Spores Swirling
    if (this.sporeParticles) {
      this.sporeParticles.rotation.y = time * 0.04;
    }

    // Mist Planes Drifting
    this.mistPlanes.forEach((mist, i) => {
      mist.rotation.z = Math.sin(time * 0.3 + i) * 0.05;
    });

    // ================= C. DOM UI JOURNEY SYNCHRONIZATION =================
    // 1. Hero Content Fade Out as user scrolls into the glass
    if (this.introContent) {
      if (p < 0.04) {
        this.introContent.style.opacity = '1';
        this.introContent.style.transform = 'translateY(0)';
        this.introContent.style.pointerEvents = 'auto';
      } else if (p < 0.28) {
        const fade = (0.28 - p) / 0.24;
        this.introContent.style.opacity = String(Math.max(0, fade));
        this.introContent.style.transform = `translateY(${(1 - fade) * -35}px)`;
        this.introContent.style.pointerEvents = fade > 0.4 ? 'auto' : 'none';
      } else {
        this.introContent.style.opacity = '0';
        this.introContent.style.pointerEvents = 'none';
      }
    }

    // 2. Serum Reveal In-World HUD card
    if (this.serumHud) {
      if (p >= 0.45 && p <= 0.82) {
        this.serumHud.classList.add('visible');
      } else {
        this.serumHud.classList.remove('visible');
      }
    }

    // 3. Journey Progress Bar & Label
    if (this.journeyFillBar) {
      this.journeyFillBar.style.width = `${Math.min(100, Math.round(p * 100))}%`;
    }
    if (this.journeyLabel) {
      if (p < 0.32) {
        this.journeyLabel.textContent = 'Scroll to enter the living glass';
      } else if (p < 0.78) {
        this.journeyLabel.textContent = '✦ Inside the Living Glass: Signature Serum';
      } else {
        this.journeyLabel.textContent = 'Entering the Botanical Apothecary';
      }
    }

    // Render WebGL frame
    this.renderer.render(this.scene, this.camera);
  }
}
