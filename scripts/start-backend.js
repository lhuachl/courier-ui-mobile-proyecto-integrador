/**
 * Backend startup script
 * Automatically starts the Python backend when the mobile app starts
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const PYTHON_BACKEND_PATH = path.join(__dirname, '../../Python');
const PYTHON_MAIN_FILE = path.join(PYTHON_BACKEND_PATH, 'main.py');

console.log('🔍 Checking if Python backend is already running...');

// Function to check if backend is already running
function checkBackendRunning() {
  return new Promise((resolve) => {
    // Try to fetch from the health endpoint
    fetch('http://localhost:8000/health')
      .then(response => {
        if (response.ok) {
          console.log('✅ Python backend is already running!');
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(() => {
        resolve(false);
      });
  });
}

// Function to start the Python backend
function startBackend() {
  console.log('🚀 Starting Python backend...');
  
  // Check if Python main file exists
  if (!fs.existsSync(PYTHON_MAIN_FILE)) {
    console.error('❌ Python main file not found at:', PYTHON_MAIN_FILE);
    return;
  }

  // Check if virtual environment exists
  const venvPath = path.join(PYTHON_BACKEND_PATH, '.venv', 'Scripts', 'python.exe');
  const pythonCmd = fs.existsSync(venvPath) ? venvPath : 'python';

  console.log(`📦 Using Python: ${pythonCmd}`);
  console.log(`📁 Backend directory: ${PYTHON_BACKEND_PATH}`);

  // Start the backend process
  const backendProcess = spawn(pythonCmd, ['main.py'], {
    cwd: PYTHON_BACKEND_PATH,
    stdio: 'pipe',
    shell: true
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`🐍 Backend: ${data.toString().trim()}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`🐍 Backend Error: ${data.toString().trim()}`);
  });

  backendProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Backend process exited with code ${code}`);
    }
  });

  backendProcess.on('error', (error) => {
    console.error('❌ Failed to start backend:', error.message);
  });

  // Give the backend a moment to start
  setTimeout(() => {
    console.log('⏳ Checking if backend started successfully...');
    checkBackendRunning().then((isRunning) => {
      if (isRunning) {
        console.log('✅ Backend started successfully!');
      } else {
        console.log('⚠️  Backend may still be starting up...');
      }
    });
  }, 3000);
}

// Main execution
async function main() {
  try {
    const isRunning = await checkBackendRunning();
    
    if (isRunning) {
      console.log('✅ Backend is already running, proceeding with mobile app startup...');
      process.exit(0);
    }
    
    console.log('🔄 Backend not detected, starting it now...');
    startBackend();
    
    // Wait a bit for the backend to start before proceeding
    setTimeout(() => {
      console.log('✅ Backend startup initiated, proceeding with mobile app startup...');
      process.exit(0);
    }, 5000);
    
  } catch (error) {
    console.error('❌ Error during backend startup:', error.message);
    // Don't exit with error to allow mobile app to start even if backend fails
    console.log('⚠️  Proceeding with mobile app startup despite backend error...');
    process.exit(0);
  }
}

// Run the main function
main();