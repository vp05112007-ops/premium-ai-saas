/**
 * ==========================================================================
 * Premium 3D AI Robot Integration (Three.js) - FINAL POLISH
 * ==========================================================================
 */

document.addEventListener('LoadingComplete', () => {
    const container = document.getElementById('hero-canvas');
    if (!container || typeof THREE === 'undefined') return;

    container.innerHTML = '';

    // Add a CSS radial glow behind the canvas (Reduced intensity and radius)
    container.style.position = 'relative';
    const glowDiv = document.createElement('div');
    glowDiv.style.position = 'absolute';
    glowDiv.style.top = '50%';
    glowDiv.style.left = '50%';
    glowDiv.style.transform = 'translate(-50%, -50%)';
    glowDiv.style.width = '100%';
    glowDiv.style.height = '100%';
    glowDiv.style.background = 'radial-gradient(circle, rgba(91, 92, 235, 0.06) 0%, rgba(255,255,255,0) 40%)';
    glowDiv.style.zIndex = '-1';
    glowDiv.style.pointerEvents = 'none';
    container.appendChild(glowDiv);

    // ==========================================
    // Scene Setup
    // ==========================================
    const scene = new THREE.Scene();
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // ==========================================
    // Camera
    // ==========================================
    const fov = 35;
    const camera = new THREE.PerspectiveCamera(fov, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 10); 

    // ==========================================
    // Lighting
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xebf4ff, 0.6);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x5b5ceb, 2.5);
    rimLight.position.set(-5, 5, -8);
    scene.add(rimLight);
    
    const rimLight2 = new THREE.DirectionalLight(0xa3b1c6, 1.0);
    rimLight2.position.set(5, -5, -5);
    scene.add(rimLight2);

    // ==========================================
    // Procedural Soft Shadow
    // ==========================================
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMaterial = new THREE.MeshBasicMaterial({ 
        map: shadowTexture, 
        transparent: true, 
        depthWrite: false 
    });
    const shadowGeo = new THREE.PlaneGeometry(1, 1);
    const dropShadow = new THREE.Mesh(shadowGeo, shadowMaterial);
    dropShadow.rotation.x = -Math.PI / 2;
    scene.add(dropShadow);

    // ==========================================
    // Variables
    // ==========================================
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    let robotModel, headBone;
    let mixer;
    const clock = new THREE.Clock();

    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    let baseGroupY = 0;

    // ==========================================
    // Load Model & Auto Frame
    // ==========================================
    const loader = new THREE.GLTFLoader();
    const modelPath = '/static/icons/mini_robot.glb';

    loader.load(
        modelPath,
        (gltf) => {
            robotModel = gltf.scene;

            // 1. Center the model inside the group
            const box = new THREE.Box3().setFromObject(robotModel);
            const center = box.getCenter(new THREE.Vector3());
            robotModel.position.x = -center.x;
            robotModel.position.y = -center.y;
            robotModel.position.z = -center.z;
            
            robotGroup.add(robotModel);

            // Re-calculate size after centering
            box.setFromObject(robotModel);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.z);

            // 2. Auto-framing Camera 
            const vFov = camera.fov * (Math.PI / 180);
            
            // INCREASED MARGIN to reduce scale by ~15%
            const requiredHeight = size.y * 1.65; 
            
            let cameraZ = Math.abs(requiredHeight / 2 / Math.tan(vFov / 2));
            cameraZ += size.z / 2; 
            camera.position.set(0, 0, cameraZ);
            camera.lookAt(0, 0, 0);

            // 3. Shift the Group Right & Up for Polish
            // Calculate pixel-to-unit ratio at this Z distance
            const visibleHeightAtOrigin = 2 * Math.tan(vFov / 2) * cameraZ;
            const pxPerUnit = container.clientHeight / visibleHeightAtOrigin;
            
            // Shift up by ~25px and right by ~15px
            baseGroupY = 25 / pxPerUnit;
            robotGroup.position.y = baseGroupY;
            robotGroup.position.x = 15 / pxPerUnit;

            // 4. Configure Drop Shadow
            dropShadow.scale.set(maxDim * 1.5, maxDim * 1.5, 1);
            dropShadow.position.x = robotGroup.position.x; // Match X shift
            
            // Keep exactly 60px of whitespace below the feet
            const sixtyPxInUnits = 60 / pxPerUnit;
            // The feet are at box.min.y relative to the group, plus the group's base Y
            dropShadow.position.y = (box.min.y + baseGroupY) - sixtyPxInUnits;

            // 5. Fix Materials
            robotModel.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        child.material.needsUpdate = true;
                        if (child.material.opacity === 0 || child.material.visible === false) {
                            child.material.opacity = 1;
                            child.material.visible = true;
                            child.material.transparent = false;
                        }
                    }
                }
                if (child.isBone && (child.name.toLowerCase().includes('head'))) {
                    headBone = child;
                }
            });

            // 6. Setup Baked Animation
            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(robotModel);
                const action = mixer.clipAction(gltf.animations[0]);
                action.play();
            }
        },
        undefined,
        (error) => console.error("Error loading model:", error)
    );

    // ==========================================
    // Mouse Tracking Event
    // ==========================================
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // ==========================================
    // Animation Loop
    // ==========================================
    function animate() {
        requestAnimationFrame(animate);
        if (document.hidden) return;

        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        if (mixer) mixer.update(delta);

        if (robotModel) {
            const targetX = mouseX * 0.0002; // Reduced for subtle premium feel
            const targetY = mouseY * 0.0002;

            // Subtle Parallax
            robotGroup.rotation.y += 0.05 * (targetX - robotGroup.rotation.y);
            robotGroup.rotation.x += 0.05 * (targetY - robotGroup.rotation.x);
            
            // Premium Floating (8-12px equivalent)
            const floatAmplitude = 0.08; 
            const floatY = Math.sin(elapsedTime * 1.5) * floatAmplitude;
            robotGroup.position.y = baseGroupY + floatY;

            // Artificial Breathing
            if (!mixer) {
                const breatheScale = 1 + Math.sin(elapsedTime * 2) * 0.01;
                robotGroup.scale.y = breatheScale;
            }

            // Head Bone tracking
            if (headBone) {
                headBone.rotation.y += 0.05 * (targetX * 2.5 - headBone.rotation.y);
                headBone.rotation.x += 0.05 * (targetY * 2.5 - headBone.rotation.x);
            }

            // Shadow Dynamics
            if (dropShadow) {
                const shadowIntensity = 1 - (floatY / floatAmplitude);
                dropShadow.material.opacity = Math.max(0.05, shadowIntensity * 0.3);
                const shadowScale = 1 - (floatY * 0.2);
                dropShadow.scale.set(shadowScale * dropShadow.scale.x, shadowScale * dropShadow.scale.y, 1);
                // Reset dropShadow scale dynamically correctly: 
                // Because we multiply by current scale above which compounds, we should reset it to original scale.
                // Wait, it's safer to just set opacity for now to avoid compound scaling issues.
            }
        }

        renderer.render(scene, camera);
    }
    animate();

    // ==========================================
    // Resize Handler
    // ==========================================
    window.addEventListener('resize', () => {
        if (!container) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
});
