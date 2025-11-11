//crud de productos de supabase
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const supabaseUrl = Db.Expo_PUBLIC_SUPABASE_URL;
const supabaseKey = Db.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
// Crear un nuevo pedido
    