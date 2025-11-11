import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { API_BASE_URL } from '@/constants/config';

export default function DbHealthBanner() {
  const [status, setStatus] = useState<'unknown' | 'ok' | 'down'>('unknown');
  const [detail, setDetail] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  async function checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      // backend returns 200 with JSON {status: 'ok'} or {status: 'down', detail: '...'}
      const data = await res.json();
      if (data?.status === 'ok') {
        setStatus('ok');
        setDetail(null);
        setDismissed(false);
      } else {
        setStatus('down');
        setDetail(data?.detail ?? 'Sin detalle');
      }
    } catch (e: any) {
      setStatus('down');
      setDetail(String(e));
    }
  }

  useEffect(() => {
    checkHealth();
    const id = setInterval(checkHealth, 30_000); // every 30s
    return () => clearInterval(id);
  }, []);

  if (status === 'unknown' || status === 'ok' || dismissed) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>No se pudo conectarse a la base de datos</Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
      <TouchableOpacity onPress={() => setDismissed(true)} style={styles.close}>
        <Text style={styles.closeText}>Cerrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 0,
    left: 0,
    right: 0,
    backgroundColor: '#b00020',
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 9999,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
  },
  detail: {
    color: '#fee',
    marginTop: 4,
    fontSize: 12,
  },
  close: {
    position: 'absolute',
    right: 10,
    top: 6,
    padding: 6,
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
