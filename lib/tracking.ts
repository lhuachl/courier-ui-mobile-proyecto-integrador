import { mockTrackingPoints } from './mock-data';
import { TrackingPoint } from './types';

export async function createTrackingPoint(data: {
  id_pedido: number;
  id_transportista?: number;
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

export async function getTrackingHistory(pedidoId: number): Promise<TrackingPoint[]> {
  return mockTrackingPoints.filter(p => p.id_pedido === pedidoId);
}

export async function getLatestTracking(pedidoId: number): Promise<TrackingPoint | null> {
  const points = mockTrackingPoints.filter(p => p.id_pedido === pedidoId);
  if (points.length === 0) {
    return null;
  }
  return points.reduce((latest, current) => new Date(current.fecha_hora) > new Date(latest.fecha_hora) ? current : latest);
}

export async function getTrackingByTransportista(transportistaId: number, limit = 50): Promise<TrackingPoint[]> {
    const points = mockTrackingPoints.filter(p => p.id_transportista === transportistaId);
    return points.slice(0, limit);
}

export async function createTestTrackingPoints(pedidoId: number): Promise<void> {
    // The mock data already contains test tracking points.
    console.log(`Test tracking points for order ${pedidoId} are already loaded in mock data.`);
}


