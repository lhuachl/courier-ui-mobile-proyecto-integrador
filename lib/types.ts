export type Role = 'admin' | 'cliente' | 'transportista' | 'operador';

export type PedidoEstado = 'pendiente' | 'procesando' | 'en_ruta' | 'entregado' | 'cancelado' | 'pagado';
export type PedidoPrioridad = 'normal' | 'alta' | 'urgente';

export interface User {
  id_usuario: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  estado: string;
}

export interface PedidoCreate {
  id_cliente: number;
  direccion_origen: number;
  direccion_destino: number;
  estado?: PedidoEstado;
  prioridad?: PedidoPrioridad;
  peso?: number;
  dimensiones?: string;
  monto_total: number;
  id_transportista?: number;
}

export interface PedidoResponse {
  id_pedido: number;
  numero_tracking: string;
  id_cliente: number;
  fecha_solicitud: string;
  fecha_entrega_estimada?: string;
  fecha_entrega_real?: string;
  direccion_origen: number;
  direccion_destino: number;
  estado: PedidoEstado;
  prioridad: PedidoPrioridad;
  peso?: number;
  dimensiones?: string;
  monto_total: number;
  id_transportista?: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  sku?: string;
  cantidad: number;
  peso?: number;
  dimensiones?: string;
  categoria?: string;
  image_url?: string;
}

export interface TrackingPoint {
  id_tracking: number;
  id_pedido: number;
  id_transportista?: number;
  fecha_hora: string;
  latitud: number;
  longitud: number;
  estado: string;
  comentario?: string;
  created_at: string;
}
