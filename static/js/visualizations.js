// Visualization Scripts
document.addEventListener('DOMContentLoaded', function() {
    // Set Chart.js global defaults
    Chart.defaults.color = '#a0aec0';
    Chart.defaults.borderColor = 'rgba(80, 170, 255, 0.1)';
    Chart.defaults.font.family = "'Courier New', monospace";
    Chart.defaults.font.size = 11;
    
    // Initialize all charts and visualizations
    initCpuChart();
    initMemoryChart();
    initNetworkChart();
    initSecurityChart();
    updateUptimeCounter();
    randomizeBlockPositions();
});

// Initialize CPU usage chart
function initCpuChart() {
    const ctx = document.getElementById('cpuChart').getContext('2d');
    
    // Generate realistic data for CPU usage with gradual changes
    const dataPoints = 60; // More data points for smoother appearance
    const data = [];
    const labels = [];
    
    // Start with a baseline CPU usage
    let baseValue = Math.floor(Math.random() * 15) + 35; // Base values between 35-50%
    
    for (let i = 0; i < dataPoints; i++) {
        // Create realistic patterns with occasional small spikes
        const trend = Math.sin(i/10) * 8; // Sinusoidal pattern for natural waves
        const noise = (Math.random() * 6) - 3; // Small random variations
        const spike = (Math.random() > 0.95) ? Math.random() * 15 : 0; // Occasional CPU spikes
        
        const value = Math.min(Math.max(baseValue + trend + noise + spike, 5), 98); // Keep within realistic range
        data.push(value);
        labels.push(`${i}`);
    }
    
    const cpuChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'CPU Load (%)',
                data: data,
                borderColor: '#4fd1c5',
                backgroundColor: 'rgba(79, 209, 197, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    display: false
                }
            },
            animation: {
                duration: 800 // Faster animation for smoother updates
            }
        }
    });
    
    // Update the chart with new data more frequently (1200ms) for smoother animation
    setInterval(() => {
        // Shift data and calculate new value based on previous trend for continuity
        data.shift();
        
        const lastValue = data[data.length - 1];
        const trend = (Math.random() * 4) - 2; // Small trend changes
        const spike = (Math.random() > 0.98) ? Math.random() * 15 : 0; // Rarer, more realistic spikes
        
        // New value with constraints to ensure realistic behavior
        // - Can't change too abruptly from previous value
        // - Stays within realistic range
        // - Creates natural patterns over time
        let newValue = Math.min(Math.max(lastValue + trend + spike, 5), 98);
        
        // If usage is high for too long, tend to decrease (systems don't run at high CPU forever)
        if (lastValue > 70 && Math.random() > 0.3) {
            newValue = lastValue - (Math.random() * 4);
        }
        
        data.push(newValue);
        cpuChart.update('none'); // Use 'none' for smoother animation between frames
    }, 1200);
}

// Initialize Memory Allocation chart
function initMemoryChart() {
    const ctx = document.getElementById('memoryChart').getContext('2d');
    
    // Initial realistic memory allocation
    const memoryData = {
        used: 45 + (Math.random() * 10),
        free: 25 + (Math.random() * 10),
        cache: 20 + (Math.random() * 10)
    };
    
    // Normalize to 100%
    const total = memoryData.used + memoryData.free + memoryData.cache;
    memoryData.used = (memoryData.used / total) * 100;
    memoryData.free = (memoryData.free / total) * 100;
    memoryData.cache = (memoryData.cache / total) * 100;
    
    const memoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Used', 'Free', 'Cache'],
            datasets: [{
                data: [memoryData.used, memoryData.free, memoryData.cache],
                backgroundColor: [
                    '#38bdf8',
                    '#4ade80',
                    '#fb7185'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        padding: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const label = context.label || '';
                            return `${label}: ${value.toFixed(1)}%`;
                        }
                    }
                }
            },
            cutout: '70%',
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500 // Slower animation for smoother transitions
            }
        }
    });
    
    // Update memory with small fluctuations to simulate real usage
    // Memory doesn't change as rapidly as CPU, so update less frequently
    setInterval(() => {
        // Get current values
        const currentData = memoryChart.data.datasets[0].data;
        
        // Generate new values with trends
        // Memory changes follow patterns:
        // - Used memory tends to slowly increase over time
        // - Cache fluctuates but with smaller variations
        // - Free memory is what's left (tends to decrease)
        
        // Small adjustments based on current values (max ±2.5%)
        let usedChange = (Math.random() * 5) - 1.5; // Bias towards increasing
        let cacheChange = (Math.random() * 3) - 1.5;
        
        // Every so often, simulate memory freeing or cache flush
        if (Math.random() > 0.85) {
            if (currentData[0] > 60) { // If used memory is high
                usedChange = -Math.random() * 6; // Free some memory
            }
            if (currentData[2] > 30) { // If cache is high
                cacheChange = -Math.random() * 5; // Flush some cache
            }
        }
        
        // Calculate new values with constraints
        let newUsed = Math.min(Math.max(currentData[0] + usedChange, 25), 75);
        let newCache = Math.min(Math.max(currentData[2] + cacheChange, 10), 40);
        let newFree = 100 - newUsed - newCache; // Free is what's left
        
        // Update chart with new values
        memoryChart.data.datasets[0].data = [newUsed, newFree, newCache];
        memoryChart.update('none'); // Smoother animation
    }, 4500);
}

