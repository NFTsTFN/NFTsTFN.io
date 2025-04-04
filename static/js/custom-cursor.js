// Custom cursor that works with particle effects
document.addEventListener('DOMContentLoaded', function() {
    // Create custom cursor element
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    // Variables for cursor position and animation
    let cursorX = -100;
    let cursorY = -100;
    let targetX = -100;
    let targetY = -100;
    
    // Update cursor position
    function updateCursor() {
        // Smooth cursor movement with lerp (linear interpolation)
        cursorX += (targetX - cursorX) * 0.2;
        cursorY += (targetY - cursorY) * 0.2;
        
        // Update cursor position
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        // Continue animation
        requestAnimationFrame(updateCursor);
    }
    
    // Track mouse movement
    function trackMouse(e) {
        targetX = e.clientX;
        targetY = e.clientY;
    }
    
    // Activate cursor on interactive elements
    function activateCursor() {
        cursor.classList.add('active');
    }
    
    // Deactivate cursor
    function deactivateCursor() {
        cursor.classList.remove('active');
    }
    
    // Add event listeners
    document.addEventListener('mousemove', trackMouse);
    
    // Find all interactive elements and add hover effects
    const interactiveElements = document.querySelectorAll('a, button, .terminal-button, .visualization-block');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', activateCursor);
        element.addEventListener('mouseleave', deactivateCursor);
    });
    
    // Hide cursor when mouse leaves window
    document.addEventListener('mouseout', function(e) {
        if (e.relatedTarget == null || e.relatedTarget.nodeName === 'HTML') {
            cursor.style.opacity = '0';
        }
    });
    
    // Show cursor when mouse enters window
    document.addEventListener('mouseover', function() {
        cursor.style.opacity = '1';
    });
    
    // Start animation loop
    updateCursor();
});
