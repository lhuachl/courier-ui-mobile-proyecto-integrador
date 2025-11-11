const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../DB.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Las variables de entorno de Supabase no están configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  try {
    console.log('🔐 Probando sistema de autenticación...');
    
    // Verificar usuarios de prueba
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .in('email', ['maria.lopez@example.com', 'carlos.ramos@example.com']);
    
    if (usuariosError) {
      console.error('❌ Error consultando usuarios:', usuariosError);
      return;
    }
    
    console.log(`✅ Encontrados ${usuarios.length} usuarios de prueba:`);
    usuarios.forEach(usuario => {
      console.log(`  - ${usuario.nombre} ${usuario.apellido} (${usuario.email}) - ${usuario.rol}`);
    });
    
    // Verificar registros de cliente
    const { data: clientes, error: clientesError } = await supabase
      .from('clientes')
      .select('id_cliente, id_usuario, tipo')
      .in('id_usuario', usuarios.map(u => u.id_usuario));
    
    if (clientesError) {
      console.error('❌ Error consultando clientes:', clientesError);
    } else {
      console.log(`✅ Encontrados ${clientes.length} registros de cliente:`);
      clientes.forEach(cliente => {
        const usuario = usuarios.find(u => u.id_usuario === cliente.id_usuario);
        console.log(`  - ${usuario?.nombre} ${usuario?.apellido} (ID Cliente: ${cliente.id_cliente})`);
      });
    }
    
    // Verificar registros de transportista
    const { data: transportistas, error: transportistasError } = await supabase
      .from('transportistas')
      .select('id_transportista, id_usuario, tipo_vehiculo, estado')
      .in('id_usuario', usuarios.map(u => u.id_usuario));
    
    if (transportistasError) {
      console.error('❌ Error consultando transportistas:', transportistasError);
    } else {
      console.log(`✅ Encontrados ${transportistas.length} registros de transportista:`);
      transportistas.forEach(transportista => {
        const usuario = usuarios.find(u => u.id_usuario === transportista.id_usuario);
        console.log(`  - ${usuario?.nombre} ${usuario?.apellido} (ID Transportista: ${transportista.id_transportista}) - ${transportista.tipo_vehiculo}`);
      });
    }
    
    // Verificar direcciones de clientes
    if (clientes && clientes.length > 0) {
      const { data: direcciones, error: direccionesError } = await supabase
        .from('direcciones')
        .select('id_direccion, id_cliente, calle, ciudad')
        .in('id_cliente', clientes.map(c => c.id_cliente));
      
      if (direccionesError) {
        console.error('❌ Error consultando direcciones:', direccionesError);
      } else {
        console.log(`✅ Encontradas ${direcciones.length} direcciones:`);
        direcciones.forEach(direccion => {
          const cliente = clientes.find(c => c.id_cliente === direccion.id_cliente);
          const usuario = usuarios.find(u => u.id_usuario === cliente?.id_usuario);
          console.log(`  - ${usuario?.nombre} ${usuario?.apellido}: ${direccion.calle}, ${direccion.ciudad}`);
        });
      }
    }
    
    console.log('\n🎉 ¡Sistema de autenticación configurado correctamente!');
    console.log('\n📱 Para probar en la app:');
    console.log('  - Click en "Entrar como Usuario" → María López (Cliente)');
    console.log('  - Click en "Entrar como Transportista" → Carlos Ramos (Transportista)');
    
  } catch (err) {
    console.error('❌ Error general:', err);
  }
}

testAuth();