// Initialize Network Traffic chart
function initNetworkChart() {
    const ctx = document.getElementById('networkChart').getContext('2d');
    
    // Generate initial network traffic data with patterns
    const dataPoints = 60;
    const dataIn = [];
    const dataOut = [];
    const labels = [];
    
    // Create pattern-based initial data
    let baseInValue = Math.floor(Math.random() * 20) + 30; // Base values for incoming
    let baseOutValue = Math.floor(Math.random() * 15) + 15; // Base values for outgoing
    
    for (let i = 0; i < dataPoints; i++) {
        // Create sinusoidal patterns with different frequencies
        const trendIn = Math.sin(i/12) * 15 + Math.sin(i/5) * 5;
        const trendOut = Math.sin(i/10) * 10 + Math.cos(i/7) * 5;
        
        // Add noise and occasional spikes to simulate bursts of traffic
        const noiseIn = (Math.random() * 8) - 4;
        const noiseOut = (Math.random() * 6) - 3;
        const spikeIn = (Math.random() > 0.95) ? Math.random() * 25 : 0;
        const spikeOut = (Math.random() > 0.97) ? Math.random() * 15 : 0;
        
        // Calculate values with constraints
        const inValue = Math.max(Math.min(baseInValue + trendIn + noiseIn + spikeIn, 100), 5);
        const outValue = Math.max(Math.min(baseOutValue + trendOut + noiseOut + spikeOut, 80), 3);
        
        dataIn.push(inValue);
        dataOut.push(outValue);
        labels.push('');
    }
    
    const networkChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'In',
                    data: dataIn,
                    borderColor: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    tension: 0.3,
                    fill: true,
                    pointRadius: 0,
                    borderWidth: 2
                },
                {
                    label: 'Out',
                    data: dataOut,
                    borderColor: '#fb7185',
                    backgroundColor: 'rgba(251, 113, 133, 0.1)',
                    tension: 0.3,
                    fill: true,
                    pointRadius: 0,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        boxWidth: 10,
                        padding: 8
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} Mb/s`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' Mb/s';
                        }
                    }
                },
                x: {
                    display: false
                }
            },
            animation: {
                duration: 1000
            }
        }
    });
    
    // Update network data with realistic patterns
    setInterval(() => {
        // Get the last values
        const lastInValue = dataIn[dataIn.length - 1];
        const lastOutValue = dataOut[dataOut.length - 1];
        
        // Network traffic has following patterns:
        // - Changes more rapidly than memory but less than CPU
        // - In/Out are somewhat correlated (requests in → responses out)
        // - Occasional spikes in both directions
        // - Natural oscillation patterns
        
        // Calculate trends based on wave patterns
        const time = Date.now() / 1000; // Use actual time for realistic continuous waves
        const inTrend = Math.sin(time/10) * 3;
        const outTrend = Math.sin(time/8) * 2;
        
        // Noise and spikes
        const inNoise = (Math.random() * 4) - 2;
        const outNoise = (Math.random() * 3) - 1.5;
        const inSpike = (Math.random() > 0.97) ? Math.random() * 30 : 0;
        const outSpike = (Math.random() > 0.97) ? Math.random() * 20 : 0;
        
        // Previous value based movement (auto-correlation)
        const inChange = (Math.random() * 6) - 3;
        const outChange = (Math.random() * 4) - 2;
        
        // Calculate new values with constraints
        let newInValue = Math.max(Math.min(lastInValue + inChange + inTrend + inNoise + inSpike, 100), 5);
        let newOutValue = Math.max(Math.min(lastOutValue + outChange + outTrend + outNoise + outSpike, 80), 3);
        
        // If there was a spike in input, create a delayed spike in output
        if (inSpike > 10 && Math.random() > 0.4) {
            // Queue an output spike for 1-3 updates later
            setTimeout(() => {
                const responseSpike = inSpike * (0.7 + Math.random() * 0.4); // Response ~70-110% of request
                const lastOutValue = dataOut[dataOut.length - 1];
                const adjustedValue = Math.min(lastOutValue + responseSpike, 80);
                dataOut.pop();
                dataOut.push(adjustedValue);
                networkChart.update('none');
            }, Math.floor(Math.random() * 3 + 1) * 1000);
        }
        
        // Update chart
        dataIn.shift();
        dataOut.shift();
        dataIn.push(newInValue);
        dataOut.push(newOutValue);
        
        networkChart.update('none');
    }, 1000);
}

// Initialize Security Status chart
function initSecurityChart() {
    const ctx = document.getElementById('securityChart').getContext('2d');
    
    // Initial security ratings - more realistic with slight imperfections
    const securityData = [
        Math.random() * 10 + 85, // Firewall (85-95)
        Math.random() * 15 + 80, // Encryption (80-95)
        Math.random() * 8 + 88,  // Authentication (88-96)
        Math.random() * 20 + 75, // Updates (75-95)
        Math.random() * 12 + 84  // Monitoring (84-96)
    ];
    
    const securityChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Firewall', 'Encryption', 'Authentication', 'Updates', 'Monitoring'],
            datasets: [{
                label: 'Current',
                data: securityData,
                backgroundColor: 'rgba(79, 209, 197, 0.2)',
                borderColor: '#4fd1c5',
                borderWidth: 2,
                pointBackgroundColor: '#4fd1c5'
            },
            {
                label: 'Optimal',
                data: [100, 100, 100, 100, 100],
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                borderColor: 'rgba(56, 189, 248, 0.5)',
                borderWidth: 1,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: {
                        display: false
                    },
                    pointLabels: {
                        font: {
                            size: 11 // Smaller font for better fit
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.formattedValue}%`;
                        }
                    }
                }
            }
        }
    });
    
    // Security values change very slowly with occasional vulnerability issues
    // Much longer intervals
    setInterval(() => {
        // Security patterns:
        // - Mostly stable with small fluctuations
        // - Updates fluctuate the most
        // - Every so often, a sudden security issue occurs (rarely and dramatically)
        // - Issues get gradually fixed
        
        // Clone current data
        const currentData = [...securityChart.data.datasets[0].data];
        
        // Generate new security data with realistic changes
        const newData = currentData.map((value, index) => {
            // Different behaviors for different security aspects
            let change;
            let maxChange;
            let vulnerability = false;
            
            // Apply different behavior based on security aspect
            switch(index) {
                case 0: // Firewall
                    maxChange = 1.0;
                    vulnerability = Math.random() > 0.995; // Very rare
                    break;
                case 1: // Encryption
                    maxChange = 0.5; // Very stable
                    vulnerability = Math.random() > 0.997; // Extremely rare
                    break;
                case 2: // Authentication
                    maxChange = 0.7;
                    vulnerability = Math.random() > 0.993; // Very rare
                    break;
                case 3: // Updates
                    maxChange = 2.0; // Most variable
                    vulnerability = Math.random() > 0.99; // Occasional
                    
                    // "Update day" simulation - sudden improvement
                    if (Math.random() > 0.98 && value < 90) {
                        return Math.min(value + Math.random() * 12 + 5, 98);
                    }
                    break;
                case 4: // Monitoring
                    maxChange = 1.2;
                    vulnerability = Math.random() > 0.994;
                    break;
            }
            
            // Calculate change
            change = (Math.random() * maxChange * 2) - maxChange;
            
            // Apply vulnerability if flagged (sudden drop)
            if (vulnerability) {
                const vulnerabilityImpact = Math.random() * 15 + 5; // 5-20% drop
                return Math.max(value - vulnerabilityImpact, 60);
            }
            
            // Gradually improve if below 80%
            if (value < 80 && Math.random() > 0.3) {
                change = Math.random() * 3; // Positive change to recover
            }
            
            // Calculate new value with constraints
            let newValue = Math.min(Math.max(value + change, 60), 98);
            
            return newValue;
        });
        
        // Update chart with new data
        securityChart.data.datasets[0].data = newData;
        securityChart.update('none');
    }, 8000);
}

