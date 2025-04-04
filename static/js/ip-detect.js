// IP Detection Service
document.addEventListener('DOMContentLoaded', function() {
    // Initialize IP detection
    initIPDetection();
});

function initIPDetection() {
    // Check if we already have an IP in localStorage
    let storedIP = localStorage.getItem('clientIP');
    
    // If there's no stored IP, attempt to get it from a public API
    if (!storedIP) {
        fetchIPAddress();
    }
}

// Function to fetch IP address from a public API
function fetchIPAddress() {
    // Using ipify API (free and no API key needed)
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            // Store the IP in localStorage
            if (data && data.ip) {
                localStorage.setItem('clientIP', data.ip);
                console.log("%c IP Address detected and stored: " + data.ip, "color: #059669;");
            }
        })
        .catch(error => {
            console.error('Error fetching IP:', error);
            // Use a fallback method if fetch fails
            fallbackIPDetection();
        });
}

// Fallback method using a different service
function fallbackIPDetection() {
    // Create a script element to fetch IP (JSONP approach)
    const script = document.createElement('script');
    
    // Define callback function
    window.getIP = function(json) {
        if (json && json.ip) {
            localStorage.setItem('clientIP', json.ip);
            console.log("%c IP Address detected and stored (fallback): " + json.ip, "color: #059669;");
        }
    };
    
    // Set script source
    script.src = 'https://api.ipify.org?format=jsonp&callback=getIP';
    
    // Add error handling
    script.onerror = function() {
        console.warn('Could not detect IP address using public APIs');
        // Set a placeholder
        localStorage.setItem('clientIP', '127.0.0.1');
    };
    
    // Add script to document
    document.body.appendChild(script);
}
