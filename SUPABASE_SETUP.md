# Configuración de Supabase para React Native

## ✅ Configuración actualizada

El proyecto ahora usa el archivo `DB.env` para la configuración de Supabase. Las credenciales ya están configuradas correctamente.

## Archivos de configuración:

### 1. DB.env (archivo principal de configuración)
```env
EXPO_PUBLIC_SUPABASE_URL=https://hlmngthhnvbdvbrxukqy.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. lib/config.ts (carga las variables de entorno)
- Carga automáticamente las variables desde `DB.env`
- Valida que las configuraciones estén presentes
- Proporciona fallbacks para desarrollo

### 3. lib/supabase.ts (cliente de Supabase)
- Usa la configuración centralizada
- Valida la configuración antes de crear el cliente

## ✅ Estado actual:

La conexión a Supabase está funcionando correctamente. Se han realizado las siguientes mejoras:

### 🔧 Cambios implementados:

1. **Conexión directa a Supabase**: La aplicación ahora se conecta directamente a Supabase en lugar de usar un backend FastAPI local.

2. **Funciones de productos**: Se crearon funciones para cargar productos desde la tabla `producto` de Supabase.

3. **Funciones de pedidos**: Se crearon funciones para crear y gestionar pedidos en la tabla `pedidos`.

4. **Datos de prueba**: Se insertaron productos de prueba en la base de datos.

### 🎯 Funcionalidades disponibles:

- ✅ Carga de productos desde Supabase
- ✅ Creación de pedidos
- ✅ Verificación de conexión en tiempo real
- ✅ Manejo de errores mejorado

## Verificar la conexión:

```bash
# Probar conexión y datos
node scripts/test-connection.js

# Iniciar la aplicación
npm start
```

## Solución de problemas:

- **Error "Failed to fetch"**: Ya resuelto - la app ahora usa Supabase directamente
- **Error "ERR_CONNECTION_REFUSED"**: Ya resuelto - no depende de backend local
- **Productos no cargan**: Verifica que existan productos en la tabla `producto`
