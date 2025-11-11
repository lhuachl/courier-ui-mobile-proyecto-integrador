const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../DB.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Las variables de entorno de Supabase no están configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTracking() {
  try {
    console.log('🗺️ Probando sistema de tracking...');
    
    // Verificar si hay pedidos existentes
    const { data: pedidos, error: pedidosError } = await supabase
      .from('pedidos')
      .select('id_pedido, numero_tracking, estado')
      .limit(5);
    
    if (pedidosError) {
      console.error('❌ Error consultando pedidos:', pedidosError);
      return;
    }
    
    console.log(`✅ Encontrados ${pedidos.length} pedidos:`);
    pedidos.forEach(pedido => {
      console.log(`  - Pedido #${pedido.id_pedido} (${pedido.numero_tracking}) - ${pedido.estado}`);
    });
    
    // Verificar puntos de tracking existentes
    const { data: trackingPoints, error: trackingError } = await supabase
      .from('tracking')
      .select('id_tracking, id_pedido, estado, latitud, longitud, fecha_hora')
      .limit(10);
    
    if (trackingError) {
      console.error('❌ Error consultando tracking:', trackingError);
    } else {
      console.log(`✅ Encontrados ${trackingPoints.length} puntos de tracking:`);
      trackingPoints.forEach(point => {
        console.log(`  - Pedido #${point.id_pedido}: ${point.estado} (${point.latitud}, ${point.longitud})`);
      });
    }
    
    // Crear un pedido de prueba si no hay ninguno
    if (pedidos.length === 0) {
      console.log('\n📦 Creando pedido de prueba...');
      const { data: nuevoPedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          numero_tracking: `TRK-${Date.now()}`,
          id_cliente: 9, // ID del cliente María López
          direccion_origen: 1,
          direccion_destino: 2,
          estado: 'pendiente',
          prioridad: 'normal',
          peso: 1.0,
          monto_total: 99.99,
          fecha_solicitud: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (pedidoError) {
        console.error('❌ Error creando pedido de prueba:', pedidoError);
      } else {
        console.log(`✅ Pedido de prueba creado: #${nuevoPedido.id_pedido} (${nuevoPedido.numero_tracking})`);
        
        // Crear puntos de tracking de prueba
        console.log('📍 Creando puntos de tracking de prueba...');
        const testPoints = [
          {
            id_pedido: nuevoPedido.id_pedido,
            latitud: -16.5000,
            longitud: -68.1500,
            estado: 'preparando',
            comentario: 'Pedido preparándose en el almacén'
          },
          {
            id_pedido: nuevoPedido.id_pedido,
            latitud: -16.4900,
            longitud: -68.1400,
            estado: 'en_ruta',
            comentario: 'En camino al destino'
          },
          {
            id_pedido: nuevoPedido.id_pedido,
            latitud: -16.4800,
            longitud: -68.1300,
            estado: 'en_ruta',
            comentario: 'Cerca del destino'
          },
          {
            id_pedido: nuevoPedido.id_pedido,
            latitud: -16.4700,
            longitud: -68.1200,
            estado: 'entregado',
            comentario: 'Pedido entregado exitosamente'
          }
        ];
        
        for (const point of testPoints) {
          const { error: trackingPointError } = await supabase
            .from('tracking')
            .insert({
              ...point,
              fecha_hora: new Date().toISOString(),
              created_at: new Date().toISOString(),
            });
          
          if (trackingPointError) {
            console.error('❌ Error creando punto de tracking:', trackingPointError);
          } else {
            console.log(`  ✅ Punto creado: ${point.estado} (${point.latitud}, ${point.longitud})`);
          }
        }
      }
    }
    
    console.log('\n🎉 ¡Sistema de tracking configurado correctamente!');
    console.log('\n📱 Para probar en la app:');
    console.log('  1. Ve a "Rastrear pedidos"');
    console.log('  2. Ingresa un número de tracking existente');
    console.log('  3. Verás el mapa con la ubicación del pedido');
    console.log('  4. Ve a "Modificar pedidos" para cambiar estados');
    
  } catch (err) {
    console.error('❌ Error general:', err);
  }
}

testTracking();

