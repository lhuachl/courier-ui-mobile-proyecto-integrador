import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, FlatList, ActivityIndicator, Button, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { getCurrentUser, getTransportistaId } from '@/lib/auth';
import { PedidoResponse } from '@/lib/pedidos';

// ... (rest of the imports)

export default function GPSScreen() {
  // ... (rest of the component)
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  // ... (rest of the component)

  const startTracking = async () => {
    // ... (rest of the function)
    pedidos.forEach((pedido: PedidoResponse) => {
      // ... (rest of the forEach)
    });
    // ... (rest of the function)
  };

  // ... (rest of the component)
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 16,
  },
});
