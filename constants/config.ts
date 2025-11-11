// API base URL used by the mobile app to contact the FastAPI backend.
// This picks a sensible default depending on the platform:
// - Android emulator: 10.0.2.2 points to host machine's localhost
// - iOS simulator / web: localhost works
// You can still override it at build/run time by setting REACT_NATIVE_API_BASE_URL
import { Platform } from 'react-native';

const defaultHost = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

// Allow runtime override via a global variable (useful with expo) or process.env at build time
const runtimeOverride = (global as any)?.REACT_NATIVE_API_BASE_URL || (global as any)?.__API_BASE_URL || (typeof process !== 'undefined' && (process.env.REACT_NATIVE_API_BASE_URL as string));

export const API_BASE_URL = runtimeOverride || defaultHost;
