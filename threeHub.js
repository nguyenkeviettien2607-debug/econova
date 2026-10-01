/**
 * ECONOVA - Three.js 3D Earth Hub & 3D Dice Station
 * Features:
 * 1. Interactive 3D Earth Globe that dynamically transforms from polluted toxic smog
 *    to radiant lush emerald green as the Global Green Score increases.
 * 2. 3D Dice Station with realistic tumbling & bouncing physics animation.
 */
class ThreeBoardHub {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.earthGroup = null;
        this.earthMesh = null;
        this.cloudsMesh = null;
        this.atmosphereMesh = null;
        this.diceStationGroup = null;
        this.die1 = null;
        this.die2 = null;

        this.isRolling = false;
        this.diceRollCallback = null;

        // Current health status (0 = fully polluted, 100 = Gaia restored)
        this.greenScore = 15;
        this.targetGreenScore = 15;

        // Mouse drag interaction
        this.isDragging = false;
        this.prevMousePos = { x: 0, y: 0 };
        this.earthRotationSpeed = 0.002;

        this.init();
    }

    init() {
        if (!this.container) return;

        const width = this.container.clientWidth || 360;
        const height = this.container.clientHeight || 360;

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(0, 5, 14);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
        sunLight.position.set(12, 18, 10);
        sunLight.castShadow = true;
        this.scene.add(sunLight);

        const rimLight = new THREE.PointLight(0x38bdf8, 2.0, 30);
        rimLight.position.set(-10, -5, -8);
        this.scene.add(rimLight);

        // Build 3D Earth
        this.createEarth();

        // Build 3D Dice Station
        this.createDiceStation();

        // Event listeners
        this.setupInteraction();

        // Animation Loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    // Procedural Earth Textures Generator using HTML5 Canvas
    generateEarthTexture(healthPercent) {
        // healthPercent: 0 to 1
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Ocean Color Gradient
        // Low: muddy murky dark brown-purple (#2a1d27 -> #1a2228)
        // High: brilliant cyan ocean (#0284c7 -> #0369a1)
        const rOcean = Math.round(42 * (1 - healthPercent) + 2 * healthPercent);
        const gOcean = Math.round(29 * (1 - healthPercent) + 132 * healthPercent);
        const bOcean = Math.round(39 * (1 - healthPercent) + 199 * healthPercent);

        ctx.fillStyle = `rgb(${rOcean}, ${gOcean}, ${bOcean})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ocean current subtle waves
        ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + 0.1 * healthPercent})`;
        for (let i = 0; i < 40; i++) {
            const y = Math.random() * canvas.height;
            ctx.fillRect(0, y, canvas.width, 2 + Math.random() * 4);
        }

        // Continent Colors
        // Low health: dark toxic ash gray (#3f3f46, #52525b)
        // High health: lush emerald green & gold (#059669, #10b981, #34d399)
        const rLand = Math.round(65 * (1 - healthPercent) + 16 * healthPercent);
        const gLand = Math.round(65 * (1 - healthPercent) + 185 * healthPercent);
        const bLand = Math.round(70 * (1 - healthPercent) + 105 * healthPercent);

        // Draw continents using procedural shapes simulating Earth landmasses
        ctx.fillStyle = `rgb(${rLand}, ${gLand}, ${bLand})`;

        // Eurasia & Africa
        this.drawBlob(ctx, 550, 220, 160, 110);
        this.drawBlob(ctx, 600, 320, 100, 130);
        this.drawBlob(ctx, 750, 200, 140, 90);
        // Americas
        this.drawBlob(ctx, 240, 180, 110, 130);
        this.drawBlob(ctx, 310, 340, 90, 140);
        // Australia
        this.drawBlob(ctx, 820, 380, 80, 60);

        // Toxic smog or lush forest sparkles
        if (healthPercent < 0.4) {
            // Toxic purple/yellow smog stains
            ctx.fillStyle = "rgba(220, 38, 38, 0.25)";
            for (let i = 0; i < 25; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 20 + Math.random() * 40, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // Sparkling golden / emerald bio-hubs
            ctx.fillStyle = "rgba(251, 191, 36, 0.45)";
            for (let i = 0; i < 35; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 3 + Math.random() * 6, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        return new THREE.CanvasTexture(canvas);
    }

    drawBlob(ctx, cx, cy, rx, ry) {
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.2) {
            const rad = 1 + (Math.sin(a * 4) * 0.15) + (Math.cos(a * 3) * 0.1);
            const x = cx + Math.cos(a) * rx * rad;
            const y = cy + Math.sin(a) * ry * rad;
            if (a === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }

    createEarth() {
        this.earthGroup = new THREE.Group();
        this.earthGroup.position.set(0, 1.2, 0);

        // Core Sphere
        const earthGeo = new THREE.SphereGeometry(2.5, 64, 64);
        const texture = this.generateEarthTexture(this.greenScore / 100);
        const earthMat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.6,
            metalness: 0.1
        });
        this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
        this.earthMesh.castShadow = true;
        this.earthMesh.receiveShadow = true;
        this.earthGroup.add(this.earthMesh);

        // Cloud Layer
        const cloudGeo = new THREE.SphereGeometry(2.54, 48, 48);
        const cloudMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending
        });
        this.cloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
        this.earthGroup.add(this.cloudsMesh);

        // Atmosphere Glow
        const atmosGeo = new THREE.SphereGeometry(2.72, 48, 48);
        const atmosMat = new THREE.MeshBasicMaterial({
            color: this.greenScore > 50 ? 0x10b981 : 0xd97706,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        this.atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
        this.earthGroup.add(this.atmosphereMesh);

        this.scene.add(this.earthGroup);
    }

    createDiceStation() {
        this.diceStationGroup = new THREE.Group();
        this.diceStationGroup.position.set(0, -2.8, 2.5);

        // Futuristic Glass Pedestal Ring
        const ringGeo = new THREE.CylinderGeometry(3.0, 3.2, 0.4, 32);
        const ringMat = new THREE.MeshPhysicalMaterial({
            color: 0x059669,
            metalness: 0.2,
            roughness: 0.1,
            transmission: 0.85,
            transparent: true,
            opacity: 0.85,
            reflectivity: 0.9
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.receiveShadow = true;
        this.diceStationGroup.add(ringMesh);

        // Holographic Glowing Rim
        const rimGeo = new THREE.TorusGeometry(3.1, 0.06, 16, 64);
        const rimMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.rotation.x = Math.PI / 2;
        rim.position.y = 0.21;
        this.diceStationGroup.add(rim);

        // Create 2 3D Dice
        this.die1 = this.create3DDie(0x10b981, 0xffffff);
        this.die1.position.set(-1.0, 0.65, 0);
        this.diceStationGroup.add(this.die1);

        this.die2 = this.create3DDie(0x0284c7, 0xffffff);
        this.die2.position.set(1.0, 0.65, 0);
        this.diceStationGroup.add(this.die2);

        this.scene.add(this.diceStationGroup);
    }

    // Creates a textured 3D cube with rounded appearance and dot pips
    create3DDie(dieColor, dotColor) {
        const size = 0.85;
        const geometry = new THREE.BoxGeometry(size, size, size);

        // Generate 6 canvas face textures (1 to 6 pips)
        const materials = [];
        for (let i = 1; i <= 6; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');

            // Die face background
            ctx.fillStyle = `#${dieColor.toString(16).padStart(6, '0')}`;
            this.roundRect(ctx, 0, 0, 128, 128, 20);
            ctx.fill();

            // Inner border
            ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
            ctx.lineWidth = 6;
            this.roundRect(ctx, 6, 6, 116, 116, 16);
            ctx.stroke();

            // Pips
            ctx.fillStyle = `#${dotColor.toString(16).padStart(6, '0')}`;
            const dotR = 10;
            const drawDot = (x, y) => {
                ctx.beginPath();
                ctx.arc(x, y, dotR, 0, Math.PI * 2);
                ctx.fill();
            };

            const mid = 64, left = 32, right = 96, top = 32, bot = 96;

            if (i === 1) drawDot(mid, mid);
            else if (i === 2) { drawDot(left, top); drawDot(right, bot); }
            else if (i === 3) { drawDot(left, top); drawDot(mid, mid); drawDot(right, bot); }
            else if (i === 4) { drawDot(left, top); drawDot(right, top); drawDot(left, bot); drawDot(right, bot); }
            else if (i === 5) { drawDot(left, top); drawDot(right, top); drawDot(mid, mid); drawDot(left, bot); drawDot(right, bot); }
            else if (i === 6) { drawDot(left, top); drawDot(left, mid); drawDot(left, bot); drawDot(right, top); drawDot(right, mid); drawDot(right, bot); }

            const texture = new THREE.CanvasTexture(canvas);
            materials.push(new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3, metalness: 0.1 }));
        }

        const dieMesh = new THREE.Mesh(geometry, materials);
        dieMesh.castShadow = true;
        return dieMesh;
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    // Target rotation vectors for each dice face pointing UP (+Y)
    getFaceRotation(value) {
        // Three.js BoxGeometry faces order:
        // 0: +X, 1: -X, 2: +Y, 3: -Y, 4: +Z, 5: -Z
        // Our materials array: 0=1, 1=2, 2=3, 3=4, 4=5, 5=6
        // Face 3 is already +Y (value 3). For other values we rotate appropriately:
        switch (value) {
            case 1: return { x: 0, y: 0, z: Math.PI / 2 };
            case 2: return { x: 0, y: 0, z: -Math.PI / 2 };
            case 3: return { x: 0, y: 0, z: 0 };
            case 4: return { x: Math.PI, y: 0, z: 0 };
            case 5: return { x: -Math.PI / 2, y: 0, z: 0 };
            case 6: return { x: Math.PI / 2, y: 0, z: 0 };
            default: return { x: 0, y: 0, z: 0 };
        }
    }

    // Roll the 2 dice with physics tumble and sound
    rollDice(val1, val2, onComplete) {
        if (this.isRolling) return;
        this.isRolling = true;

        if (window.soundEngine) {
            window.soundEngine.playDiceRoll();
        }

        const startY = 0.65;
        const peakY = 2.4;
        const duration = 1100; // ms
        const startTime = performance.now();

        const rot1 = this.getFaceRotation(val1);
        const rot2 = this.getFaceRotation(val2);

        // Extra full spins
        const extraSpins = 4 * Math.PI;

        const animateRoll = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out bounce
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            // Parabolic jump trajectory
            const currentY = startY + Math.sin(progress * Math.PI) * (peakY - startY);
            this.die1.position.y = currentY;
            this.die2.position.y = currentY;

            // Tumbling rotation
            const currentSpin = (1 - progress) * extraSpins;
            this.die1.rotation.x = rot1.x + currentSpin * 1.5;
            this.die1.rotation.y = rot1.y + currentSpin * 2.1;
            this.die1.rotation.z = rot1.z + currentSpin * 1.2;

            this.die2.rotation.x = rot2.x + currentSpin * 1.8;
            this.die2.rotation.y = rot2.y + currentSpin * 1.4;
            this.die2.rotation.z = rot2.z + currentSpin * 2.3;

            if (progress < 1) {
                requestAnimationFrame(animateRoll);
            } else {
                // Settle exactly on target face
                this.die1.position.y = startY;
                this.die2.position.y = startY;
                this.die1.rotation.set(rot1.x, rot1.y, rot1.z);
                this.die2.rotation.set(rot2.x, rot2.y, rot2.z);
                this.isRolling = false;
                if (onComplete) onComplete(val1 + val2, val1, val2);
            }
        };

        requestAnimationFrame(animateRoll);
    }

    // Dynamic Earth Health Update
    updateGlobalHealth(score) {
        this.targetGreenScore = Math.max(0, Math.min(100, score));
        this.greenScore = this.targetGreenScore;

        if (this.earthMesh) {
            const newTex = this.generateEarthTexture(this.greenScore / 100);
            this.earthMesh.material.map = newTex;
            this.earthMesh.material.needsUpdate = true;
        }

        if (this.atmosphereMesh) {
            const isHealed = this.greenScore >= 60;
            this.atmosphereMesh.material.color.setHex(isHealed ? 0x10b981 : (this.greenScore >= 35 ? 0x0284c7 : 0xd97706));
            this.atmosphereMesh.material.opacity = 0.2 + (this.greenScore / 100) * 0.25;
        }
    }

    setupInteraction() {
        const dom = this.renderer.domElement;
        dom.style.cursor = 'grab';

        dom.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.prevMousePos = { x: e.clientX, y: e.clientY };
            dom.style.cursor = 'grabbing';
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
            dom.style.cursor = 'grab';
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging || !this.earthGroup) return;
            const deltaX = e.clientX - this.prevMousePos.x;
            const deltaY = e.clientY - this.prevMousePos.y;
            this.earthGroup.rotation.y += deltaX * 0.008;
            this.earthGroup.rotation.x += deltaY * 0.008;
            this.prevMousePos = { x: e.clientX, y: e.clientY };
        });

        // Touch support
        dom.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        });

        window.addEventListener('touchend', () => { this.isDragging = false; });

        window.addEventListener('touchmove', (e) => {
            if (!this.isDragging || !this.earthGroup || e.touches.length !== 1) return;
            const deltaX = e.touches[0].clientX - this.prevMousePos.x;
            this.earthGroup.rotation.y += deltaX * 0.008;
            this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        });
    }

    onWindowResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(this.animate);

        // Constant gentle rotation of Earth & clouds
        if (this.earthMesh && !this.isDragging) {
            this.earthMesh.rotation.y += 0.003;
        }
        if (this.cloudsMesh) {
            this.cloudsMesh.rotation.y += 0.0045;
        }

        // Gentle floating wobble for dice station
        if (this.diceStationGroup && !this.isRolling) {
            this.diceStationGroup.rotation.y += 0.002;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.ThreeBoardHub = ThreeBoardHub;
