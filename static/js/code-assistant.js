/**
 * ==========================================================================
 * Code Assistant JS
 * ==========================================================================
 * Handles the 3D Processor model and IDE interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {
    initProcessor3D();
});

function initProcessor3D() {
    const container = document.getElementById('processor-canvas');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 4;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create a "Processor Chip"
    const group = new THREE.Group();

    // Base board
    const boardGeo = new THREE.BoxGeometry(2, 0.1, 2);
    const boardMat = new THREE.MeshStandardMaterial({
        color: 0x111827,
        metalness: 0.5,
        roughness: 0.8
    });
    const board = new THREE.Mesh(boardGeo, boardMat);
    group.add(board);

    // Core chip
    const coreGeo = new THREE.BoxGeometry(1, 0.2, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
        color: 0x111827,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.1;
    group.add(core);

    // Glowing circuits
    const circuitGeo = new THREE.PlaneGeometry(1.8, 1.8);
    const circuitMat = new THREE.MeshBasicMaterial({
        color: 0x5B5CEB,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const circuit = new THREE.Mesh(circuitGeo, circuitMat);
    circuit.rotation.x = -Math.PI / 2;
    circuit.position.y = 0.06;
    group.add(circuit);

    scene.add(group);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x5B5CEB, 2, 5);
    coreLight.position.set(0, 0.5, 0);
    scene.add(coreLight);

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        
        group.rotation.y = t * 0.3;
        
        // Pulse the core light
        coreLight.intensity = 2 + Math.sin(t * 5) * 1;

        renderer.render(scene, camera);
    }
    animate();
}
