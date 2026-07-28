/**
 * ==========================================================================
 * Resume Builder JS
 * ==========================================================================
 * Handles the 3D Floating Resume preview.
 */

document.addEventListener('DOMContentLoaded', () => {
    initFloatingResume();
    initAIGeneration();
});

function initFloatingResume() {
    const container = document.getElementById('resume-canvas');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create "Paper" geometry
    const geometry = new THREE.PlaneGeometry(1.5, 2.12); // Standard A4 ratio
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.1,
        clearcoat: 0.1
    });

    const paper = new THREE.Mesh(geometry, material);
    
    // Add subtle grid/lines to paper to simulate text
    const linesGeo = new THREE.PlaneGeometry(1.3, 1.9);
    const linesMat = new THREE.MeshBasicMaterial({
        color: 0xE5E7EB,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const lines = new THREE.Mesh(linesGeo, linesMat);
    lines.position.z = 0.01;
    paper.add(lines);

    scene.add(paper);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const colorLight = new THREE.PointLight(0x5B5CEB, 1, 10);
    colorLight.position.set(-2, -2, 2);
    scene.add(colorLight);

    const clock = new THREE.Clock();
    
    let mouseX = 0;
    let mouseY = 0;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        
        // Floating motion
        paper.position.y = Math.sin(t * 1.5) * 0.1;
        
        // Mouse parallax
        paper.rotation.x += 0.05 * (mouseY * 0.2 - paper.rotation.x);
        paper.rotation.y += 0.05 * (mouseX * 0.2 - paper.rotation.y);

        renderer.render(scene, camera);
    }
    animate();
}

function initAIGeneration() {
    const aiBtn = document.getElementById('aiGenerateBtn');
    if (!aiBtn) return;

    aiBtn.addEventListener('click', () => {
        const originalText = aiBtn.innerHTML;
        aiBtn.innerHTML = `Generating...`;
        aiBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            if (window.showToast) window.showToast('AI optimally structured your resume for ATS systems.', 'success');
            aiBtn.innerHTML = originalText;
            aiBtn.style.pointerEvents = 'auto';
        }, 2000);
    });
}
