const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../DB.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Las variables de entorno de Supabase no están configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a Supabase...');
    console.log('URL:', supabaseUrl);
    console.log('Key length:', supabaseKey.length);
    
    // Probar conexión básica
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('❌ Error de autenticación:', sessionError);
      return;
    }
    console.log('✅ Conexión de autenticación exitosa');
    
    // Probar consulta a la tabla de productos
    const { data: products, error: productsError } = await supabase
      .from('producto')
      .select('id_producto, nombre, precio_unitario, cantidad')
      .limit(5);
    
    if (productsError) {
      console.error('❌ Error consultando productos:', productsError);
      return;
    }
    
    console.log(`✅ Consulta de productos exitosa. Encontrados ${products.length} productos:`);
    products.forEach((producto, index) => {
      console.log(`  ${index + 1}. ${producto.nombre} - $${producto.precio_unitario} (Stock: ${producto.cantidad})`);
    });
    
    // Probar consulta a la tabla de usuarios
    const { data: users, error: usersError } = await supabase
      .from('usuarios')
      .select('id_usuario, email, nombre')
      .limit(3);
    
    if (usersError) {
      console.error('❌ Error consultando usuarios:', usersError);
      return;
    }
    
    console.log(`✅ Consulta de usuarios exitosa. Encontrados ${users.length} usuarios:`);
    users.forEach((usuario, index) => {
      console.log(`  ${index + 1}. ${usuario.nombre || 'Sin nombre'} (${usuario.email})`);
    });
    
    console.log('\n🎉 ¡Todas las pruebas de conexión pasaron exitosamente!');
    
  } catch (err) {
    console.error('❌ Error general:', err);
  }
}

testConnection();

