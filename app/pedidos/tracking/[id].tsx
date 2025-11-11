import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Text, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TrackingPoint, getTrackingHistory, getLatestTracking } from '@/lib/tracking';

// ... (rest of the imports)

export default function PedidoTrackingScreen() {
  // ... (rest of the component)
  const [trackingHistory, setTrackingHistory] = useState<TrackingPoint[]>([]);
  // ... (rest of the component)

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
  title: {
    marginBottom: 16,
  },
  map: {
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
  },
  historyContainer: {
    marginTop: 16,
  },
  historyItem: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
});