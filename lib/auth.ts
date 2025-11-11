import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { mockUsers } from './mock-data';

const AUTH_TOKEN_KEY = 'auth_token';

export interface User {
  id_usuario: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  estado: string;
}

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
      const user = mockUsers.find(u => u.email === token);
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
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, user.email);
    authState.token = user.email;
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
    id_usuario: Math.max(...mockUsers.map(u => u.id_usuario)) + 1,
    email,
    nombre,
    apellido,
    rol,
    estado: 'activo',
  };
  mockUsers.push(newUser);

  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, newUser.email);
  authState.token = newUser.email;
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

export async function getClienteId(): Promise<number | null> {
  if (!isCliente() || !authState.user) return null;
  // Assuming id_usuario in User is the foreign key in clientes table
  return authState.user.id_usuario;
}

export async function getTransportistaId(): Promise<number | null> {
  if (!isTransportista() || !authState.user) return null;
  // Assuming id_usuario in User is the foreign key in transportistas table
  return authState.user.id_usuario;
}