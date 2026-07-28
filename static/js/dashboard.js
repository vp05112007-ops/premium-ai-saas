/**
 * ==========================================================================
 * Dashboard JS
 * ==========================================================================
 * Handles the Three.js AI Brain initialization and dashboard interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {
    initThreeJsBrain();
});

/**
 * Initializes the AI Brain 3D object inside the dashboard card.
 */
function initThreeJsBrain() {
    const container = document.getElementById('brain-canvas');
    if (!container) return;

    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded.');
        return;
    }

    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 6;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x5B5CEB, 3, 20);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x8B5CF6, 2, 20);
    pointLight2.position.set(-2, -2, 2);
    scene.add(pointLight2);

    // Create a "Brain" like structure using points (Particle System)
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    // Distribute points roughly in an ellipsoid (brain shape)
    for(let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        const rx = 2.5;
        const ry = 1.8;
        const rz = 2.0;
        
        // Push slightly inward to make it less perfectly smooth
        const radiusFuzz = 0.8 + Math.random() * 0.4;

        positions[i * 3] = rx * Math.sin(phi) * Math.cos(theta) * radiusFuzz;
        positions[i * 3 + 1] = ry * Math.cos(phi) * radiusFuzz;
        positions[i * 3 + 2] = rz * Math.sin(phi) * Math.sin(theta) * radiusFuzz;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom shader material could go here, but using PointsMaterial for simplicity right now
    const material = new THREE.PointsMaterial({
        color: 0x5B5CEB,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const brainParticles = new THREE.Points(geometry, material);
    scene.add(brainParticles);

    // Mouse tracking for slight parallax
    let mouseX = 0;
    let mouseY = 0;
    const dashboardContent = document.querySelector('.dashboard-content');
    
    if (dashboardContent) {
        dashboardContent.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            // Calculate relative to the container
            mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        });
    }

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Rotate the brain slowly
        brainParticles.rotation.y = elapsedTime * 0.1;

        // Pulsing effect using scale
        const scale = 1 + Math.sin(elapsedTime * 2) * 0.02;
        brainParticles.scale.set(scale, scale, scale);

        // Parallax based on mouse
        brainParticles.rotation.x += 0.05 * (mouseY * 0.2 - brainParticles.rotation.x);
        brainParticles.rotation.z = mouseX * 0.1;

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        if(!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}
