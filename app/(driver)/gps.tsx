import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, ActivityIndicator, Button, Alert, Platform, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { getCurrentUser, getTransportistaId } from '@/lib/auth';
import * as Location from 'expo-location';
import { createTrackingPoint } from '@/lib/tracking';
import { useLocalSearchParams } from 'expo-router';

let MapView: any;
let Marker: any;

if (Platform.OS === 'web') {
  MapView = require('@teovilla/react-native-web-maps').default;
  Marker = require('@teovilla/react-native-web-maps').Marker;
} else {
  MapView = require('react-native-maps').default;
  Marker = require('react-native-maps').Marker;
}

export default function GPSScreen() {
  const { id_pedido } = useLocalSearchParams();
  const fade = useRef(new Animated.Value(0)).current;
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fade, intervalId]);

  const startTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    setIsTracking(true);
    const id = setInterval(async () => {
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      const transportistaId = await getTransportistaId();
      if (transportistaId && id_pedido) {
        createTrackingPoint({
          id_pedido: String(id_pedido),
          id_transportista: transportistaId,
          latitud: currentLocation.coords.latitude,
          longitud: currentLocation.coords.longitude,
          estado: 'en_ruta',
        });
      }
    }, 5000); // Send location every 5 seconds
    setIntervalId(id);
  };

  const stopTracking = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIsTracking(false);
    setIntervalId(null);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}> 
      <ThemedText type="title">GPS Tracking for Order #{id_pedido}</ThemedText>
      {currentUser && (
        <ThemedText style={{ marginBottom: 16, color: '#999' }}>
          Transportista: {currentUser.nombre} {currentUser.apellido}
        </ThemedText>
      )}

      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
          />
        </MapView>
      ) : (
        <View style={styles.mapPlaceholder}>
          <ThemedText>Waiting for location...</ThemedText>
        </View>
      )}

      <Pressable style={[styles.button, isTracking ? styles.buttonStop : styles.buttonStart]} onPress={isTracking ? stopTracking : startTracking}>
        <ThemedText style={styles.buttonText}>{isTracking ? 'Stop Tracking' : 'Start Tracking'}</ThemedText>
      </Pressable>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#121212' },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 16,
    borderRadius: 8,
  },
  mapPlaceholder: {
    width: '100%',
    height: 300,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonStart: {
    backgroundColor: '#0ea5e9',
  },
  buttonStop: {
    backgroundColor: '#e54646',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});