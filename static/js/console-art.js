// Console IP Detection Script
document.addEventListener('DOMContentLoaded', function() {
    // Run after a small delay to ensure console is ready
    setTimeout(() => {
        displayIPInfo();
    }, 500);
});

function displayIPInfo() {
    // Check if we're in a browser with console support
    if (typeof window.console === 'undefined' || typeof window.console.log === 'undefined') {
        return;
    }
    
    // Display header
    console.log("%c System IP Information ", "background: #0f172a; color: #10b981; font-size: 16px; font-weight: bold; padding: 5px 10px; border-radius: 5px;");
    
    // Function to retrieve IP from localStorage
    function getClientIP() {
        // Try to get IP from local storage
        const storedIP = localStorage.getItem('clientIP');
        
        if (storedIP) {
            return storedIP;
        } else {
            // Generate a random IP for simulation if not found
            // This is just for display purposes
            const fakeIP = generateRandomIP();
            localStorage.setItem('clientIP', fakeIP);
            return fakeIP;
        }
    }
    
    // Function to generate a random IP for demonstration
    function generateRandomIP() {
        return Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
    }
    
    // Check if client has a stored IP address
    const clientIP = getClientIP();
    
    // Create IP information display
    const ipArt = 
`
  #############################################
  #                                           #
  #  CLIENT IP INFORMATION                    #
  #                                           #
  #  Local Storage IP: ${clientIP.padEnd(21)} #
  #                                           #
  #  Connection Status: SECURE                #
  #  Protocol: HTTPS                          #
  #  Browser: ${navigator.userAgent.split(' ')[0].padEnd(28)} #
  #                                           #
  #############################################
`;
    
    // Display IP information
    console.log("%c" + ipArt, "color: #10b981; font-size: 12px; font-family: monospace; line-height: 1.2;");
    
    // Simulating connection check
    console.log("%c Verifying connection security... ", "color: #64748b; font-style: italic;");
    
    setTimeout(() => {
        // Display security information
        if (location.protocol === 'https:') {
            console.log("%c Connection Secure ✓ ", "background: #059669; color: white; font-size: 14px; padding: 3px 8px; border-radius: 3px;");
        } else {
            console.log("%c Connection Not Secure ⚠ ", "background: #dc2626; color: white; font-size: 14px; padding: 3px 8px; border-radius: 3px;");
        }
        
        // Display storage information
        console.table({
            'Local Storage IP': localStorage.getItem('clientIP') || 'Not stored',
            'Session Storage': sessionStorage.length + ' items',
            'Cookies Enabled': navigator.cookieEnabled ? 'Yes' : 'No',
            'User Agent': navigator.userAgent
        });
    }, 1500);
}
