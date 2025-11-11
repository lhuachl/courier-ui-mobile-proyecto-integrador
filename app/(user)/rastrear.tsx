import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { API_BASE_URL } from '@/constants/config';

export default function RastrearScreen() {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [tracking, setTracking] = useState('');
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [scale, opacity]);

  async function doTrack() {
    try {
      const res = await fetch(`${API_BASE_URL}/pedidos/tracking/${encodeURIComponent(tracking)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: String(e) });
    }
  }

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ scale }] }]}> 
      <ThemedText type="title">Rastrear pedidos</ThemedText>
      <TextInput placeholder="Número de tracking" value={tracking} onChangeText={setTracking} style={styles.input} />
      <Button title="Buscar" onPress={doTrack} />
      <View style={{ marginTop: 12 }}>
        {result ? <Text>{JSON.stringify(result)}</Text> : <Text>Ingrese un número de tracking y pulse Buscar</Text>}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8 }
});
