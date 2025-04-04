// Particles that follow cursor
document.addEventListener('DOMContentLoaded', function() {
    // Configuration settings
    const CONFIG = {
        particleCount: 15,        // Number of particles
        particleLifespan: 800,    // Milliseconds particles live for
        particleSize: {           // Size range of particles
            min: 3,
            max: 8
        },
        particleColors: [         // Possible particle colors
            'rgba(0, 208, 255, 0.7)',     // Cyan
            'rgba(154, 236, 255, 0.7)',   // Light blue
            'rgba(79, 209, 197, 0.7)',    // Teal
            'rgba(57, 157, 233, 0.7)',    // Blue
            'rgba(184, 238, 255, 0.7)'    // Very light blue
        ],
        particleSpeed: {          // Speed multiplier
            min: 0.6,
            max: 1.2
        },
        particleSpread: 100,      // How far particles spread
        fadeRate: 0.97,           // How quickly particles fade (per frame)
        shrinkRate: 0.97,         // How quickly particles shrink (per frame)
        spawnDelay: 50,           // Milliseconds between particles
        mouseTrail: true,         // Whether particles follow a trail
        trailDelay: 4             // Frames between adding to mouse trail
    };
    
    // Variables
    let mouseX = 0;
    let mouseY = 0;
    let lastSpawnTime = 0;
    let particles = [];
    let mouseTrail = [];
    let frameCount = 0;
    let container = null;
    
    // Create container for particles
    function createParticleContainer() {
        container = document.createElement('div');
        container.className = 'particle-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;
        document.body.appendChild(container);
    }
    
    // Create a new particle
    function createParticle() {
        // Don't spawn too quickly
        const now = Date.now();
        if (now - lastSpawnTime < CONFIG.spawnDelay) return;
        lastSpawnTime = now;
        
        // Choose a position based on mouse trail
        let posX, posY;
        
        if (CONFIG.mouseTrail && mouseTrail.length > 0) {
            // Get random position from mouse trail
            const trailPoint = mouseTrail[Math.floor(Math.random() * mouseTrail.length)];
            posX = trailPoint.x;
            posY = trailPoint.y;
        } else {
            // Use current mouse position
            posX = mouseX;
            posY = mouseY;
        }
        
        // Create the particle element
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        
        // Randomize particle properties
        const size = CONFIG.particleSize.min + Math.random() * (CONFIG.particleSize.max - CONFIG.particleSize.min);
        const color = CONFIG.particleColors[Math.floor(Math.random() * CONFIG.particleColors.length)];
        const speed = CONFIG.particleSpeed.min + Math.random() * (CONFIG.particleSpeed.max - CONFIG.particleSpeed.min);
        const angle = Math.random() * Math.PI * 2; // Random direction
        
        // Calculate velocity based on angle and speed
        const vx = Math.cos(angle) * speed * (Math.random() * CONFIG.particleSpread);
        const vy = Math.sin(angle) * speed * (Math.random() * CONFIG.particleSpread);
        
        // Set styles
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border-radius: 50%;
            opacity: 1;
            left: ${posX}px;
            top: ${posY}px;
            box-shadow: 0 0 ${size * 2}px ${color.replace(')', ', 0.5)')};
        `;
        
        // Add to container
        container.appendChild(particle);
        
        // Store particle data
        particles.push({
            element: particle,
            x: posX,
            y: posY,
            vx: vx,
            vy: vy,
            size: size,
            originalSize: size,
            opacity: 1,
            createdAt: now
        });
    }
    
    // Update all particles
    function updateParticles() {
        const now = Date.now();
        
        // Update and animate each particle
        particles.forEach((particle, index) => {
            // Check if particle has expired
            if (now - particle.createdAt > CONFIG.particleLifespan) {
                // Remove expired particle
                if (particle.element.parentNode) {
                    particle.element.parentNode.removeChild(particle.element);
                }
                particles.splice(index, 1);
                return;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Apply physics (gravity, drag, etc.)
            particle.vy += 0.05; // Slight gravity
            particle.vx *= 0.99; // Air resistance X
            particle.vy *= 0.99; // Air resistance Y
            
            // Fade out
            particle.opacity *= CONFIG.fadeRate;
            
            // Shrink
            particle.size *= CONFIG.shrinkRate;
            
            // Update element
            particle.element.style.transform = `translate(${particle.x - particle.originalSize/2}px, ${particle.y - particle.originalSize/2}px)`;
            particle.element.style.opacity = particle.opacity;
            particle.element.style.width = `${particle.size}px`;
            particle.element.style.height = `${particle.size}px`;
        });
        
        // Update mouse trail
        if (CONFIG.mouseTrail) {
            frameCount++;
            if (frameCount % CONFIG.trailDelay === 0) {
                // Add current mouse position to trail
                mouseTrail.push({ x: mouseX, y: mouseY });
                
                // Limit trail length
                if (mouseTrail.length > 10) {
                    mouseTrail.shift();
                }
            }
        }
        
        // Create new particle if we haven't reached the limit
        if (particles.length < CONFIG.particleCount) {
            createParticle();
        }
        
        // Continue animation
        requestAnimationFrame(updateParticles);
    }
    
    // Track mouse position
    function trackMouse(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    
    // Initialize
    function init() {
        createParticleContainer();
        document.addEventListener('mousemove', trackMouse);
        updateParticles();
    }
    
    // Start the system
    init();
});
