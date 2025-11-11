import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

type Props = {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  sku?: string;
  imageUrl?: string;
  onAdd: () => void;
  onRemove?: () => void;
  quantity?: number;
};

export default function ProductCard({ nombre, descripcion, precio, sku, imageUrl, onAdd, onRemove, quantity }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.thumbnail}>
          {/* Use provided imageUrl, otherwise use a stable placeholder */}
          <Image source={{ uri: imageUrl || 'https://via.placeholder.com/80.png?text=Prod' }} style={styles.image} />
        </View>
      </View>
      <View style={styles.center}>
        <Text style={styles.title}>{nombre}</Text>
        {descripcion ? <Text style={styles.desc}>{descripcion}</Text> : null}
        <Text style={styles.price}>${precio.toFixed(2)}</Text>
        {sku ? <Text style={styles.sku}>{sku}</Text> : null}
      </View>
      <View style={styles.right}>
        <TouchableOpacity onPress={onAdd} style={styles.addBtn} accessibilityLabel={`Agregar ${nombre}`}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.qty}>{quantity ?? 0}</Text>
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn} accessibilityLabel={`Quitar ${nombre}`}>
          <Text style={styles.removeText}>-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee' },
  left: { width: 80, alignItems: 'center' },
  thumbnail: { width: 64, height: 64, borderRadius: 8, overflow: 'hidden', backgroundColor: '#f2f2f2' },
  image: { width: '100%', height: '100%' },
  center: { flex: 1, paddingHorizontal: 12 },
  title: { fontWeight: '700', fontSize: 16 },
  desc: { color: '#666', marginTop: 4 },
  price: { marginTop: 8, fontWeight: '700' },
  sku: { color: '#999', fontSize: 12, marginTop: 4 },
  right: { width: 80, alignItems: 'center', justifyContent: 'center' },
  addBtn: { backgroundColor: '#0a84ff', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  addText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  removeBtn: { marginTop: 8, backgroundColor: '#e0e0e0', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  removeText: { color: '#333', fontSize: 18, fontWeight: '700' },
  qty: { marginTop: 6, fontWeight: '700' },
});
