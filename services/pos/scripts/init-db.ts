import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env del servicio
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  // Solo usar SSL si NO es localhost
  ssl: (process.env.POSTGRES_URL || process.env.DATABASE_URL)?.includes('localhost') ? undefined : { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log('🔌 Conectando a la base de datos...');
    const client = await pool.connect();
    console.log('✅ Conexión exitosa.');

    try {
      // 1. Leer y ejecutar esquema inicial
      console.log('📄 Leyendo esquema_inicial.sql...');
      const esquemaPath = path.resolve(__dirname, '../../../db/esquema_inicial.sql');
      const esquemaSql = fs.readFileSync(esquemaPath, 'utf8');
      
      console.log('🚀 Ejecutando esquema inicial...');
      await client.query(esquemaSql);
      console.log('✅ Tablas creadas.');

      // 2. Leer y ejecutar funciones
      console.log('📄 Leyendo funciones.sql...');
      const funcionesPath = path.resolve(__dirname, '../../../db/funciones.sql');
      const funcionesSql = fs.readFileSync(funcionesPath, 'utf8');

      console.log('🚀 Ejecutando funciones almacenadas...');
      await client.query(funcionesSql);
      console.log('✅ Funciones creadas.');

      // 3. Insertar datos de prueba (Seed)
      console.log('🌱 Insertando datos de prueba...');
      
      // Roles
      await client.query(`
        INSERT INTO roles (name) VALUES ('ADMIN'), ('CAJERO') 
        ON CONFLICT (name) DO NOTHING;
      `);

      // Cliente Default
      await client.query(`
        INSERT INTO clientes (nombre, email, telefono) 
        VALUES ('Consumidor Final', 'consumidor@final.com', '0000000000')
        ON CONFLICT (email) DO NOTHING;
      `);

      // Usuario Admin (Password: admin123)
      // Hash generado con bcrypt para 'admin123'
      const passwordHash = '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa'; 

      await client.query(`
        INSERT INTO usuarios (email, password, nombre, role_id, client_id)
        VALUES 
        ('cajero@pos.com', $1, 'Cajero 1', (SELECT id FROM roles WHERE name = 'CAJERO'), NULL),
        ('admin@pos.com', $1, 'Admin', (SELECT id FROM roles WHERE name = 'ADMIN'), NULL)
        ON CONFLICT (email) DO NOTHING;
      `, [passwordHash]);

      // Productos
      await client.query(`
        INSERT INTO productos (nombre, sku, codigo_barras, precio_venta, stock_actual) VALUES
        ('Coca Cola 600ml', 'COCA600', '7790001', 1500.00, 100),
        ('Papas Fritas Lays', 'LAYS100', '7790002', 2500.00, 50),
        ('Agua Mineral 500ml', 'AGUA500', '7790003', 1000.00, 200)
        ON CONFLICT (sku) DO NOTHING;
      `);

      console.log('✅ Datos de prueba insertados correctamente.');

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

run();
