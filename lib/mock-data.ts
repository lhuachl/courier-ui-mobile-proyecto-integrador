
import { User, PedidoResponse, Product, TrackingPoint } from './types';

const U = {
  user1: '00000000-0000-0000-0000-000000000001',
  user2: '00000000-0000-0000-0000-000000000002',
  perfil1: '10000000-0000-0000-0000-000000000001',
  transportista1: '20000000-0000-0000-0000-000000000001',
  dir1: '30000000-0000-0000-0000-000000000001',
  dir2: '30000000-0000-0000-0000-000000000002',
  pedido1: '40000000-0000-0000-0000-000000000001',
  pedido2: '40000000-0000-0000-0000-000000000002',
};

export const mockUsers: User[] = [
  { id: U.user1, email: 'cliente@example.com', nombre: 'Juan', apellido: 'Perez', rol: 'cliente' },
  { id: U.user2, email: 'transportista@example.com', nombre: 'Maria', apellido: 'Gomez', rol: 'transportista' },
];

export const mockProducts: Product[] = [
  { id: 1, nombre: 'Laptop', descripcion: 'Laptop de última generación', precio: 1500, cantidad: 10, categoria: 'Electrónica' },
  { id: 2, nombre: 'Smartphone', descripcion: 'Smartphone con cámara de alta resolución', precio: 800, cantidad: 25, categoria: 'Electrónica' },
  { id: 3, nombre: 'Auriculares', descripcion: 'Auriculares con cancelación de ruido', precio: 200, cantidad: 50, categoria: 'Accesorios' },
];

export const mockPedidos: PedidoResponse[] = [
  {
    id_pedido: U.pedido1,
    numero_tracking: 'TRK-1234ABCD',
    id_perfil: U.perfil1,
    id_transportista: U.transportista1,
    id_direccion_origen: U.dir1,
    id_direccion_destino: U.dir2,
    estado: 'en_ruta',
    monto_total: 1500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id_pedido: U.pedido2,
    numero_tracking: 'TRK-4567EFGH',
    id_perfil: U.perfil1,
    id_transportista: U.transportista1,
    id_direccion_origen: U.dir1,
    id_direccion_destino: U.dir2,
    estado: 'entregado',
    monto_total: 800,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockTrackingPoints: TrackingPoint[] = [
  {
    id_tracking: 1,
    id_pedido: U.pedido1,
    fecha_hora: new Date().toISOString(),
    latitud: -19.0459,
    longitud: -65.2561,
    estado: 'en_ruta',
    comentario: 'El paquete está en camino',
    created_at: new Date().toISOString(),
  },
  {
    id_tracking: 2,
    id_pedido: U.pedido1,
    fecha_hora: new Date(Date.now() - 3600 * 1000).toISOString(),
    latitud: -19.0459,
    longitud: -65.2561,
    estado: 'preparando',
    comentario: 'El paquete está siendo preparado',
    created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
];
