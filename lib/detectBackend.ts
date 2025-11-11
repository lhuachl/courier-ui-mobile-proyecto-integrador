/**
 * Backend detection utility
 * Detects a reachable backend URL, with env override and retries.
 */
import Constants from 'expo-constants';

function withTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(`${url}/health`, { method: 'GET', signal: controller.signal })
    .finally(() => clearTimeout(id));
}

export async function detectBackend(): Promise<string | null> {
  try {
    // 1) Build candidate URLs, respecting env overrides
    const envUrl = (typeof process !== 'undefined' && process.env && (process.env.EXPO_PUBLIC_API_BASE_URL as string))
      || (Constants?.expoConfig?.extra as any)?.apiBaseUrl
      || null;

    const host = (typeof window !== 'undefined' && window.location?.hostname) || 'localhost';

    const candidates = Array.from(new Set([
      envUrl || '',
      `http://${host}:8000`,
      'http://localhost:8000',
      'http://127.0.0.1:8000',
      'http://10.0.2.2:8000', // Android emulator
    ].filter(Boolean)));

    // 2) Try multiple passes to allow backend startup (preweb may start it)
    const attempts = 5;
    for (let pass = 1; pass <= attempts; pass++) {
      for (const base of candidates) {
        try {
          const res = await withTimeout(base, 2000);
          if (res.ok) {
            console.log(`Backend detected at: ${base} (pass ${pass})`);
            // Set runtime override for the rest of the app
            (global as any).REACT_NATIVE_API_BASE_URL = base;
            return base;
          }
        } catch {
          // ignore and continue
        }
      }
      // small delay before next pass
      await new Promise(r => setTimeout(r, 800));
    }

    console.warn('No backend detected on any test URL');
    return null;
  } catch (error) {
    console.error('Backend detection error:', error);
    return null;
  }
}

export default detectBackend;