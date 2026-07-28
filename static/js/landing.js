/**
 * ==========================================================================
 * Landing Page JS
 * ==========================================================================
 * Handles GSAP scroll animations and Three.js setup for the Landing Page.
 */

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    initHeroAnimation();
    initHorizontalScroll();
    initTimelineAnimation();
    initThreeJsHero();
    initDemoModal();
});

function initHeroAnimation() {
    const tl = gsap.timeline();

    tl.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
    })
    .from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, "-=0.6")
    .from('.hero-actions', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
    }, "-=0.4");
}

function initHorizontalScroll() {
    const track = document.querySelector('.showcase-track');
    if (!track) return;

    // Calculate how far to scroll based on track width vs window width
    function getScrollAmount() {
        let trackWidth = track.scrollWidth;
        return -(trackWidth - window.innerWidth + 40); // 40px for padding
    }

    gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
            trigger: ".showcase-section",
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
        }
    });
}

function initTimelineAnimation() {
    const points = document.querySelectorAll('.timeline-point');
    const contents = document.querySelectorAll('.timeline-content');

    points.forEach((point, i) => {
        gsap.from(point, {
            scale: 0,
            opacity: 0,
            scrollTrigger: {
                trigger: point,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
        
        gsap.from(contents[i], {
            y: 30,
            opacity: 0,
            duration: 0.6,
            scrollTrigger: {
                trigger: point,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });
}

/**
 * Basic Three.js setup for the Hero section.
 * This sets up a placeholder rotating geometric structure (until custom models are imported).
 */
function initThreeJsHero() {
    const container = document.getElementById('hero-canvas');
    if (!container) return;
    
    // We expect Three.js to be loaded globally via CDN for now.
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded.');
        return;
    }

    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x5B5CEB, 2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const accentLight = new THREE.PointLight(0x8B5CF6, 2, 10);
    accentLight.position.set(-2, -2, 2);
    scene.add(accentLight);

    // Placeholder object (Icosahedron to look "AI/Tech" like)
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.9, // glass effect
        thickness: 0.5
    });
    
    const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x5B5CEB,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });

    const mesh = new THREE.Mesh(geometry, material);
    const wireframe = new THREE.Mesh(geometry, wireframeMat);
    wireframe.scale.set(1.01, 1.01, 1.01);
    
    mesh.add(wireframe);
    scene.add(mesh);

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Slow rotation
        mesh.rotation.y = elapsedTime * 0.2;
        mesh.rotation.x = elapsedTime * 0.1;

        // Floating motion
        mesh.position.y = Math.sin(elapsedTime) * 0.2;

        // Mouse interaction (subtle tilting)
        const targetRotationX = mouseY * 0.2;
        const targetRotationY = mouseX * 0.2;
        
        mesh.rotation.x += 0.05 * (targetRotationX - mesh.rotation.x);
        mesh.rotation.y += 0.05 * (targetRotationY - mesh.rotation.y);

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
