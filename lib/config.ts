import { config } from 'dotenv';
import { resolve } from 'path';
import Constants from 'expo-constants';

// Cargar variables de entorno desde DB.env
config({ path: resolve(__dirname, '../DB.env') });

// Configuración de Supabase
export const supabaseConfig = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || Constants.expoConfig?.extra?.supabaseUrl || 'https://hlmngthhnvbdvbrxukqy.supabase.co',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_KEY || Constants.expoConfig?.extra?.supabaseAnonKey || '',
};

// Configuración de JWT (para el backend si es necesario)
export const jwtConfig = {
  secretKey: process.env.SECRET_KEY || '',
  algorithm: process.env.JWT_ALGORITHM || 'HS256',
  accessTokenExpireMinutes: parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || '60'),
};

// Función para verificar que las configuraciones estén cargadas
export function validateConfig() {
  const errors: string[] = [];
  
  if (!supabaseConfig.url) {
    errors.push('EXPO_PUBLIC_SUPABASE_URL no está definida');
  }
  
  if (!supabaseConfig.anonKey) {
    errors.push('EXPO_PUBLIC_SUPABASE_KEY no está definida');
  }
  
  if (errors.length > 0) {
    console.error('Errores de configuración:', errors);
    return false;
  }
  
  return true;
}

