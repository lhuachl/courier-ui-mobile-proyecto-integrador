import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import DbHealthBanner from '@/components/DbHealthBanner';
import { useEffect } from 'react';
import { detectBackend } from '@/lib/detectBackend';
import { Platform } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Ensure a sensible default runtime override exists so fetch won't fail due to wrong host
    if (!(global as any)?.REACT_NATIVE_API_BASE_URL) {
      if (Platform.OS === 'android') {
        (global as any).REACT_NATIVE_API_BASE_URL = 'http://10.0.2.2:8000';
      } else {
        (global as any).REACT_NATIVE_API_BASE_URL = 'http://localhost:8000';
      }
    }
    // try to auto-detect backend and set global override for API_BASE_URL
    (async () => {
      const url = await detectBackend();
      if (url) console.log('Detected backend at', url);
      else console.warn('Backend detection failed — make sure API_BASE_URL is set');
    })();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <DbHealthBanner />
      <Stack>
        <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="(user)" options={{ headerShown: false }} />
        <Stack.Screen name="(driver)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
