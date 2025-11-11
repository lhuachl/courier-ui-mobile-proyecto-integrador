import React, { useState } from 'react';
import { Alert, TextInput, StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { register } from '@/lib/auth';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rol, setRol] = useState('cliente'); // Default role
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);
    const { error } = await register(email, password, nombre, apellido, rol);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Éxito', 'Usuario registrado');
      router.replace('/login');
    }
    setLoading(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Crear cuenta</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
        placeholderTextColor="#888"
      />
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
      <TextInput
        style={styles.input}
        placeholder="Rol (cliente o transportista)"
        value={rol}
        onChangeText={setRol}
        placeholderTextColor="#888"
      />
      <Pressable style={styles.button} onPress={onSubmit} disabled={loading}>
        <ThemedText style={styles.buttonText}>{loading ? 'Cargando...' : 'Registrarme'}</ThemedText>
      </Pressable>
      <Pressable onPress={() => router.push('/login')} style={styles.loginLink}>
        <ThemedText style={styles.loginLinkText}>¿Ya tienes una cuenta? Inicia sesión</ThemedText>
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
  loginLink: { marginTop: 24, alignItems: 'center' },
  loginLinkText: { color: '#0ea5e9' },
});
