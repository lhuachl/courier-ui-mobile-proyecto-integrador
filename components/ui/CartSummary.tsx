import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Item = { product_id: number; quantity: number };

type Props = {
  items: Item[];
  productsMap: Record<string, { precio: number; nombre?: string }>;
  onCheckout: () => void;
  onClear: () => void;
  loading?: boolean;
};

export default function CartSummary({ items, productsMap, onCheckout, onClear, loading }: Props) {
  const total = items.reduce((acc, it) => {
    const p = productsMap[String(it.product_id)];
    return acc + (p ? p.precio * it.quantity : 0);
  }, 0);

  const count = items.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.items}>{count} artículos</Text>
        <Text style={styles.total}>${total.toFixed(2)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onClear} style={[styles.btn, styles.clearBtn]} accessibilityLabel="Vaciar carrito">
          <Text style={styles.clearText}>Vaciar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCheckout} style={[styles.btn, styles.checkoutBtn]} disabled={items.length===0 || loading} accessibilityLabel="Crear pedido">
          <Text style={styles.checkoutText}>{loading ? 'Enviando...' : 'Crear Pedido'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 12, right: 12, bottom: 18, backgroundColor: '#fff', borderRadius: 10, padding: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6 },
  info: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  items: { color: '#666' },
  total: { fontWeight: '700', fontSize: 16 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 8 },
  clearBtn: { backgroundColor: '#f2f2f2' },
  clearText: { color: '#333' },
  checkoutBtn: { backgroundColor: '#0a84ff' },
  checkoutText: { color: '#fff', fontWeight: '700' },
});
