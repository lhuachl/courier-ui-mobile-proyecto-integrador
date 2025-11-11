
import { User } from './auth';
import { PedidoResponse } from './pedidos';
import { Product } from './products';
import { TrackingPoint } from './tracking';

export const mockUsers: User[] = [
  { id_usuario: 1, email: 'cliente@example.com', nombre: 'Juan', apellido: 'Perez', rol: 'cliente', estado: 'activo' },
  { id_usuario: 2, email: 'transportista@example.com', nombre: 'Maria', apellido: 'Gomez', rol: 'transportista', estado: 'activo' },
];

export const mockProducts: Product[] = [
  { id: 1, nombre: 'Laptop', descripcion: 'Laptop de última generación', precio: 1500, cantidad: 10, categoria: 'Electrónica' },
  { id: 2, nombre: 'Smartphone', descripcion: 'Smartphone con cámara de alta resolución', precio: 800, cantidad: 25, categoria: 'Electrónica' },
  { id: 3, nombre: 'Auriculares', descripcion: 'Auriculares con cancelación de ruido', precio: 200, cantidad: 50, categoria: 'Accesorios' },
];

export const mockPedidos: PedidoResponse[] = [
  {
    id_pedido: 1,
    numero_tracking: 'TRACK123',
    id_cliente: 1,
    fecha_solicitud: new Date().toISOString(),
    estado: 'en_ruta',
    prioridad: 'alta',
    monto_total: 1500,
    direccion_origen: 1,
    direccion_destino: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id_pedido: 2,
    numero_tracking: 'TRACK456',
    id_cliente: 1,
    fecha_solicitud: new Date().toISOString(),
    estado: 'entregado',
    prioridad: 'normal',
    monto_total: 800,
    direccion_origen: 1,
    direccion_destino: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockTrackingPoints: TrackingPoint[] = [
  {
    id_tracking: 1,
    id_pedido: 1,
    fecha_hora: new Date().toISOString(),
    latitud: -19.0459,
    longitud: -65.2561,
    estado: 'en_ruta',
    comentario: 'El paquete está en camino',
    created_at: new Date().toISOString(),
  },
  {
    id_tracking: 2,
    id_pedido: 1,
    fecha_hora: new Date(Date.now() - 3600 * 1000).toISOString(),
    latitud: -19.0459,
    longitud: -65.2561,
    estado: 'preparando',
    comentario: 'El paquete está siendo preparado',
    created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
];