// Update the uptime counter
function updateUptimeCounter() {
    // Start with a more substantial but still random uptime
    // More realistic to start with some time already accumulated
    let seconds = Math.floor(Math.random() * 60);
    let minutes = Math.floor(Math.random() * 60);
    let hours = Math.floor(Math.random() * 24);
    let days = Math.floor(Math.random() * 30); // More realistic range for days
    
    // Adjust display if days are 0, for more realism
    if (days === 0 && hours < 12) {
        // System likely recently rebooted - start with lower values
        hours = Math.floor(Math.random() * 12);
        minutes = Math.floor(Math.random() * 30);
    }
    
    // Update elements
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('days').textContent = days;
    
    // Update progress bar to match seconds
    const progressPercent = (seconds / 60) * 100;
    document.querySelector('.uptime-progress').style.width = `${progressPercent}%`;
    
    // Update the uptime counter more realistically (exactly 1 second intervals)
    setInterval(() => {
        // Use performance.now() or a more precise method for timing
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
                if (hours >= 24) {
                    hours = 0;
                    days++;
                }
            }
        }
        
        // Update display
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('days').textContent = days;
        
        // More precise progress bar animation tied directly to seconds
        const progressPercent = (seconds / 60) * 100;
        document.querySelector('.uptime-progress').style.width = `${progressPercent}%`;
    }, 1000);
}

