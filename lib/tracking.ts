import { mockTrackingPoints } from './mock-data';
import { TrackingPoint } from './types';

export async function createTrackingPoint(data: {
  id_pedido: string;
  id_transportista?: string;
  latitud: number;
  longitud: number;
  estado: string;
  comentario?: string;
}): Promise<TrackingPoint> {
  const newPoint: TrackingPoint = {
    id_tracking: Math.max(...mockTrackingPoints.map(p => p.id_tracking)) + 1,
    ...data,
    fecha_hora: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
  mockTrackingPoints.push(newPoint);
  return newPoint;
}

export async function getTrackingHistory(pedidoId: string): Promise<TrackingPoint[]> {
  return mockTrackingPoints.filter(p => p.id_pedido === pedidoId);
}

export async function getLatestTracking(pedidoId: string): Promise<TrackingPoint | null> {
  const points = mockTrackingPoints.filter(p => p.id_pedido === pedidoId);
  if (points.length === 0) {
    return null;
  }
  return points.reduce((latest, current) => new Date(current.fecha_hora) > new Date(latest.fecha_hora) ? current : latest);
}

export async function getTrackingByTransportista(transportistaId: string, limit = 50): Promise<TrackingPoint[]> {
    const points = mockTrackingPoints.filter(p => p.id_transportista === transportistaId);
    return points.slice(0, limit);
}

export async function createTestTrackingPoints(pedidoId: string): Promise<void> {
    // The mock data already contains test tracking points.
    console.log(`Test tracking points for order ${pedidoId} are already loaded in mock data.`);
}


