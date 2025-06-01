// frontend/scripts/setup-env.js
const fs = require('fs');
const os = require('os');
const path = require('path');

function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

function createEnvFile() {
    const localIP = getLocalIPAddress();
    const envPath = path.join(__dirname, '..', '.env');
    
    const envContent = `# Auto-generated .env file
# Generated on: ${new Date().toISOString()}
# Detected IP: ${localIP}

# Backend API URL
REACT_APP_BACKEND_API_URL=http://${localIP}:3001

# Development settings
GENERATE_SOURCEMAP=false
HOST=0.0.0.0

# Browser settings
BROWSER=none
`;

    fs.writeFileSync(envPath, envContent);
    
    console.log('🎯 .env file created successfully!');
    console.log(`📍 Detected IP: ${localIP}`);
    console.log(`🔗 Backend URL: http://${localIP}:3001`);
    console.log(`📱 Mobile access: http://${localIP}:3000`);
    console.log('');
    console.log('✅ You can now run: npm start');
}

// Run the script
createEnvFile();