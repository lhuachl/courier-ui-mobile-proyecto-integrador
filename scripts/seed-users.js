const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../DB.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Las variables de entorno de Supabase no están configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const usuariosPrueba = [
  {
    email: 'maria.lopez@example.com',
    password_hash: 'hash123', // En producción esto debería ser un hash real
    nombre: 'María',
    apellido: 'López',
    rol: 'Cliente',
    estado: 'Activo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    email: 'carlos.ramos@example.com',
    password_hash: 'hash456', // En producción esto debería ser un hash real
    nombre: 'Carlos',
    apellido: 'Ramos',
    rol: 'Transportista',
    estado: 'Activo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function seedUsers() {
  try {
    console.log('Iniciando inserción de usuarios de prueba...');
    
    // Verificar si ya existen usuarios
    const { data: existingUsers, error: checkError } = await supabase
      .from('usuarios')
      .select('id_usuario, email')
      .in('email', usuariosPrueba.map(u => u.email));
    
    if (checkError) {
      console.error('Error verificando usuarios existentes:', checkError);
      return;
    }
    
    if (existingUsers && existingUsers.length > 0) {
      console.log('Los usuarios de prueba ya existen:');
      existingUsers.forEach(user => {
        console.log(`  - ${user.email} (ID: ${user.id_usuario})`);
      });
      return;
    }
    
    // Insertar usuarios de prueba
    const { data, error } = await supabase
      .from('usuarios')
      .insert(usuariosPrueba)
      .select();
    
    if (error) {
      console.error('Error insertando usuarios:', error);
      return;
    }
    
    console.log(`✅ Se insertaron ${data.length} usuarios de prueba exitosamente`);
    console.log('Usuarios insertados:');
    data.forEach((usuario, index) => {
      console.log(`${index + 1}. ${usuario.nombre} ${usuario.apellido} (${usuario.email}) - ${usuario.rol}`);
    });
    
    // Crear registros en las tablas relacionadas
    await createClientRecords(data);
    
  } catch (err) {
    console.error('Error general:', err);
  }
}

async function createClientRecords(usuarios) {
  try {
    console.log('\nCreando registros de cliente y transportista...');
    
    for (const usuario of usuarios) {
      if (usuario.rol === 'Cliente') {
        // Crear registro en la tabla clientes
        const { data: cliente, error: clienteError } = await supabase
          .from('clientes')
          .insert({
            id_usuario: usuario.id_usuario,
            tipo: 'individual',
            documento_identidad: `DNI-${usuario.id_usuario}`,
            telefono: '+1234567890',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();
        
        if (clienteError) {
          console.error(`Error creando cliente para ${usuario.email}:`, clienteError);
        } else {
          console.log(`✅ Cliente creado para ${usuario.nombre} ${usuario.apellido}`);
        }
        
        // Crear una dirección de ejemplo para el cliente
        if (cliente && cliente[0]) {
          const { error: direccionError } = await supabase
            .from('direcciones')
            .insert({
              id_cliente: cliente[0].id_cliente,
              calle: 'Calle Principal 123',
              numero: '123',
              ciudad: 'Ciudad Ejemplo',
              codigo_postal: '12345',
              latitud: 40.7128,
              longitud: -74.0060,
              tipo: 'residencia',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (direccionError) {
            console.error(`Error creando dirección para ${usuario.email}:`, direccionError);
          } else {
            console.log(`✅ Dirección creada para ${usuario.nombre} ${usuario.apellido}`);
          }
        }
        
      } else if (usuario.rol === 'Transportista') {
        // Crear registro en la tabla transportistas
        const { data: transportista, error: transportistaError } = await supabase
          .from('transportistas')
          .insert({
            id_usuario: usuario.id_usuario,
            tipo_vehiculo: 'furgoneta',
            placa_vehiculo: `ABC-${usuario.id_usuario}`,
            capacidad_carga: 1000.0,
            estado: 'disponible',
            zona_asignada: 1, // Asumiendo que existe zona con ID 1
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();
        
        if (transportistaError) {
          console.error(`Error creando transportista para ${usuario.email}:`, transportistaError);
        } else {
          console.log(`✅ Transportista creado para ${usuario.nombre} ${usuario.apellido}`);
        }
      }
    }
    
  } catch (err) {
    console.error('Error creando registros relacionados:', err);
  }
}

seedUsers();

