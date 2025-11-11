import React, { useState } from 'react';
import { Alert, TextInput, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { login, getCurrentUser } from '@/lib/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    const { success, error } = await login(email, password);
    if (error) {
      Alert.alert('Error', error);
    } else if (success) {
      const user = getCurrentUser();
      if (user) {
        if (user.rol === 'transportista') {
          router.replace('/(driver)/asignados');
        } else if (user.rol === 'cliente') {
          router.replace('/(user)/pedir');
        } else {
          Alert.alert('Error', 'Rol de usuario desconocido.');
        }
      } else {
        Alert.alert('Error', 'No se pudo obtener el perfil del usuario.');
      }
    }
    setLoading(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Iniciar Sesión</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />
      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        <ThemedText style={styles.buttonText}>{loading ? 'Cargando...' : 'Entrar'}</ThemedText>
      </Pressable>
      <Pressable onPress={() => router.push('/register')} style={styles.registerLink}>
        <ThemedText style={styles.registerLinkText}>¿No tienes una cuenta? Regístrate</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16, padding: 24, justifyContent: 'center', backgroundColor: '#121212' },
  title: { textAlign: 'center', marginBottom: 24, color: '#fff' },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  registerLink: { marginTop: 24, alignItems: 'center' },
  registerLinkText: { color: '#0ea5e9' },
});