// Randomize block positions to avoid overlap
function randomizeBlockPositions() {
    // Only apply this on larger screens
    if (window.innerWidth <= 1200) return;
    
    const container = document.querySelector('.visualization-container');
    const blocks = document.querySelectorAll('.visualization-block');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Define a better spread of positions to minimize overlap
    // This creates a more grid-like arrangement while still appearing random
    const positions = [
        { top: '5%', left: '5%' },            // Top left
        { top: '10%', right: '5%' },          // Top right
        { top: '35%', left: '20%' },          // Mid left
        { top: '25%', right: '25%' },         // Mid right
        { bottom: '15%', left: '8%' },        // Bottom left
        { bottom: '18%', right: '15%' }       // Bottom right
    ];
    
    // Apply specific positions to specific blocks for better visual balance
    document.querySelector('.cpu-block').style.cssText = 'top: 5%; left: 5%; transform: translateZ(0);';
    document.querySelector('.memory-block').style.cssText = 'top: 10%; right: 5%; transform: translateZ(0);';
    document.querySelector('.network-block').style.cssText = 'bottom: 15%; left: 8%; transform: translateZ(0);';
    document.querySelector('.system-block').style.cssText = 'top: 35%; left: 45%; transform: translateZ(0);';
    document.querySelector('.uptime-block').style.cssText = 'top: 28%; right: 15%; transform: translateZ(0);';
    document.querySelector('.security-block').style.cssText = 'bottom: 20%; right: 10%; transform: translateZ(0);';
    
    // Add staggered animations for a more polished appearance
    blocks.forEach((block, index) => {
        block.style.opacity = '0';
        block.style.transform = block.style.transform + ' translateY(20px)';
        
        setTimeout(() => {
            block.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            block.style.opacity = '1';
            block.style.transform = block.style.transform.replace(' translateY(20px)', '');
        }, 100 + (index * 180)); // More staggered timing
    });
    
    // Add subtle continuous animations to certain blocks for "alive" feeling
    setTimeout(() => {
        const cpuBlock = document.querySelector('.cpu-block');
        const memoryBlock = document.querySelector('.memory-block');
        const networkBlock = document.querySelector('.network-block');
        
        // Add a subtle floating animation
        cpuBlock.style.animation = 'float 8s ease-in-out infinite';
        memoryBlock.style.animation = 'float 9s ease-in-out infinite';
        networkBlock.style.animation = 'float 7s ease-in-out infinite 2s';
        
        // Add the keyframes if not already present
        if (!document.getElementById('float-animation')) {
            const style = document.createElement('style');
            style.id = 'float-animation';
            style.textContent = `
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `;
            document.head.appendChild(style);
        }
    }, 2000);
}

// Add responsive behavior to terminal window height
document.addEventListener('DOMContentLoaded', function() {
    const terminalContent = document.querySelector('.terminal-content');
    
    // Adjust terminal height based on window size
    function adjustTerminalHeight() {
        const windowHeight = window.innerHeight;
        // Make terminal larger on bigger screens
        if (windowHeight > 900) {
            terminalContent.style.height = '350px';
        } else if (windowHeight > 700) {
            terminalContent.style.height = '300px';
        } else {
            terminalContent.style.height = '250px';
        }
    }
    
    // Run on load
    adjustTerminalHeight();
    
    // Run on window resize
    window.addEventListener('resize', adjustTerminalHeight);
});
