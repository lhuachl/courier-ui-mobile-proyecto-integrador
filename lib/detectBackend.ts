/**
 * Backend detection utility
 * Attempts to detect if the Python backend is running and returns the appropriate URL
 */

export async function detectBackend(): Promise<string | null> {
  try {
    // Common backend URLs to test
    const testUrls = [
      'http://localhost:8000',
      'http://10.0.2.2:8000', // Android emulator
      'http://127.0.0.1:8000',
    ];

    // Test each URL
    for (const url of testUrls) {
      try {
        const response = await fetch(`${url}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 2000, // 2 second timeout
        });

        if (response.ok) {
          console.log(`Backend detected at: ${url}`);
          return url;
        }
      } catch (error) {
        // Continue to next URL
        console.log(`Backend not found at: ${url}`);
      }
    }

    console.warn('No backend detected on any test URL');
    return null;
  } catch (error) {
    console.error('Error detecting backend:', error);
    return null;
  }
}

export default detectBackend;