import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { getCurrentUser, getTransportistaId } from '@/lib/auth';
import { loadPedidos } from '@/lib/pedidos';
import { PedidoResponse } from '@/lib/types';
import { useRouter } from 'expo-router';

export default function AsignadosScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = getCurrentUser();
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    loadPedidosAsignados();
  }, [fade]);

  const loadPedidosAsignados = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const transportistaId = await getTransportistaId();
      if (!transportistaId) {
        setError('No se pudo obtener la información del transportista');
        return;
      }

      const todosPedidos = await loadPedidos();
      const pedidosAsignados = todosPedidos.filter(pedido => 
        pedido.id_transportista === transportistaId
      );
      
      setPedidos(pedidosAsignados);
    } catch (err) {
      console.error('Error cargando pedidos asignados:', err);
      setError('No se pudieron cargar los pedidos asignados');
    } finally {
      setLoading(false);
    }
  };

  const handlePedidoPress = (id_pedido: string) => {
    router.push({ pathname: '/(driver)/gps', params: { id_pedido } });
  };

  const renderPedido = ({ item }: { item: PedidoResponse }) => (
    <Pressable onPress={() => handlePedidoPress(item.id_pedido)} style={styles.pedidoCard}>
      <ThemedText type="defaultSemiBold">Pedido</ThemedText>
      <ThemedText>Tracking: {item.numero_tracking}</ThemedText>
      <ThemedText>Estado: {item.estado}</ThemedText>
      <ThemedText>Monto: ${item.monto_total}</ThemedText>
      <ThemedText>Fecha: {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</ThemedText>
    </Pressable>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}> 
      <ThemedText type="title">Pedidos asignados</ThemedText>
      {currentUser && (
        <ThemedText style={{ marginBottom: 16, color: '#666' }}>
          Transportista: {currentUser.nombre} {currentUser.apellido}
        </ThemedText>
      )}

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={{ marginTop: 8 }}>Cargando pedidos...</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <ThemedText style={{ color: '#c00' }}>{error}</ThemedText>
        </View>
      ) : pedidos.length === 0 ? (
        <View style={styles.centerContainer}>
          <ThemedText>No tienes pedidos asignados</ThemedText>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id_pedido}
          renderItem={renderPedido}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#121212' },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pedidoCard: {
    backgroundColor: '#222',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
});