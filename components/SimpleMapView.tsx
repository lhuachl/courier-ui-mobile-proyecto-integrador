import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { ThemedText } from './themed-text';

interface MapViewProps {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  style?: any;
  children?: React.ReactNode;
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
}

interface MarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title?: string;
  description?: string;
  pinColor?: string;
}

interface PolylineProps {
  coordinates: Array<{
    latitude: number;
    longitude: number;
  }>;
  strokeColor?: string;
  strokeWidth?: number;
}

// Componente Marker simple
const SimpleMarker: React.FC<MarkerProps> = ({ coordinate, title, description, pinColor }) => {
  const getMarkerColor = (color?: string) => {
    switch (color) {
      case 'green': return '🟢';
      case 'red': return '🔴';
      case 'blue': 
      default: return '🔵';
    }
  };

  return (
    <View style={styles.marker}>
      <Text style={styles.markerIcon}>
        {getMarkerColor(pinColor)}
      </Text>
      <View style={styles.markerInfo}>
        <Text style={styles.markerTitle}>
          {title || 'Ubicación'}
        </Text>
        <Text style={styles.markerDescription}>
          {description || ''}
        </Text>
        <Text style={styles.markerCoords}>
          {coordinate.latitude.toFixed(4)}, {coordinate.longitude.toFixed(4)}
        </Text>
      </View>
    </View>
  );
};

// Componente Polyline simple
const SimplePolyline: React.FC<PolylineProps> = ({ coordinates, strokeColor = '#0ea5e9', strokeWidth = 3 }) => {
  return (
    <View style={styles.polylineContainer}>
      <Text style={styles.polylineTitle}>📍 Ruta del pedido:</Text>
      {coordinates.map((coord, index) => (
        <Text key={index} style={styles.polylinePoint}>
          {index + 1}. {coord.latitude.toFixed(4)}, {coord.longitude.toFixed(4)}
        </Text>
      ))}
    </View>
  );
};

// Componente MapView simple
const SimpleMapView: React.FC<MapViewProps> = ({ 
  region, 
  style, 
  children, 
  showsUserLocation = false, 
  showsMyLocationButton = false 
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          🗺️ Ubicación del Pedido
        </ThemedText>
        <ThemedText style={styles.coords}>
          Centro: {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
        </ThemedText>
        {showsUserLocation && (
          <ThemedText style={styles.userLocation}>
            📍 Mostrando tu ubicación
          </ThemedText>
        )}
      </View>
      
      <View style={styles.content}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            if (child.type === SimpleMarker) {
              return child;
            } else if (child.type === SimplePolyline) {
              return child;
            }
          }
          return null;
        })}
      </View>
      
      <View style={styles.footer}>
        <ThemedText style={styles.note}>
          💡 Mapa interactivo disponible en dispositivos móviles
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    marginBottom: 4,
  },
  coords: {
    color: '#e0f2fe',
    fontSize: 14,
  },
  userLocation: {
    color: '#e0f2fe',
    fontSize: 12,
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  marker: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  markerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  markerInfo: {
    flex: 1,
  },
  markerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1f2937',
  },
  markerDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  markerCoords: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  polylineContainer: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  polylineTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0ea5e9',
  },
  polylinePoint: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  footer: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    alignItems: 'center',
  },
  note: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default SimpleMapView;
export { SimpleMarker as Marker, SimplePolyline as Polyline };

