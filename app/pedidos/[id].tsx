import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View, Button, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { apiGetPedidoById, apiGetTrackingForPedido } from '@/lib/api';
import type { TrackingPoint } from '@/lib/types';
import type { PedidoResponse } from '@/lib/types';

export default function PedidoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pedido, setPedido] = useState<PedidoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState<TrackingPoint[]>([]);
  const [loadingTracking, setLoadingTracking] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;
        const data = await apiGetPedidoById(String(id));
        setPedido(data);
        // attempt to load tracking points (best-effort)
        try {
          setLoadingTracking(true);
          const tr = await apiGetTrackingForPedido(Number(id));
          setTracking(tr as TrackingPoint[]);
        } catch (e) {
          // ignore - tracking endpoint may require auth in dev
        } finally {
          setLoadingTracking(false);
        }
      } catch (e: any) {
        Alert.alert('Error', e?.message ?? 'No se pudo cargar el pedido');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (!pedido) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>No encontrado</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{pedido.numero_tracking}</ThemedText>
      <ThemedText>Estado: {pedido.estado}</ThemedText>
      {pedido.prioridad ? <ThemedText>Prioridad: {pedido.prioridad}</ThemedText> : null}
      {pedido.peso != null ? <ThemedText>Peso: {pedido.peso} kg</ThemedText> : null}
      {pedido.monto_total != null ? <ThemedText>Monto: ${pedido.monto_total}</ThemedText> : null}
      {pedido.fecha_entrega_estimada ? (
        <ThemedText>Entrega estimada: {new Date(pedido.fecha_entrega_estimada).toLocaleString()}</ThemedText>
      ) : null}
      <View style={{ marginTop: 12 }}>
        <Button title={loadingTracking ? 'Cargando tracking...' : 'Actualizar tracking'} onPress={async () => {
          try {
            setLoadingTracking(true);
            const tr = await apiGetTrackingForPedido(Number(id));
            setTracking(tr as TrackingPoint[]);
          } catch (e:any) {
            Alert.alert('Error', e?.message ?? 'No se pudo cargar tracking');
          } finally {
            setLoadingTracking(false);
          }
        }} />
      </View>

      <FlatList
        data={tracking}
        keyExtractor={(t) => String(t.id_tracking)}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 6 }}>
            <ThemedText>{item.fecha_hora ? new Date(item.fecha_hora).toLocaleString() : 'Sin fecha'}</ThemedText>
            <ThemedText>Lat: {item.latitud ?? '-'} Lng: {item.longitud ?? '-'}</ThemedText>
            {item.estado ? <ThemedText>Estado: {item.estado}</ThemedText> : null}
            {item.comentario ? <ThemedText>Nota: {item.comentario}</ThemedText> : null}
          </View>
        )}
        ListEmptyComponent={() => <ThemedText>No hay puntos de tracking</ThemedText>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 8, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
