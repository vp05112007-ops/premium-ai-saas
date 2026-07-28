/**
 * ==========================================================================
 * Chat JS
 * ==========================================================================
 * Handles chat interactivity and the 3D AI Orb representation.
 */

document.addEventListener('DOMContentLoaded', () => {
    initChatOrb();
    initChatInterface();
});

function initChatOrb() {
    const container = document.getElementById('chat-orb');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x5B5CEB,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        wireframe: true
    });

    const orb = new THREE.Mesh(geometry, material);
    scene.add(orb);

    const light = new THREE.PointLight(0x8B5CF6, 2, 10);
    light.position.set(2, 2, 2);
    scene.add(light);

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        
        orb.rotation.y = t * 0.5;
        orb.rotation.x = t * 0.3;
        
        // Slight pulsing
        const scale = 1 + Math.sin(t * 3) * 0.05;
        orb.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    }
    animate();
}

function initChatInterface() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const history = document.getElementById('chatHistory');

    if (!input || !sendBtn || !history) return;

    function addMessage(text, isUser = true) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${isUser ? 'user' : 'ai'}`;
        
        const avatar = document.createElement('div');
        avatar.className = `chat-avatar ${isUser ? 'avatar-user' : 'avatar-ai'}`;
        avatar.innerHTML = isUser ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>` : 'AI';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubble);
        
        // GSAP animate in
        msgDiv.style.opacity = '0';
        msgDiv.style.transform = 'translateY(20px)';
        
        history.appendChild(msgDiv);
        history.scrollTop = history.scrollHeight;

        gsap.to(msgDiv, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out"
        });
    }

    function handleSend() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, true);
        input.value = '';

        // Mock AI response
        setTimeout(() => {
            addMessage("I'm an AI assistant in your new premium workspace. This is a frontend demonstration, but you can hook me up to any LLM backend API (like OpenAI or Anthropic).", false);
        }, 1000);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
}
