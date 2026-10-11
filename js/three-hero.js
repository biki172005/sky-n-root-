/**
 * SKYNROOT Signature 3D Experience
 * High-end WebGL product presentation built with Three.js
 */

export class SkynrootHeroExperience {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.bottleGroup = null;
    this.serumLiquidMesh = null;
    this.outerGlassMesh = null;
    this.collarMesh = null;
    this.leaves = [];
    this.droplets = [];
    this.particles = null;

    // Interaction state
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.manualRotationY = 0;
    this.manualRotationX = 0;
    this.scrollProgress = 0;

    // Color themes for customizer
    this.themes = {
      amber: {
        liquid: 0xd69a47,
        roughness: 0.12,
        transmission: 0.88,
        light: 0xffe8ce,
        name: 'Amber Botanical'
      },
      sage: {
        liquid: 0x6e8f69,
        roughness: 0.15,
        transmission: 0.85,
        light: 0xd8ebd5,
        name: 'Sage Infusion'
      },
      crystal: {
        liquid: 0xf3f1e8,
        roughness: 0.08,
        transmission: 0.95,
        light: 0xffffff,
        name: 'Pure Hydration'
      },
      plum: {
        liquid: 0x4f2d48,
        roughness: 0.18,
        transmission: 0.82,
        light: 0xf1d2ec,
        name: 'Blackberry Shield'
      }
    };

    this.currentTheme = 'amber';

