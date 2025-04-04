// Terminal Animation Script
document.addEventListener('DOMContentLoaded', function() {
    const terminalOutput = document.getElementById('terminal-output');
    const codeLines = [
        "#!/usr/bin/env python3",
        "import os",
        "import sys",
        "import time",
        "import logging",
        "import json",
        "import threading",
        "import asyncio",
        "import random",
        "from datetime import datetime, timedelta",
        "from flask import Flask, render_template, request, jsonify",
        "from flask_sqlalchemy import SQLAlchemy",
        "",
        "# Configure logging",
        "logging.basicConfig(",
        "    level=logging.DEBUG,",
        "    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',",
        "    datefmt='%Y-%m-%d %H:%M:%S'",
        ")",
        "logger = logging.getLogger(__name__)",
        "",
        "# Initialize Flask application",
        "app = Flask(__name__)",
        "app.secret_key = os.environ.get('SESSION_SECRET', 'dev_key')",
        "",
        "# Database configuration",
        "DB_CONFIG = {",
        "    'host': os.environ.get('DB_HOST', 'localhost'),",
        "    'port': int(os.environ.get('DB_PORT', 5432)),",
        "    'database': os.environ.get('DB_NAME', 'spacedb'),",
        "    'user': os.environ.get('DB_USER', 'admin'),",
        "    'password': os.environ.get('DB_PASSWORD', 'password')",
        "}",
        "",
        "# Database URI configuration",
        "app.config['SQLALCHEMY_DATABASE_URI'] = f\"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}\"",
        "app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False",
        "db = SQLAlchemy(app)",
        "",
        "# System Status Values",
        "system_start_time = datetime.now()",
        "system_status = {",
        "    'status': 'initializing',",
        "    'components': {",
        "        'web_server': 'starting',",
        "        'database': 'connecting',",
        "        'cache': 'offline',",
        "        'api_gateway': 'offline'",
        "    },",
        "    'metrics': {",
        "        'cpu_usage': 0.0,",
        "        'memory_usage': {",
        "            'total': 16384,  # MB",
        "            'used': 0,       # MB",
        "            'free': 16384    # MB",
        "        },",
        "        'network': {",
        "            'in_rate': 0.0,  # Mbps",
        "            'out_rate': 0.0,  # Mbps",
        "            'connections': 0",
        "        },",
        "        'security': {",
        "            'threat_level': 'low',",
        "            'last_scan': None",
        "        }",
        "    }",
        "}",
        "",
        "# Database Models",
        "class User(db.Model):",
        "    __tablename__ = 'users'",
        "    id = db.Column(db.Integer, primary_key=True)",
        "    username = db.Column(db.String(80), unique=True, nullable=False)",
        "    email = db.Column(db.String(120), unique=True, nullable=False)",
        "    password_hash = db.Column(db.String(256), nullable=False)",
        "    created_at = db.Column(db.DateTime, default=datetime.utcnow)",
        "    last_login = db.Column(db.DateTime, nullable=True)",
        "    is_active = db.Column(db.Boolean, default=True)",
        "",
        "    def __repr__(self):",
        "        return f'<User {self.username}>'",
        "",
        "class SystemLog(db.Model):",
        "    __tablename__ = 'system_logs'",
        "    id = db.Column(db.Integer, primary_key=True)",
        "    timestamp = db.Column(db.DateTime, default=datetime.utcnow)",
        "    level = db.Column(db.String(20), nullable=False)",
        "    component = db.Column(db.String(50), nullable=False)",
        "    message = db.Column(db.Text, nullable=False)",
        "",
        "    def __repr__(self):",
        "        return f'<Log {self.timestamp} {self.level}: {self.message[:30]}...>'",
        "",
        "# Initialize system components",
        "def initialize_system():",
        "    logger.info('Initializing system components...')",
        "    try:",
        "        # Update status",
        "        system_status['status'] = 'starting'",
        "        log_system_event('SYSTEM', 'INFO', 'System initialization started')",
        "        ",
        "        # Setup database connection",
        "        setup_database()",
        "        ",
        "        # Initialize cache",
        "        init_cache()",
        "        ",
        "        # Setup API endpoints",
        "        register_api_endpoints()",
        "        ",
        "        # Start monitoring service",
        "        start_monitoring()",
        "        ",
        "        # Update status",
        "        system_status['status'] = 'online'",
        "        log_system_event('SYSTEM', 'INFO', 'System initialization complete')",
        "        logger.info('System initialization complete')",
        "        return True",
        "    except Exception as e:",
        "        system_status['status'] = 'error'",
        "        log_system_event('SYSTEM', 'ERROR', f'System initialization failed: {str(e)}')",
        "        logger.error(f'System initialization failed: {str(e)}')",
        "        return False",
        "",
        "def setup_database():",
        "    logger.info('Setting up database connection...')",
        "    system_status['components']['database'] = 'connecting'",
        "    log_system_event('DATABASE', 'INFO', 'Connecting to database')",
        "    ",
        "    try:",
        "        # Create tables if they don't exist",
        "        db.create_all()",
        "        ",
        "        # Check connection with a simple query",
        "        db.session.execute('SELECT 1')",
        "        db.session.commit()",
        "        ",
        "        system_status['components']['database'] = 'online'",
        "        log_system_event('DATABASE', 'INFO', 'Database connection established successfully')",
        "        logger.info('Database connection established successfully')",
        "    except Exception as e:",
        "        system_status['components']['database'] = 'error'",
        "        log_system_event('DATABASE', 'ERROR', f'Database connection failed: {str(e)}')",
        "        logger.error(f'Database connection failed: {str(e)}')",
        "        raise",
        "",
        "def init_cache():",
        "    logger.info('Initializing cache...')",
        "    system_status['components']['cache'] = 'starting'",
        "    log_system_event('CACHE', 'INFO', 'Initializing cache service')",
        "    ",
        "    try:",
        "        # Simulate cache initialization",
        "        time.sleep(0.5)  # Simulating initialization time",
        "        ",
        "        system_status['components']['cache'] = 'online'",
        "        log_system_event('CACHE', 'INFO', 'Cache service initialized successfully')",
        "        logger.info('Cache initialized successfully')",
        "    except Exception as e:",
        "        system_status['components']['cache'] = 'error'",
        "        log_system_event('CACHE', 'ERROR', f'Cache initialization failed: {str(e)}')",
        "        logger.error(f'Cache initialization failed: {str(e)}')",
        "        raise",
        "",
        "def register_api_endpoints():",
        "    logger.info('Registering API endpoints...')",
        "    system_status['components']['api_gateway'] = 'starting'",
        "    log_system_event('API', 'INFO', 'Registering API endpoints')",
        "    ",
        "    try:",
        "        # Simulate API endpoint registration",
        "        time.sleep(0.3)  # Simulating registration time",
        "        ",
        "        system_status['components']['api_gateway'] = 'online'",
        "        log_system_event('API', 'INFO', 'API endpoints registered successfully')",
        "        logger.info('API endpoints registered successfully')",
        "    except Exception as e:",
        "        system_status['components']['api_gateway'] = 'error'",
        "        log_system_event('API', 'ERROR', f'API endpoint registration failed: {str(e)}')",
        "        logger.error(f'API endpoint registration failed: {str(e)}')",
        "        raise",
        "",
        "def start_monitoring():",
        "    logger.info('Starting system monitoring...')",
        "    log_system_event('MONITORING', 'INFO', 'Starting system monitoring service')",
        "    ",
        "    # Start monitoring in a background thread",
        "    monitor_thread = threading.Thread(target=system_monitor_loop)",
        "    monitor_thread.daemon = True  # Thread will exit when main thread exits",
        "    monitor_thread.start()",
        "    ",
        "    logger.info('System monitoring started successfully')",
        "    log_system_event('MONITORING', 'INFO', 'System monitoring service started successfully')",
        "",
        "def system_monitor_loop():",
        "    \"\"\"Background task to continuously monitor system metrics\"\"\"",
        "    while True:",
        "        try:",
        "            # Update CPU metrics",
        "            update_cpu_metrics()",
        "            ",
        "            # Update memory metrics",
        "            update_memory_metrics()",
        "            ",
        "            # Update network metrics",
        "            update_network_metrics()",
        "            ",
        "            # Update security metrics",
        "            update_security_metrics()",
        "            ",
        "            # Sleep between updates",
        "            time.sleep(10)  # Update metrics every 10 seconds",
        "        except Exception as e:",
        "            logger.error(f'Error in monitoring loop: {str(e)}')",
        "            log_system_event('MONITORING', 'ERROR', f'Monitoring error: {str(e)}')",
        "            time.sleep(30)  # Longer delay if there was an error",
        "",
        "def update_cpu_metrics():",
        "    # In a real system, this would get actual CPU metrics",
        "    # Here we simulate CPU usage patterns",
        "    current = system_status['metrics']['cpu_usage']",
        "    trend = random.uniform(-5, 5)  # General direction",
        "    noise = random.uniform(-2, 2)  # Small random variations",
        "    ",
        "    # Add some randomness but maintain a realistic pattern",
        "    new_value = current + trend + noise",
        "    ",
        "    # Ensure values stay within realistic bounds",
        "    new_value = max(5, min(new_value, 95))",
        "    ",
        "    system_status['metrics']['cpu_usage'] = new_value",
        "",
        "def update_memory_metrics():",
        "    # Simulate memory usage patterns",
        "    total = system_status['metrics']['memory_usage']['total']",
        "    current = system_status['metrics']['memory_usage']['used']",
        "    ",
        "    # Calculate a new value with some variability",
        "    change = random.uniform(-256, 512)  # Memory can free up or be allocated",
        "    new_value = current + change",
        "    ",
        "    # Ensure values stay within realistic bounds",
        "    new_value = max(1024, min(new_value, total - 1024))  # At least 1GB free",
        "    ",
        "    system_status['metrics']['memory_usage']['used'] = new_value",
        "    system_status['metrics']['memory_usage']['free'] = total - new_value",
        "",
        "def update_network_metrics():",
        "    # Simulate network traffic patterns",
        "    current_in = system_status['metrics']['network']['in_rate']",
        "    current_out = system_status['metrics']['network']['out_rate']",
        "    current_conn = system_status['metrics']['network']['connections']",
        "    ",
        "    # Calculate new values with realistic patterns",
        "    in_change = random.uniform(-5, 8)  # Incoming traffic changes",
        "    out_change = random.uniform(-3, 5)  # Outgoing traffic changes",
        "    conn_change = random.randint(-2, 3)  # Connection count changes",
        "    ",
        "    # Apply changes with bounds",
        "    new_in = max(0.1, min(current_in + in_change, 100))  # Max 100 Mbps",
        "    new_out = max(0.1, min(current_out + out_change, 80))  # Max 80 Mbps",
        "    new_conn = max(1, min(current_conn + conn_change, 500))  # Max 500 connections",
        "    ",
        "    # Update status",
        "    system_status['metrics']['network']['in_rate'] = new_in",
        "    system_status['metrics']['network']['out_rate'] = new_out",
        "    system_status['metrics']['network']['connections'] = new_conn",
        "",
        "def update_security_metrics():",
        "    # Periodically run a security scan",
        "    last_scan = system_status['metrics']['security']['last_scan']",
        "    now = datetime.now()",
        "    ",
        "    # Run scan every 10 minutes",
        "    if last_scan is None or (now - last_scan) > timedelta(minutes=10):",
        "        # Simulate security scan",
        "        log_system_event('SECURITY', 'INFO', 'Running security scan')",
        "        ",
        "        # Randomize threat level occasionally",
        "        if random.random() < 0.05:  # 5% chance to change threat level",
        "            threats = ['low', 'medium', 'high']",
        "            weights = [0.7, 0.25, 0.05]  # Weighted toward 'low'",
        "            new_threat = random.choices(threats, weights=weights)[0]",
        "            ",
        "            # If threat level increased, log a warning",
        "            if threats.index(new_threat) > threats.index(system_status['metrics']['security']['threat_level']):",
        "                log_system_event('SECURITY', 'WARNING', f'Threat level increased to {new_threat}')",
        "            ",
        "            system_status['metrics']['security']['threat_level'] = new_threat",
        "        ",
        "        # Update last scan time",
        "        system_status['metrics']['security']['last_scan'] = now",
        "        log_system_event('SECURITY', 'INFO', 'Security scan completed')",
        "",
        "def log_system_event(component, level, message):",
        "    \"\"\"Log an event to the system log table\"\"\"",
        "    try:",
        "        log_entry = SystemLog(",
        "            timestamp=datetime.utcnow(),",
        "            level=level,",
        "            component=component,",
        "            message=message",
        "        )",
        "        db.session.add(log_entry)",
        "        db.session.commit()",
        "    except Exception as e:",
        "        logger.error(f'Failed to log system event: {str(e)}')",
        "        # Don't raise the exception to avoid disrupting the main flow",
        "",
        "def get_system_uptime():",
        "    \"\"\"Calculate system uptime\"\"\"",
        "    uptime = datetime.now() - system_start_time",
        "    days = uptime.days",
        "    hours, remainder = divmod(uptime.seconds, 3600)",
        "    minutes, seconds = divmod(remainder, 60)",
        "    return f'{days}d {hours}h {minutes}m {seconds}s'",
        "",
        "def get_memory_usage():",
        "    \"\"\"Get current memory usage metrics\"\"\"",
        "    return system_status['metrics']['memory_usage']",
        "",
        "def get_cpu_usage():",
        "    \"\"\"Get current CPU usage metrics\"\"\"",
        "    return {",
        "        'usage': system_status['metrics']['cpu_usage'],",
        "        'processes': random.randint(100, 150),",
        "        'temperature': round(40 + random.uniform(0, 15), 1) # Between 40-55°C",
        "    }",
        "",
        "def get_network_metrics():",
        "    \"\"\"Get current network metrics\"\"\"",
        "    return system_status['metrics']['network']",
        "",
        "# API Routes",
        "@app.route('/')",
        "def index():",
        "    return render_template('index.html')",
        "",
        "@app.route('/api/status')",
        "def system_status_api():",
        "    \"\"\"API endpoint for system status\"\"\"",
        "    status_data = {",
        "        'status': system_status['status'],",
        "        'uptime': get_system_uptime(),",
        "        'memory': get_memory_usage(),",
        "        'cpu': get_cpu_usage(),",
        "        'network': get_network_metrics(),",
        "        'components': system_status['components'],",
        "        'security': system_status['metrics']['security'],",
        "        'timestamp': datetime.now().isoformat()",
        "    }",
        "    return jsonify(status_data)",
        "",
        "@app.route('/api/logs')",
        "def system_logs_api():",
        "    \"\"\"API endpoint for system logs\"\"\"",
        "    # Get recent logs from database",
        "    logs = SystemLog.query.order_by(SystemLog.timestamp.desc()).limit(100).all()",
        "    log_data = [{",
        "        'id': log.id,",
        "        'timestamp': log.timestamp.isoformat(),",
        "        'level': log.level,",
        "        'component': log.component,",
        "        'message': log.message",
        "    } for log in logs]",
        "    ",
        "    return jsonify(log_data)",
        "",
        "if __name__ == '__main__':",
        "    if initialize_system():",
        "        app.run(host='0.0.0.0', port=5000, debug=True)",
        "    else:",
        "        sys.exit(1)"
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let currentText = '';
    let typingSpeed = 50; // Base typing speed
    let pauseBeforeRestart = 5000; // Pause before restarting the animation (ms)
    
    // Function to add a "thinking" effect where typing pauses
    function addThinkingEffect() {
        // Randomly decide if thinking should occur
        if (Math.random() > 0.85) {
            return Math.random() * 800 + 200; // Pause 200-1000ms
        }
        return 0;
    }
    
    // Function to simulate varied typing speeds based on content
    function getTypingSpeed(char, nextChar) {
        // Type punctuation slower
        if ('.,:;?!'.includes(char)) {
            return typingSpeed * 3; // Slower for punctuation
        }
        
        // Type faster for repeated similar characters
        if (char === nextChar) {
            return typingSpeed * 0.5; // Faster for repeated chars
        }
        
        // Type spaces at medium speed
        if (char === ' ') {
            return typingSpeed * 1.5;
        }
        
        // Vary speed randomly for natural effect
        return typingSpeed * (0.7 + Math.random() * 0.6);
    }
    
    // Create a more natural pause at the end of lines
    function getLinePauseTime(line) {
        if (line.trim() === '') {
            return 700; // Longer pause for empty lines
        }
        
        if (line.trim().endsWith('{') || line.trim().endsWith(':')) {
            return 500; // Pause before blocks start
        }
        
        if (line.trim().endsWith(',')) {
            return 300; // Short pause for line continuations
        }
        
        return 400 + Math.random() * 300; // Random pause between 400-700ms
    }
    
    function typeEffect() {
        if (lineIndex >= codeLines.length) {
            // When done with all lines, pause then restart
            setTimeout(() => {
                lineIndex = 0;
                charIndex = 0;
                currentText = '';
                terminalOutput.innerHTML = '';
                typeEffect();
            }, pauseBeforeRestart);
            return;
        }
        
        // Get current line
        const currentLine = codeLines[lineIndex];
        
        if (charIndex < currentLine.length) {
            // Add next character
            const currentChar = currentLine.charAt(charIndex);
            const nextChar = currentLine.charAt(charIndex + 1) || '';
            currentText += currentChar;
            charIndex++;
            
            // Update the terminal text
            terminalOutput.innerHTML = currentText;
            
            // Calculate delay for next character
            const thinkingTime = addThinkingEffect();
            const typingTime = getTypingSpeed(currentChar, nextChar);
            
            // Schedule next character
            setTimeout(typeEffect, typingTime + thinkingTime);
        } else {
            // Finished typing current line
            currentText += '<br>';
            lineIndex++;
            charIndex = 0;
            
            // Update display
            terminalOutput.innerHTML = currentText;
            
            // Add a natural pause at the end of lines
            const pauseTime = getLinePauseTime(currentLine);
            setTimeout(typeEffect, pauseTime);
        }
    }
    
    // Start the typing effect after a short delay
    setTimeout(typeEffect, 500);
});

// Add smooth scrolling to follow the typing
setInterval(() => {
    const terminalContent = document.querySelector('.terminal-content');
    if (terminalContent) {
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }
}, 1000);
