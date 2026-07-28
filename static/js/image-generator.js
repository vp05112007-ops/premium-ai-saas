/**
 * ==========================================================================
 * Image Generator JS
 * ==========================================================================
 * Handles UI interactions and the 3D Camera Lens setup.
 */

document.addEventListener('DOMContentLoaded', () => {
    initCameraLens();
    initGeneratorLogic();
});

function initCameraLens() {
    const container = document.getElementById('lens-canvas');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create a "Lens" using multiple transparent cylinders/tori
    const lensGroup = new THREE.Group();

    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 1.5,
        clearcoat: 1.0
    });

    const casingMaterial = new THREE.MeshStandardMaterial({
        color: 0x111827,
        metalness: 0.8,
        roughness: 0.2
    });

    // Outer casing
    const casingGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 64);
    const casing = new THREE.Mesh(casingGeo, casingMaterial);
    lensGroup.add(casing);

    // Inner glass element
    const glassGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.2, 32);
    const glass = new THREE.Mesh(glassGeo, glassMaterial);
    glass.rotation.x = Math.PI / 2;
    lensGroup.add(glass);

    scene.add(lensGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const colorLight = new THREE.PointLight(0x5B5CEB, 2, 10);
    colorLight.position.set(0, 0, 2);
    scene.add(colorLight);

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        
        lensGroup.rotation.y = Math.sin(t * 0.5) * 0.5;
        lensGroup.rotation.x = Math.cos(t * 0.5) * 0.2;

        renderer.render(scene, camera);
    }
    animate();

    // Store for access in generate logic
    window.lensGroup = lensGroup;
}

function initGeneratorLogic() {
    const generateBtn = document.getElementById('generateBtn');
    const promptInput = document.getElementById('promptInput');
    const imageContainer = document.getElementById('generatedImage');
    const lensCanvas = document.getElementById('lens-canvas');

    if (!generateBtn || !promptInput) return;

    // Style buttons selection logic
    const styleBtns = document.querySelectorAll('.style-btn');
    styleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            styleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    generateBtn.addEventListener('click', () => {
        if (!promptInput.value.trim()) return;

        // Visual feedback
        generateBtn.textContent = 'Generating...';
        generateBtn.style.opacity = '0.7';
        generateBtn.style.pointerEvents = 'none';
        
        // Spin the lens fast!
        if (window.lensGroup) {
            gsap.to(window.lensGroup.rotation, {
                z: "+=10",
                duration: 2,
                ease: "power2.inOut"
            });
        }

        setTimeout(() => {
            generateBtn.textContent = 'Generate';
            generateBtn.style.opacity = '1';
            generateBtn.style.pointerEvents = 'auto';

            // Hide lens, show image
            if (lensCanvas) lensCanvas.style.display = 'none';
            imageContainer.style.display = 'block';

            // Fake image generation (placehold.co for demo)
            imageContainer.innerHTML = `<img src="https://placehold.co/600x600/5B5CEB/FFFFFF?text=Generated+Image" alt="Generated Output">`;
            
            gsap.from(imageContainer, {
                scale: 0.9,
                opacity: 0,
                duration: 0.5,
                ease: "back.out(1.7)"
            });

            if (window.showToast) window.showToast('Image generated successfully!', 'success');
        }, 2000);
    });
}