    this.init();
  }

  init() {
    // Check for Three.js
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded. Falling back to static luxury visual.');
      return;
    }

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(0, 0.2, 5.2);

    // 3. Renderer with high visual fidelity
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. Setup Lighting
    this.setupLighting();

    // 5. Build 3D Serum Bottle & Pedestal
    this.buildBottle();
    this.buildPedestal();

    // 6. Floating Botanical Leaves & Water Droplets
    this.buildBotanicals();
    this.buildParticles();

    // 7. Event Listeners
    this.setupEvents();

    // 8. Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Warm soft ambient
    const ambientLight = new THREE.AmbientLight(0xf7f5ef, 1.4);
    this.scene.add(ambientLight);

    // Key directional studio sunlight
    this.keyLight = new THREE.DirectionalLight(0xfff5ea, 2.8);
    this.keyLight.position.set(4, 6, 4.5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.bias = -0.0005;
    this.scene.add(this.keyLight);

    // Cool sage rim light for glass edge definition
    this.rimLight = new THREE.DirectionalLight(0xa6b39a, 2.2);
    this.rimLight.position.set(-4, 3, -3);
    this.scene.add(this.rimLight);

    // Under-glow point light
    this.glowLight = new THREE.PointLight(0xd69a47, 1.5, 6);
    this.glowLight.position.set(0, -0.4, 0.5);
    this.scene.add(this.glowLight);

    // Overhead champagne fill
    const fillLight = new THREE.DirectionalLight(0xb9a77a, 1.0);
    fillLight.position.set(0, 5, 2);
    this.scene.add(fillLight);
  }

  buildBottle() {
    this.bottleGroup = new THREE.Group();

    // Materials
    // A. Outer Frosted Glass
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8f7f2,
      metalness: 0.05,
      roughness: 0.14,
      transmission: 0.92,
      thickness: 1.1,
      ior: 1.52,
      transparent: true,
      opacity: 0.94,
      reflectivity: 0.7,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1
    });

    // B. Inner Serum Liquid
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: this.themes[this.currentTheme].liquid,
      metalness: 0.0,
      roughness: 0.12,
      transmission: 0.85,
      thickness: 0.8,
      ior: 1.42,
      transparent: true,
      opacity: 0.88,
      attenuationColor: new THREE.Color(this.themes[this.currentTheme].liquid),
      attenuationDistance: 0.9
    });
    this.liquidMaterial = liquidMaterial;

    // C. Champagne Gold Collar
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xb9a77a,
      metalness: 0.88,
      roughness: 0.22
    });
    this.goldMaterial = goldMaterial;

    // D. Matte Rubber Bulb (Deep Forest Green)
    const bulbMaterial = new THREE.MeshStandardMaterial({
      color: 0x243b2e,
      roughness: 0.85,
      metalness: 0.05
    });

    // 1. Outer Glass Bottle Body
    // Cylinder with beveled top and thick bottom
    const bottleBodyGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.8, 48, 1, false);
    this.outerGlassMesh = new THREE.Mesh(bottleBodyGeo, glassMaterial);
    this.outerGlassMesh.position.y = 0;
    this.outerGlassMesh.castShadow = true;
    this.outerGlassMesh.receiveShadow = true;
    this.bottleGroup.add(this.outerGlassMesh);

    // Thick Glass Bottom Base
    const baseGeo = new THREE.CylinderGeometry(0.54, 0.53, 0.22, 48);
    const baseMesh = new THREE.Mesh(baseGeo, glassMaterial);
    baseMesh.position.y = -0.95;
    this.bottleGroup.add(baseMesh);

    // Bottle Curved Shoulder
    const shoulderGeo = new THREE.CylinderGeometry(0.32, 0.55, 0.25, 48);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, glassMaterial);
    shoulderMesh.position.y = 0.95;
    this.bottleGroup.add(shoulderMesh);

    // Bottle Neck
    const neckGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 48);
    const neckMesh = new THREE.Mesh(neckGeo, glassMaterial);
    neckMesh.position.y = 1.15;
    this.bottleGroup.add(neckMesh);

    // 2. Inner Serum Fluid Core
    const innerFluidGeo = new THREE.CylinderGeometry(0.48, 0.48, 1.5, 36);
    this.serumLiquidMesh = new THREE.Mesh(innerFluidGeo, liquidMaterial);
    this.serumLiquidMesh.position.y = -0.08;
    this.bottleGroup.add(this.serumLiquidMesh);

    // 3. Gold Metallic Dropper Collar
    const collarGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 48);
    this.collarMesh = new THREE.Mesh(collarGeo, goldMaterial);
    this.collarMesh.position.y = 1.35;
    this.collarMesh.castShadow = true;
    this.bottleGroup.add(this.collarMesh);

    // Gold collar ribbed ring accent
    const ringGeo = new THREE.TorusGeometry(0.36, 0.025, 16, 48);
    const ringMesh = new THREE.Mesh(ringGeo, goldMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 1.35;
    this.bottleGroup.add(ringMesh);

    // 4. Matte Pipette Bulb
    // Half sphere / bulb geometry
    const bulbGeo = new THREE.SphereGeometry(0.26, 32, 24);
    bulbGeo.scale(1, 1.45, 1);
    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMaterial);
    bulbMesh.position.y = 1.82;
    this.bottleGroup.add(bulbMesh);

    // 5. Internal Glass Pipette Tube
    const pipetteGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.85, 24);
    const pipetteMesh = new THREE.Mesh(pipetteGeo, glassMaterial);
    pipetteMesh.position.y = 0.45;
    this.bottleGroup.add(pipetteMesh);

    // Droplet at pipette tip
    const dropGeo = new THREE.SphereGeometry(0.065, 16, 16);
    dropGeo.scale(1, 1.4, 1);
    const tipDrop = new THREE.Mesh(dropGeo, liquidMaterial);
    tipDrop.position.y = -0.55;
    this.bottleGroup.add(tipDrop);

    // 6. Minimal Luxury Label on Bottle
    const labelGeo = new THREE.CylinderGeometry(0.556, 0.556, 1.1, 48, 1, true, -Math.PI / 3, (2 * Math.PI) / 3);
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 1024;
    labelCanvas.height = 768;
    const ctx = labelCanvas.getContext('2d');

    // Draw luxury label texture
    ctx.fillStyle = 'rgba(247, 245, 239, 0.95)';
    ctx.fillRect(0, 0, 1024, 768);

    // Subtle gold border
    ctx.strokeStyle = '#B9A77A';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 964, 708);

    // Typography - Draw exact SKYnROOT SKINCARE Logo
    ctx.fillStyle = '#243B2E';
    
    // Draw "SKY"
    ctx.font = '600 44px "Cinzel", "Playfair Display", serif';
    ctx.textAlign = 'right';
    ctx.fillText('SKY', 485, 220);

    // Draw cursive "n"
    ctx.font = 'italic 58px "Alex Brush", "Playfair Display", cursive, serif';
    ctx.textAlign = 'center';
    ctx.fillText('n', 512, 220);

    // Draw "ROOT"
    ctx.font = '600 44px "Cinzel", "Playfair Display", serif';
    ctx.textAlign = 'left';
    ctx.fillText('ROOT', 538, 220);

    // Draw "SKINCARE" below
    ctx.fillStyle = '#1A2820';
    ctx.font = '500 18px "Cinzel", "Plus Jakarta Sans", serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '7px';
    ctx.fillText('SKINCARE', 512, 260);

    // Subtitle
    ctx.fillStyle = '#B9A77A';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('SIGNATURE SERUM', 512, 310);

    ctx.fillStyle = '#4B554D';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('BOTANICAL ELIXIR  •  30 ML', 512, 360);

    ctx.strokeStyle = 'rgba(185, 167, 122, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(380, 410);
    ctx.lineTo(644, 410);
    ctx.stroke();

    ctx.fillStyle = '#5A675E';
    ctx.font = 'italic 18px "Cormorant Garamond", serif';
    ctx.fillText('Natural Skincare Meets Modern Luxury', 512, 460);

    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelMaterial = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.6,
      metalness: 0.1,
      transparent: true,
      side: THREE.DoubleSide
    });

    const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
    labelMesh.position.y = -0.05;
    this.bottleGroup.add(labelMesh);

    // Position entire bottle group nicely
    this.bottleGroup.position.set(0.65, 0.1, 0);
    this.scene.add(this.bottleGroup);
  }

  buildPedestal() {
    const pedestalGroup = new THREE.Group();

    // Travertine stone pedestal
    const stoneGeo = new THREE.CylinderGeometry(1.4, 1.5, 0.45, 48);
    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0xe8e0d2,
      roughness: 0.88,
      metalness: 0.05
    });

    const stoneMesh = new THREE.Mesh(stoneGeo, stoneMaterial);
    stoneMesh.position.y = -1.35;
    stoneMesh.receiveShadow = true;
    pedestalGroup.add(stoneMesh);

    // Soft Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(20, 30, 24, 0.55)');
    grad.addColorStop(0.5, 'rgba(36, 59, 46, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.12;
    pedestalGroup.add(shadowMesh);

    this.scene.add(pedestalGroup);
    this.pedestalGroup = pedestalGroup;
  }

  buildBotanicals() {
    // Elegant procedural botanical leaves floating around bottle
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.25, 0.45, 0.15, 0.95);
    leafShape.quadraticCurveTo(0, 1.25, 0, 1.35);
    leafShape.quadraticCurveTo(0, 1.25, -0.15, 0.95);
    leafShape.quadraticCurveTo(-0.25, 0.45, 0, 0);

    const leafGeo = new THREE.ShapeGeometry(leafShape);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x48644e,
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    const leafPositions = [
      { x: -1.7, y: 0.8, z: 0.5, scale: 0.65, rotX: 0.3, rotY: 0.8, rotZ: -0.4 },
      { x: -1.2, y: -0.6, z: 0.9, scale: 0.5, rotX: 0.2, rotY: -0.5, rotZ: 0.7 },
      { x: 2.1, y: 1.1, z: -0.5, scale: 0.7, rotX: -0.4, rotY: 1.1, rotZ: -0.8 },
      { x: 1.8, y: -0.4, z: 0.8, scale: 0.55, rotX: 0.5, rotY: -0.8, rotZ: 0.4 },
      { x: -0.4, y: 1.9, z: -0.8, scale: 0.45, rotX: -0.6, rotY: 0.3, rotZ: 0.2 }
    ];

    leafPositions.forEach((pos, idx) => {
      const leaf = new THREE.Mesh(leafGeo, leafMat.clone());
      leaf.position.set(pos.x, pos.y, pos.z);
      leaf.scale.set(pos.scale, pos.scale, pos.scale);
      leaf.rotation.set(pos.rotX, pos.rotY, pos.rotZ);
      leaf.userData = {
        baseY: pos.y,
        speed: 0.0015 + idx * 0.0006,
        phase: idx * 1.3,
        rotSpeed: 0.005 + idx * 0.002
      };
      this.leaves.push(leaf);
      this.scene.add(leaf);
    });

    // Floating water droplets
    const dropletGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const dropletMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      roughness: 0.05,
      ior: 1.33,
      transparent: true,
      opacity: 0.9
    });

    for (let i = 0; i < 9; i++) {
      const drop = new THREE.Mesh(dropletGeo, dropletMat);
      const angle = (i / 9) * Math.PI * 2;
      const radius = 1.3 + Math.random() * 0.7;
      drop.position.set(
        Math.cos(angle) * radius + 0.3,
        (Math.random() - 0.5) * 2.2,
        Math.sin(angle) * radius * 0.6
      );
      drop.userData = {
        baseY: drop.position.y,
        speed: 0.002 + Math.random() * 0.002,
        phase: Math.random() * Math.PI * 2
      };
      this.droplets.push(drop);
      this.scene.add(drop);
    }
  }

  buildParticles() {
    // Subtle golden & ivory atmospheric motes
    const count = 75;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 6;
      positions[i + 2] = (Math.random() - 0.5) * 5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xb9a77a,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  setupEvents() {
    // Mouse Parallax & Drag Rotation
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;
        this.manualRotationY += deltaX * 0.008;
        this.manualRotationX += deltaY * 0.004;
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

    // Touch support
    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;
        this.manualRotationY += deltaX * 0.01;
        this.manualRotationX += deltaY * 0.005;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Scroll-linked 3D choreography
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight * 2;
      this.scrollProgress = Math.min(scrollY / maxScroll, 1);
    }, { passive: true });

    // Window Resize
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer) return;
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });

    // Color theme toggle buttons
    const themeButtons = document.querySelectorAll('[data-finish-theme]');
    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-finish-theme');
        this.setTheme(theme);
        themeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  setTheme(themeKey) {
    if (!this.themes[themeKey]) return;
    this.currentTheme = themeKey;
    const theme = this.themes[themeKey];

    if (this.serumLiquidMesh && this.liquidMaterial) {
      this.liquidMaterial.color.setHex(theme.liquid);
      this.liquidMaterial.roughness = theme.roughness;
      this.liquidMaterial.transmission = theme.transmission;
      this.liquidMaterial.attenuationColor.setHex(theme.liquid);
    }

    if (this.glowLight) {
      this.glowLight.color.setHex(theme.liquid);
    }
  }

  animate(timestamp) {
    requestAnimationFrame(this.animate);

    const time = timestamp * 0.001;

    // Smooth mouse parallax interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Damp manual drag rotation
    if (!this.isDragging) {
      this.manualRotationY += 0.0025; // Gentle continuous auto spin
      this.manualRotationX *= 0.95;
    }

    // Update Bottle Group
    if (this.bottleGroup) {
      // Gentle breathing float
      const floatY = Math.sin(time * 1.5) * 0.04;
      this.bottleGroup.position.y = 0.1 + floatY - this.scrollProgress * 0.4;
      this.bottleGroup.position.x = 0.65 - this.scrollProgress * 0.9 + this.mouseX * 0.15;
      this.bottleGroup.position.z = -this.scrollProgress * 0.6;

      this.bottleGroup.rotation.y = this.manualRotationY + this.mouseX * 0.3;
      this.bottleGroup.rotation.x = this.manualRotationX + this.mouseY * 0.15;
      this.bottleGroup.rotation.z = Math.sin(time * 0.8) * 0.02 - this.mouseX * 0.05;
    }

    // Pedestal update
    if (this.pedestalGroup) {
      this.pedestalGroup.position.x = 0.65 - this.scrollProgress * 0.9 + this.mouseX * 0.08;
      this.pedestalGroup.position.y = -1.35 - this.scrollProgress * 0.4;
    }

    // Leaves gentle organic flutter
    this.leaves.forEach((leaf) => {
      const data = leaf.userData;
      leaf.position.y = data.baseY + Math.sin(time * 2 + data.phase) * 0.08;
      leaf.rotation.z += Math.sin(time + data.phase) * 0.002;
      leaf.rotation.y += Math.cos(time * 0.5 + data.phase) * 0.003;
    });

    // Droplets floating
    this.droplets.forEach((drop) => {
      const data = drop.userData;
      drop.position.y = data.baseY + Math.sin(time * 1.8 + data.phase) * 0.06;
    });

    // Particles subtle orbit
    if (this.particles) {
      this.particles.rotation.y = time * 0.02;
    }

    // Camera dynamic view adjustment
    this.camera.position.x = this.mouseX * 0.25;
    this.camera.position.y = 0.2 - this.mouseY * 0.2;
    this.camera.lookAt(0.15, 0.1, 0);

    this.renderer.render(this.scene, this.camera);
  }
}
