import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { loadPedidos } from '@/lib/pedidos';
import type { PedidoResponse } from '@/lib/types';

export default function PedidosScreen() {
  const [items, setItems] = useState<PedidoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const load = async () => {
    try {
      setLoading(true);
      const data = await loadPedidos();
      setItems(data);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id_pedido.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({ pathname: '/pedidos/[id]', params: { id: item.id_pedido } })
            }
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <ThemedText style={styles.trackingNumber}>{item.numero_tracking}</ThemedText>
              <ThemedText style={[styles.status, styles[item.estado]]}>{item.estado}</ThemedText>
            </View>
            <View style={styles.cardBody}>
              <ThemedText style={styles.date}>
                {new Date(item.fecha_solicitud).toLocaleDateString()}
              </ThemedText>
              <ThemedText style={styles.total}>${item.monto_total.toFixed(2)}</ThemedText>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<ThemedText>No hay pedidos</ThemedText>}
        contentContainerStyle={items.length === 0 ? styles.center : undefined}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trackingNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
    color: 'white',
  },
  pendiente: {
    backgroundColor: '#ffc107', // amber
  },
  en_camino: {
    backgroundColor: '#17a2b8', // info
  },
  entregado: {
    backgroundColor: '#28a745', // success
  },
  cancelado: {
    backgroundColor: '#dc3545', // danger
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: '#6c757d',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
