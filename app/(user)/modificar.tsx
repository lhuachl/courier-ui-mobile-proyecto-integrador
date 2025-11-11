import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Text, FlatList, Button } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { API_BASE_URL } from '@/constants/config';

export default function ModificarScreen() {
  const slide = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start();
    fetch(`${API_BASE_URL}/pedidos/`)
      .then((r) => r.json())
      .then(setPedidos)
      .catch((e) => console.warn('Error fetching pedidos', e));
  }, [slide, opacity]);

  async function updateEstado(id: string, estado: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      setPedidos((p) => p.map((x) => (x.id === updated.id ? updated : x)));
    } catch (e) {
      console.warn('Error updating pedido', e);
    }
  }

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY: slide }] }]}> 
      <ThemedText type="title">Modificar pedidos</ThemedText>
      <FlatList
        data={pedidos}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text>{item.numero_tracking} - {item.estado}</Text>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <Button title="Marcar en ruta" onPress={() => updateEstado(item.id, 'en_ruta')} />
              <View style={{ width: 8 }} />
              <Button title="Marcar entregado" onPress={() => updateEstado(item.id, 'entregado')} />
            </View>
          </View>
        )}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });
