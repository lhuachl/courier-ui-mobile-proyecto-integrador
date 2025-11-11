export type Role = 'admin' | 'cliente' | 'transportista' | 'operador';

// Estados alineados con Supabase (estado_pedido): ajusta si tu enum difiere
export type PedidoEstado = 'pendiente' | 'procesando' | 'en_ruta' | 'entregado' | 'cancelado';

// Usuario según tabla public.users (id uuid, rol enum, nombre/apellido)
export interface User {
  id: string; // uuid
  email?: string; // opcional: suele venir de auth.users
  nombre?: string;
  apellido?: string;
  rol: Role;
  foto_perfil?: string;
  created_at?: string;
  updated_at?: string;
}

// Pedido create según public.pedidos
export interface PedidoCreate {
  id_perfil: string; // uuid de perfiles_cliente
  id_direccion_origen: string; // uuid de direcciones
  id_direccion_destino: string; // uuid de direcciones
  estado?: PedidoEstado;
  fecha_entrega_estimada?: string;
  monto_total: number;
  id_transportista?: string; // uuid de transportistas
  Ubicacion?: string;
}

// Pedido response (lo que se muestra en la app)
export interface PedidoResponse {
  id_pedido: string; // uuid
  numero_tracking: string;
  id_perfil: string; // uuid
  id_transportista?: string; // uuid
  id_direccion_origen: string; // uuid
  id_direccion_destino: string; // uuid
  estado: PedidoEstado;
  fecha_entrega_estimada?: string;
  fecha_entrega_real?: string;
  monto_total: number;
  created_at: string;
  updated_at: string;
  Ubicacion?: string;
}

// Productos permanecen igual (mock)
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

// Tracking (no está en DbContexto, mantenemos mock pero referenciando uuid)
export interface TrackingPoint {
  id_tracking: number;
  id_pedido: string; // uuid
  id_transportista?: string; // uuid
  fecha_hora: string;
  latitud: number;
  longitud: number;
  estado: string;
  comentario?: string;
  created_at: string;
}
