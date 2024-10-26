const { Pool } = require("pg");
require("dotenv").config();

// Configurar la conexión a la base de datos PostgreSQL usando variables de entorno
const pool = new Pool({
  user: process.env.PGUSER, // Usuario de PostgreSQL (Railway variable)
  host: process.env.PGHOST, // Host de la base de datos (Railway variable)
  database: process.env.PGDATABASE, // Nombre de la base de datos (Railway variable)
  password: process.env.PGPASSWORD, // Contraseña del usuario de PostgreSQL (Railway variable)
  port: process.env.PGPORT, // Puerto de PostgreSQL (Railway variable, usualmente 5432)
});

// Exportar el pool de conexiones para usarlo en otros módulos
module.exports = pool;
