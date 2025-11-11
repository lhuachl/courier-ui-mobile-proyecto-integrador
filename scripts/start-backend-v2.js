/**
 * Backend startup script - Python version
 * Automatically starts the Python backend when the mobile app starts
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PROJECT_ROOT = path.join(__dirname, '../../');
const PYTHON_BACKEND_PATH = path.join(PROJECT_ROOT, 'Python');
const PYTHON_MAIN_FILE = path.join(PYTHON_BACKEND_PATH, 'main.py');
const PYTHON_VENV_PATH = path.join(PYTHON_BACKEND_PATH, '.venv');

console.log('🔍 Checking Python backend status...');

// Function to check if backend is running
function checkBackendRunning() {
  return new Promise((resolve) => {
    const http = require('http');
    
    const req = http.request({
      hostname: 'localhost',
      port: 8000,
      path: '/health',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Python backend is already running!');
        resolve(true);
      } else {
        resolve(false);
      }
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Function to find Python executable
function findPythonExecutable() {
  // Check for virtual environment first
  const venvPython = path.join(PYTHON_VENV_PATH, 'Scripts', 'python.exe');
  if (fs.existsSync(venvPython)) {
    console.log('📦 Found virtual environment Python:', venvPython);
    return venvPython;
  }

  // Check for Unix-like venv
  const venvPythonUnix = path.join(PYTHON_VENV_PATH, 'bin', 'python');
  if (fs.existsSync(venvPythonUnix)) {
    console.log('📦 Found virtual environment Python (Unix):', venvPythonUnix);
    return venvPythonUnix;
  }

  // Fall back to system Python
  console.log('📦 Using system Python');
  return 'python';
}

// Function to start backend
async function startBackend() {
  try {
    // Check if main.py exists
    if (!fs.existsSync(PYTHON_MAIN_FILE)) {
      console.error('❌ Python main file not found at:', PYTHON_MAIN_FILE);
      return false;
    }

    const pythonCmd = findPythonExecutable();
    console.log('🚀 Starting Python backend...');
    console.log(`📁 Working directory: ${PYTHON_BACKEND_PATH}`);
    console.log(`📝 Main file: ${PYTHON_MAIN_FILE}`);

    // Start the backend with PYTHONPATH set to include src directory
    const backendProcess = spawn(pythonCmd, ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'], {
      cwd: PYTHON_BACKEND_PATH,
      env: {
        ...process.env,
        PYTHONPATH: [PYTHON_BACKEND_PATH, path.join(PYTHON_BACKEND_PATH, 'src')].join(path.delimiter)
      },
      stdio: 'pipe',
      shell: true
    });

    let backendStarted = false;

    backendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`🐍 Backend: ${output.trim()}`);
      
      // Check if backend started successfully
      if (output.includes('Uvicorn running') || output.includes('Application startup complete')) {
        backendStarted = true;
      }
    });

    backendProcess.stderr.on('data', (data) => {
      const error = data.toString();
      console.error(`🐍 Backend Error: ${error.trim()}`);
    });

    backendProcess.on('error', (error) => {
      console.error('❌ Failed to start backend process:', error.message);
    });

    backendProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(`❌ Backend process exited with code ${code}`);
      }
    });

    // Wait for backend to start
    console.log('⏳ Waiting for backend to start...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Verify backend is running
    const isRunning = await checkBackendRunning();
    if (isRunning) {
      console.log('✅ Backend started successfully!');
      return true;
    } else {
      console.log('⚠️  Backend may still be starting or failed to start');
      return backendStarted;
    }

  } catch (error) {
    console.error('❌ Error starting backend:', error.message);
    return false;
  }
}

// Function to try starting with different methods
async function tryStartBackend() {
  console.log('🔄 Trying to start backend with uvicorn directly...');
  
  const pythonCmd = findPythonExecutable();
  
  // Try starting with uvicorn directly first
  try {
    const backendProcess = spawn(pythonCmd, ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'], {
      cwd: PYTHON_BACKEND_PATH,
      env: {
        ...process.env,
        PYTHONPATH: [PYTHON_BACKEND_PATH, path.join(PYTHON_BACKEND_PATH, 'src')].join(path.delimiter)
      },
      stdio: 'pipe',
      shell: true
    });

    let backendStarted = false;

    backendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`🐍 Backend: ${output.trim()}`);
      
      if (output.includes('Uvicorn running') || output.includes('Application startup complete')) {
        backendStarted = true;
      }
    });

    backendProcess.stderr.on('data', (data) => {
      const error = data.toString();
      console.error(`🐍 Backend Error: ${error.trim()}`);
    });

    backendProcess.on('error', (error) => {
      console.error('❌ Failed to start backend process:', error.message);
    });

    // Wait for backend to start
    console.log('⏳ Waiting for backend to start...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    const isRunning = await checkBackendRunning();
    if (isRunning) {
      console.log('✅ Backend started successfully with uvicorn!');
      return true;
    }

    // If uvicorn didn't work, try the original method
    console.log('🔄 Trying original main.py method...');
    return await startBackend();

  } catch (error) {
    console.error('❌ Error with uvicorn method:', error.message);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log('🔄 Starting automatic backend startup process...');
    
    const isRunning = await checkBackendRunning();
    
    if (isRunning) {
      console.log('✅ Backend is already running!');
      process.exit(0);
    }
    
    console.log('🚀 Backend not detected, starting it now...');
    const success = await tryStartBackend();
    
    if (success) {
      console.log('✅ Backend startup completed successfully!');
    } else {
      console.log('⚠️  Backend startup may have issues, but proceeding with mobile app...');
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error in main process:', error.message);
    console.log('⚠️  Proceeding with mobile app startup despite backend error...');
    process.exit(0);
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(0); // Don't block mobile app startup
});