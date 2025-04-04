// Data Processing Simulation
document.addEventListener('DOMContentLoaded', function() {
    initDataProcessing();
});

// Initialize data processing simulation
function initDataProcessing() {
    // Elements
    const dataProcessingLog = document.querySelector('.data-processing-log');
    const dataProcessingStatus = document.querySelector('.data-processing-status');
    const queueLength = document.getElementById('queue-length');
    const queueBar = document.getElementById('queue-bar');
    const dataThroughput = document.getElementById('data-throughput');
    const throughputBar = document.getElementById('throughput-bar');
    const jobStatus = document.getElementById('job-status');
    
    // Skip if elements don't exist
    if (!dataProcessingLog || !queueLength) return;
    
    // Start simulation after delay
    setTimeout(() => {
        simulateDataProcessing();
    }, 1500);
    
    // Simulate data processing activities
    function simulateDataProcessing() {
        const logMessages = [
            "Initializing processing worker threads...",
            "Connecting to data sources...",
            "Loading processing modules...",
            "Setting up pipeline stages...",
            "Establishing queue manager...",
            "Configuring memory buffers...",
            "Starting data ingestion..."
        ];
        
        let messageIndex = 0;
        
        // Simulate log messages
        const logInterval = setInterval(() => {
            if (messageIndex < logMessages.length) {
                dataProcessingLog.textContent = logMessages[messageIndex];
                messageIndex++;
            } else {
                clearInterval(logInterval);
                dataProcessingStatus.textContent = "Processing streams active";
                dataProcessingStatus.style.animation = "none";
                
                // Start metrics simulation
                simulateProcessingMetrics();
            }
        }, 500);
    }
    
    // Simulate processing metrics changes
    function simulateProcessingMetrics() {
        // Initial values
        let queue = 0;
        let throughput = 0;
        let currentJobStatus = "Initializing";
        
        // Job statuses
        const jobStatuses = ["Initializing", "Waiting for data", "Running", "Processing batch", "Idle"];
        const jobStatusClasses = {
            "Initializing": "",
            "Waiting for data": "waiting",
            "Running": "running", 
            "Processing batch": "running",
            "Idle": ""
        };
        
        // Update metrics periodically
        const metricsInterval = setInterval(() => {
            // Queue simulation - follows a pattern of growing and shrinking
            // to simulate batches of work being processed
            if (Math.random() > 0.7) {
                // Occasionally get a big batch of data
                queue += Math.floor(Math.random() * 50) + 10;
            } else {
                // Process some items
                queue = Math.max(0, queue - Math.floor(Math.random() * 20));
            }
            
            // Cap queue at reasonable values for display
            queue = Math.min(queue, 200);
            
            // Throughput simulation - correlates somewhat with queue size
            // but has its own variation to appear realistic
            if (queue > 50) {
                // Higher throughput when queue is large
                throughput = 25 + Math.random() * 15;
            } else if (queue > 10) {
                // Moderate throughput with moderate queue
                throughput = 5 + Math.random() * 20;
            } else {
                // Low throughput with small queue
                throughput = Math.random() * 8;
            }
            
            // Update job status occasionally
            if (Math.random() > 0.8) {
                // Choose appropriate job status based on queue size
                if (queue > 100) {
                    currentJobStatus = "Processing batch";
                } else if (queue > 20) {
                    currentJobStatus = "Running";
                } else if (queue > 0) {
                    currentJobStatus = Math.random() > 0.5 ? "Running" : "Processing batch";
                } else {
                    currentJobStatus = Math.random() > 0.7 ? "Idle" : "Waiting for data";
                }
                
                // Update job status display
                jobStatus.textContent = currentJobStatus;
                
                // Update job status class
                jobStatus.className = "metric-value";
                if (jobStatusClasses[currentJobStatus]) {
                    jobStatus.classList.add(jobStatusClasses[currentJobStatus]);
                }
            }
            
            // Update UI
            queueLength.textContent = queue;
            queueBar.style.width = `${Math.min((queue / 200) * 100, 100)}%`;
            
            dataThroughput.textContent = throughput.toFixed(1);
            throughputBar.style.width = `${(throughput / 40) * 100}%`;
            
        }, 1200);
    }
}
