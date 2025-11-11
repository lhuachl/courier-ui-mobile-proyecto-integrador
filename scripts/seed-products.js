const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../DB.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Las variables de entorno de Supabase no están configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const productosPrueba = [
  {
    nombre: 'Laptop Dell Inspiron 15',
    descripcion: 'Laptop Dell Inspiron 15 con procesador Intel i5, 8GB RAM, 256GB SSD',
    cantidad: 10,
    precio_unitario: 899.99,
    peso: 2.1,
    dimensiones: '35.8 x 24.0 x 1.9 cm',
    categoria: 'Electrónicos'
  },
  {
    nombre: 'Smartphone Samsung Galaxy A54',
    descripcion: 'Smartphone Samsung Galaxy A54 5G con cámara de 50MP y pantalla de 6.4"',
    cantidad: 25,
    precio_unitario: 399.99,
    peso: 0.202,
    dimensiones: '15.8 x 7.6 x 0.8 cm',
    categoria: 'Electrónicos'
  },
  {
    nombre: 'Auriculares Sony WH-1000XM4',
    descripcion: 'Auriculares inalámbricos con cancelación de ruido líder en la industria',
    cantidad: 15,
    precio_unitario: 279.99,
    peso: 0.254,
    dimensiones: '27.0 x 20.0 x 7.0 cm',
    categoria: 'Accesorios'
  },
  {
    nombre: 'Tablet iPad Air',
    descripcion: 'Tablet iPad Air con chip M1, pantalla Liquid Retina de 10.9"',
    cantidad: 8,
    precio_unitario: 599.99,
    peso: 0.461,
    dimensiones: '24.76 x 17.85 x 0.61 cm',
    categoria: 'Electrónicos'
  },
  {
    nombre: 'Cargador Inalámbrico Belkin',
    descripcion: 'Cargador inalámbrico de 15W compatible con iPhone y Android',
    cantidad: 30,
    precio_unitario: 29.99,
    peso: 0.15,
    dimensiones: '10.0 x 10.0 x 1.0 cm',
    categoria: 'Accesorios'
  }
];

async function seedProducts() {
  try {
    console.log('Iniciando inserción de productos de prueba...');
    
    // Verificar si ya existen productos
    const { data: existingProducts, error: checkError } = await supabase
      .from('producto')
      .select('id_producto')
      .limit(1);
    
    if (checkError) {
      console.error('Error verificando productos existentes:', checkError);
      return;
    }
    
    if (existingProducts && existingProducts.length > 0) {
      console.log('Ya existen productos en la base de datos. Saltando inserción.');
      return;
    }
    
    // Insertar productos de prueba
    const { data, error } = await supabase
      .from('producto')
      .insert(productosPrueba)
      .select();
    
    if (error) {
      console.error('Error insertando productos:', error);
      return;
    }
    
    console.log(`✅ Se insertaron ${data.length} productos de prueba exitosamente`);
    console.log('Productos insertados:');
    data.forEach((producto, index) => {
      console.log(`${index + 1}. ${producto.nombre} - $${producto.precio_unitario}`);
    });
    
  } catch (err) {
    console.error('Error general:', err);
  }
}

seedProducts();

