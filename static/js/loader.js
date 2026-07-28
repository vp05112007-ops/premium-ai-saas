/**
 * ==========================================================================
 * Premium 3D AI Robot Loading Screen
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    const loaderContainer = document.getElementById('loading-screen');
    const canvasContainer = document.getElementById('loading-canvas');
    if (!loaderContainer || !canvasContainer || typeof THREE === 'undefined') {
        // Fallback: just immediately start hero
        document.dispatchEvent(new Event('LoadingComplete'));
        return;
    }

    // ==========================================
    // Scene Setup
    // ==========================================
    const scene = new THREE.Scene();
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    canvasContainer.appendChild(renderer.domElement);

    const fov = 35;
    const camera = new THREE.PerspectiveCamera(fov, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    
    // ==========================================
    // Lighting (Premium Studio)
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xebf4ff, 0.6);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x5b5ceb, 2.5);
    rimLight.position.set(-5, 5, -8);
    scene.add(rimLight);

    // ==========================================
    // Variables
    // ==========================================
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    let mixer;
    const clock = new THREE.Clock();
    let isTransitioning = false;
    let animationId = null;

    // ==========================================
    // Load Model
    // ==========================================
    const loader = new THREE.GLTFLoader();
    const modelPath = '/static/icons/mini_robot.glb';

    loader.load(
        modelPath,
        (gltf) => {
            const robotModel = gltf.scene;

            // Center the model
            const box = new THREE.Box3().setFromObject(robotModel);
            const center = box.getCenter(new THREE.Vector3());
            robotModel.position.x = -center.x;
            robotModel.position.y = -center.y;
            robotModel.position.z = -center.z;
            
            robotGroup.add(robotModel);

            // Auto-frame
            box.setFromObject(robotModel);
            const size = box.getSize(new THREE.Vector3());
            const requiredHeight = size.y * 1.5; 
            let cameraZ = Math.abs(requiredHeight / 2 / Math.tan((camera.fov * Math.PI / 180) / 2));
            cameraZ += size.z / 2; 
            camera.position.set(0, 0, cameraZ);
            camera.lookAt(0, 0, 0);

            // Fix Materials
            robotModel.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.needsUpdate = true;
                    if (child.material.opacity === 0 || child.material.visible === false) {
                        child.material.opacity = 1;
                        child.material.visible = true;
                        child.material.transparent = false;
                    }
                }
            });

            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(robotModel);
                const action = mixer.clipAction(gltf.animations[0]);
                action.play();
            }

            // Start Loading Sequence only after model is loaded to memory
            startLoadingSequence();
        }
    );

    // ==========================================
    // Animation Loop
    // ==========================================
    function animate() {
        if (!renderer) return;
        animationId = requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        if (mixer) mixer.update(delta);

        if (!isTransitioning) {
            // Subtle slow rotation
            robotGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.3;
            
            // Premium Floating
            robotGroup.position.y = Math.sin(elapsedTime * 2) * 0.05;
        }

        renderer.render(scene, camera);
    }
    animate();

    // ==========================================
    // Loading Sequence
    // ==========================================
    function startLoadingSequence() {
        const progressText = document.querySelector('.progress-text');
        const statusText = document.querySelector('.status-text');
        const progressFill = document.querySelector('.progress-fill');
        
        const statuses = [
            "Initializing AI Platform...",
            "Loading AI Models...",
            "Preparing Workspace...",
            "Optimizing Experience...",
            "Almost Ready."
        ];

        let progress = 0;
        
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 12) + 4;
            if (progress > 100) progress = 100;
            
            progressText.textContent = `${progress}%`;
            progressFill.style.width = `${progress}%`;

            if (progress < 25) statusText.textContent = statuses[0];
            else if (progress < 50) statusText.textContent = statuses[1];
            else if (progress < 75) statusText.textContent = statuses[2];
            else if (progress < 100) statusText.textContent = statuses[3];
            else statusText.textContent = statuses[4];

            if (progress === 100) {
                clearInterval(interval);
                triggerTransition();
            }
        }, 200);
    }

    // ==========================================
    // Teardown & Transition
    // ==========================================
    function triggerTransition() {
        isTransitioning = true;

        // Subtle finishing animation (quick nod & scale)
        gsap.to(robotGroup.rotation, {
            x: 0.15,
            duration: 0.4,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });

        const tl = gsap.timeline();
        
        tl.to(".progress-wrapper", {
            opacity: 0,
            y: 20,
            duration: 0.5
        })
        .to(loaderContainer, {
            opacity: 0,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: destroyLoaderScene
        });
    }

    function destroyLoaderScene() {
        // Stop animation loop
        if (animationId) cancelAnimationFrame(animationId);
        
        // Remove from DOM
        loaderContainer.style.display = 'none';
        loaderContainer.remove();

        // Memory Cleanup (Prevent WebGL Context Leaks)
        scene.traverse((child) => {
            if (child.isMesh) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            }
        });
        
        renderer.dispose();
        
        // Trigger Hero Robot Initialization
        document.dispatchEvent(new Event('LoadingComplete'));
    }
});
