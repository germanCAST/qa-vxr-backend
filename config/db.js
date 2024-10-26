// backend/db.js
const { Pool } = require('pg');

// Configurar la conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: 'postgres',           // Cambia por tu nombre de usuario de PostgreSQL
  host: 'localhost',            // Cambia por la IP o dominio de tu servidor de base de datos
  database: 'gestion_pruebas', // Nombre de tu base de datos
  password: 'P0stgr3',    // Contraseña de tu usuario de PostgreSQL
  port: 5432                    // Puerto de PostgreSQL, generalmente 5432
});

// Exportar el pool de conexiones para usarlo en otros módulos
module.exports = pool;
