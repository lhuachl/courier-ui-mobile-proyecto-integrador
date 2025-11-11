import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Text, FlatList, Button, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ProductCard from '@/components/ui/ProductCard';
import CartSummary from '@/components/ui/CartSummary';
import { Platform } from 'react-native';
import { createPedido } from '@/lib/pedidos';
import { getClienteId } from '@/lib/auth';
import type { PedidoCreate } from '@/lib/types';

// Read the runtime global that `detectBackend` sets at app start.
const getApiBase = () => (global as any).REACT_NATIVE_API_BASE_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000');

type Product = {
  id: number; // mapped from id_producto
  nombre: string;
  descripcion?: string;
  precio: number; // mapped from precio_unitario
  sku?: string;
  cantidad?: number;
  image_url?: string;
};

export default function PedirScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  }, [fade]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetch(`${getApiBase()}/productos/`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        // Map backend product shape to frontend Product
        const mapped = (data || []).map((p: any) => ({
          id: Number(p.id_producto ?? p.id ?? p._id ?? 0),
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: Number(p.precio_unitario ?? p.precio ?? 0),
          sku: p.sku,
          cantidad: p.cantidad ?? 0,
          image_url: p.image_url ?? p.image ?? undefined,
        }));
        mounted && setProducts(mapped as Product[]);
      })
      .catch((e) => {
        console.warn('Error fetching products', e);
        if (mounted) setError('No se pudieron cargar los productos');
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  function addToCart(p: Product) {
    setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + 1 }));
  }

  function removeFromCart(p: Product) {
    setCart((c) => {
      const next = { ...c };
      if (!next[p.id]) return next;
      next[p.id] = Math.max(0, next[p.id] - 1);
      if (next[p.id] === 0) delete next[p.id];
      return next;
    });
  }

  function genUUID() {
    const g: any = globalThis as any;
    if (typeof g.crypto?.randomUUID === 'function') {
      return g.crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  async function createPedidoAction() {
    const items = Object.entries(cart).map(([productId, qty]) => ({ product_id: Number(productId), quantity: qty }));
    if (items.length === 0) return Alert.alert('Carrito vacío', 'Seleccione productos antes de crear el pedido');

    const monto_total = items.reduce((acc, it) => {
      const p = products.find((x) => x.id === Number(it.product_id));
      return acc + (p ? p.precio * it.quantity : 0);
    }, 0);

    const perfilId = (await getClienteId()) || genUUID();
    const payload: PedidoCreate = {
      id_perfil: perfilId,
      id_direccion_origen: genUUID(),
      id_direccion_destino: genUUID(),
      estado: 'pendiente',
      fecha_entrega_estimada: new Date().toISOString(),
      monto_total,
      // id_transportista: opcional; se asigna luego por operador
      Ubicacion: undefined,
    };

    if (submitting) return; // prevent duplicates
    setSubmitting(true);
    try {
      const created = await createPedido(payload);
      Alert.alert('Pedido creado', `ID: ${String(created.id_pedido)}`);
      setCart({});
    } catch (e) {
      console.warn('Error creating pedido', e);
      Alert.alert('Error', 'No se pudo crear el pedido. ' + String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}> 
      <ThemedText type="title">Pedir</ThemedText>
      <ThemedText>Productos disponibles</ThemedText>

      {loading ? (
        <View style={{ padding: 24, alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={{ padding: 16 }}>
          <Text style={{ color: '#c00' }}>{error}</Text>
          <Button title="Reintentar" onPress={() => {
            setProducts([]);
            setError(null);
            setLoading(true);
            fetch(`${getApiBase()}/productos/`).then(r => r.json()).then(setProducts).catch(e => setError('No se pudieron cargar los productos')).finally(() => setLoading(false));
          }} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(i) => i.id.toString()}
          contentContainerStyle={{ paddingBottom: 140 }}
          renderItem={({ item }) => (
            <ProductCard
              id={item.id}
              nombre={item.nombre}
              descripcion={item.descripcion}
              precio={item.precio}
              sku={item.sku}
              imageUrl={(item as any).image_url || (item as any).image || undefined}
              quantity={cart[item.id] ?? 0}
              onAdd={() => addToCart(item)}
              onRemove={() => removeFromCart(item)}
            />
          )}
        />
      )}

      <CartSummary
        items={Object.entries(cart).map(([product_id, quantity]) => ({ product_id: Number(product_id), quantity }))}
        productsMap={products.reduce((acc, p) => ({ ...acc, [String(p.id)]: { precio: p.precio, nombre: p.nombre } }), {} as Record<string, { precio: number; nombre?: string }>)}
        onCheckout={createPedidoAction}
        onClear={() => setCart({})}
        loading={submitting}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  product: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  btn: { backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
});
