import { mockPedidos } from './mock-data';
import { PedidoResponse, PedidoCreate } from './types';

export async function createPedido(pedido: PedidoCreate): Promise<PedidoResponse> {
  const now = new Date().toISOString();
  const newPedido: PedidoResponse = {
    id_pedido: generateUUID(),
    numero_tracking: `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    estado: pedido.estado || 'pendiente',
    created_at: now,
    updated_at: now,
    ...pedido,
  };
  mockPedidos.push(newPedido);
  return newPedido;
}

export async function loadPedidos(): Promise<PedidoResponse[]> {
  return [...mockPedidos];
}

export async function loadPedidoById(id: string): Promise<PedidoResponse | null> {
  return mockPedidos.find(p => p.id_pedido === id) || null;
}

export async function loadPedidoByTracking(tracking: string): Promise<PedidoResponse | null> {
  return mockPedidos.find(p => p.numero_tracking === tracking) || null;
}

export async function updatePedido(id: string, updates: Partial<PedidoCreate>): Promise<PedidoResponse> {
  const pedidoIndex = mockPedidos.findIndex(p => p.id_pedido === id);
  if (pedidoIndex === -1) {
    throw new Error('Pedido not found');
  }
  const updatedPedido = { ...mockPedidos[pedidoIndex], ...updates, updated_at: new Date().toISOString() };
  mockPedidos[pedidoIndex] = updatedPedido;
  return updatedPedido;
}

export async function loadPedidosByCliente(perfilId: string): Promise<PedidoResponse[]> {
  return mockPedidos.filter(p => p.id_perfil === perfilId);
}

export async function cancelarPedido(id: string): Promise<PedidoResponse> {
  return updatePedido(id, { estado: 'cancelado' });
}

// Eliminado pagarPedido: el estado 'pagado' no pertenece al enum de pedidos

export async function deletePedido(id: string): Promise<void> {
  const pedidoIndex = mockPedidos.findIndex(p => p.id_pedido === id);
  if (pedidoIndex > -1) {
    mockPedidos.splice(pedidoIndex, 1);
  }
}

export async function updateDireccionPedido(id: string, id_direccion_destino: string): Promise<PedidoResponse> {
  return updatePedido(id, { id_direccion_destino });
}

function generateUUID(): string {
  const g: any = globalThis as any;
  if (typeof g.crypto?.randomUUID === 'function') {
    return g.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
