import { loadPedidoById } from './pedidos';
import { getTrackingHistory } from './tracking';
import type { PedidoResponse, TrackingPoint } from './types';

export async function apiGetPedidoById(id: string): Promise<PedidoResponse> {
  const p = await loadPedidoById(id);
  if (!p) throw new Error('Pedido no encontrado');
  return p;
}

export async function apiGetTrackingForPedido(id: string): Promise<TrackingPoint[]> {
  return getTrackingHistory(id);
}