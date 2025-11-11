import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
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

// Componente Marker para móvil
const MobileMarker: React.FC<MarkerProps> = ({ coordinate, title, description, pinColor }) => {
  if (Platform.OS === 'web') {
    return null; // Se renderizará en el componente web
  }
  
  // En móvil, este componente será reemplazado por el MapView real
  return null;
};

// Componente Polyline para móvil
const MobilePolyline: React.FC<PolylineProps> = ({ coordinates, strokeColor, strokeWidth }) => {
  if (Platform.OS === 'web') {
    return null; // Se renderizará en el componente web
  }
  
  return null;
};

// Componente MapView principal
const MapViewComponent: React.FC<MapViewProps> = ({ 
  region, 
  style, 
  children, 
  showsUserLocation = false, 
  showsMyLocationButton = false 
}) => {
  if (Platform.OS === 'web') {
    // Versión web con mapa estático
    return (
      <View style={[styles.webMapContainer, style]}>
        <View style={styles.webMap}>
          <ThemedText type="defaultSemiBold" style={styles.webMapTitle}>
            🗺️ Mapa de Ubicación
          </ThemedText>
          <ThemedText style={styles.webMapCoords}>
            Lat: {region.latitude.toFixed(4)}, Lng: {region.longitude.toFixed(4)}
          </ThemedText>
          <ThemedText style={styles.webMapNote}>
            (Mapa interactivo disponible en dispositivos móviles)
          </ThemedText>
          
          {/* Renderizar marcadores como texto en web */}
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === MobileMarker) {
              const props = child.props as MarkerProps;
              return (
                <View key={`marker-${props.coordinate.latitude}-${props.coordinate.longitude}`} style={styles.webMarker}>
                  <Text style={styles.webMarkerText}>
                    📍 {props.title || 'Ubicación'}
                  </Text>
                  <Text style={styles.webMarkerDesc}>
                    {props.description}
                  </Text>
                  <Text style={styles.webMarkerCoords}>
                    {props.coordinate.latitude.toFixed(4)}, {props.coordinate.longitude.toFixed(4)}
                  </Text>
                </View>
              );
            }
            return null;
          })}
        </View>
      </View>
    );
  }

  // En móvil, usar el MapView real
  try {
    const MapView = require('react-native-maps').default;
    const Marker = require('react-native-maps').Marker;
    const Polyline = require('react-native-maps').Polyline;

    return (
      <MapView
        region={region}
        style={style}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={showsMyLocationButton}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            if (child.type === MobileMarker) {
              const props = child.props as MarkerProps;
              return (
                <Marker
                  key={`marker-${props.coordinate.latitude}-${props.coordinate.longitude}`}
                  coordinate={props.coordinate}
                  title={props.title}
                  description={props.description}
                  pinColor={props.pinColor}
                />
              );
            } else if (child.type === MobilePolyline) {
              const props = child.props as PolylineProps;
              return (
                <Polyline
                  key={`polyline-${props.coordinates.length}`}
                  coordinates={props.coordinates}
                  strokeColor={props.strokeColor}
                  strokeWidth={props.strokeWidth}
                />
              );
            }
          }
          return child;
        })}
      </MapView>
    );
  } catch (error) {
    // Fallback si react-native-maps no está disponible
    return (
      <View style={[styles.fallbackContainer, style]}>
        <ThemedText type="defaultSemiBold" style={styles.fallbackTitle}>
          🗺️ Mapa no disponible
        </ThemedText>
        <ThemedText style={styles.fallbackText}>
          Instala react-native-maps para ver el mapa interactivo
        </ThemedText>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  webMapContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  webMap: {
    padding: 16,
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center',
  },
  webMapTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  webMapCoords: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  webMapNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  webMarker: {
    backgroundColor: '#fff',
    padding: 8,
    marginVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 200,
  },
  webMarkerText: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  webMarkerDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  webMarkerCoords: {
    fontSize: 10,
    color: '#999',
  },
  fallbackContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  fallbackTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

// Exportar componentes
export default MapViewComponent;
export { MobileMarker as Marker, MobilePolyline as Polyline };

