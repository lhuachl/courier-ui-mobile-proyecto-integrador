import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { mockUsers } from './mock-data';
import type { User } from './types';

const AUTH_TOKEN_KEY = 'auth_token';

// User type ahora se importa desde './types' (UUID)

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

let authState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const listeners: Array<(state: AuthState) => void> = [];

export function addAuthListener(listener: (state: AuthState) => void) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

function notifyListeners() {
  listeners.forEach(listener => listener(authState));
}

export async function loadSession() {
  authState.isLoading = true;
  notifyListeners();
  try {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    if (token) {
      const user = mockUsers.find(u => u.email === token || u.id === token);
      if (user) {
        authState.token = token;
        authState.isAuthenticated = true;
        authState.user = user;
      }
    }
  } catch (error: any) {
    console.error('Error loading session:', error.message);
  } finally {
    authState.isLoading = false;
    notifyListeners();
  }
}

export async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  authState.isLoading = true;
  notifyListeners();

  const user = mockUsers.find(u => u.email === email);

  if (user) {
    const token = user.email ?? user.id;
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    authState.token = token;
    authState.isAuthenticated = true;
    authState.user = user;
    authState.isLoading = false;
    notifyListeners();
    return { success: true, user };
  } else {
    authState.isLoading = false;
    notifyListeners();
    return { success: false, error: 'Invalid credentials' };
  }
}

export async function register(email: string, password: string, nombre: string, apellido: string, rol: string): Promise<{ success: boolean; user?: User; error?: string }> {
  authState.isLoading = true;
  notifyListeners();

  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    authState.isLoading = false;
    notifyListeners();
    return { success: false, error: 'User already exists' };
  }

  const newUser: User = {
    id: generateUUID(),
    email,
    nombre,
    apellido,
    rol: rol as any,
  };
  mockUsers.push(newUser);

  const token = newUser.email ?? newUser.id;
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  authState.token = token;
  authState.isAuthenticated = true;
  authState.user = newUser;
  authState.isLoading = false;
  notifyListeners();

  return { success: true, user: newUser };
}

export async function logout() {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error deleting auth token from SecureStore:', error);
  }
  authState.user = null;
  authState.token = null;
  authState.isAuthenticated = false;
  notifyListeners();
  console.log('Usuario deslogueado');
}

export function getAuthState(): AuthState {
  return { ...authState };
}

export function isAuthenticated(): boolean {
  return authState.isAuthenticated;
}

export function getCurrentUser(): User | null {
  return authState.user;
}

export function isCliente(): boolean {
  return authState.user?.rol === 'cliente';
}

export function isTransportista(): boolean {
  return authState.user?.rol === 'transportista';
}

export async function getClienteId(): Promise<string | null> {
  if (!isCliente() || !authState.user) return null;
  return authState.user.id;
}

export async function getTransportistaId(): Promise<string | null> {
  if (!isTransportista() || !authState.user) return null;
  return authState.user.id;
}

function generateUUID(): string {
  const g: any = globalThis as any;
  if (typeof g.crypto?.randomUUID === 'function') {
    return g.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}