import { mockPedidos } from './mock-data';
import { PedidoResponse, PedidoCreate } from './types';

export async function createPedido(pedido: PedidoCreate): Promise<PedidoResponse> {
  const newPedido: PedidoResponse = {
    id_pedido: Math.max(...mockPedidos.map(p => p.id_pedido)) + 1,
    numero_tracking: `TRACK${Math.random().toString(36).substring(2, 9)}`,
    ...pedido,
    fecha_solicitud: new Date().toISOString(),
    estado: pedido.estado || 'pendiente',
    prioridad: pedido.prioridad || 'normal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockPedidos.push(newPedido);
  return newPedido;
}

export async function loadPedidos(): Promise<PedidoResponse[]> {
  return [...mockPedidos];
}

export async function loadPedidoById(id: number): Promise<PedidoResponse | null> {
  return mockPedidos.find(p => p.id_pedido === id) || null;
}

export async function loadPedidoByTracking(tracking: string): Promise<PedidoResponse | null> {
  return mockPedidos.find(p => p.numero_tracking === tracking) || null;
}

export async function updatePedido(id: number, updates: Partial<PedidoCreate>): Promise<PedidoResponse> {
  const pedidoIndex = mockPedidos.findIndex(p => p.id_pedido === id);
  if (pedidoIndex === -1) {
    throw new Error('Pedido not found');
  }
  const updatedPedido = { ...mockPedidos[pedidoIndex], ...updates, updated_at: new Date().toISOString() };
  mockPedidos[pedidoIndex] = updatedPedido;
  return updatedPedido;
}

export async function loadPedidosByCliente(clienteId: number): Promise<PedidoResponse[]> {
  return mockPedidos.filter(p => p.id_cliente === clienteId);
}

export async function cancelarPedido(id: number): Promise<PedidoResponse> {
  return updatePedido(id, { estado: 'cancelado' });
}

export async function pagarPedido(id: number): Promise<PedidoResponse> {
  return updatePedido(id, { estado: 'pagado' });
}

export async function deletePedido(id: number): Promise<void> {
  const pedidoIndex = mockPedidos.findIndex(p => p.id_pedido === id);
  if (pedidoIndex > -1) {
    mockPedidos.splice(pedidoIndex, 1);
  }
}

export async function updateDireccionPedido(id: number, direccion_destino: number): Promise<PedidoResponse> {
  return updatePedido(id, { direccion_destino });
}
