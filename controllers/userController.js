const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const query = `
    SELECT id, 
    nombre as name, 
    apellido as lastname,
    correo_electronico as email,
    rol as type
    FROM public.usuarios
     WHERE correo_electronico = $1 AND contrasena = $2
    `;
    const result = await pool.query(query, [email, password]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const token = jwt.sign({ userId: user.id }, "secretKey");
      res.status(200).json({
        user,
        token,
      });
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (err) {
    next(err);
  }
};

const contarUsuarios = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM public.usuarios");
    const count = result.rows[0].count;
    res.status(200).json({ total: parseInt(count, 10) });
  } catch (error) {
    next(err);
  }
};

const getAllUsuarios = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre as name, apellido as lastname FROM public.usuarios"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};
const getCompleteAllUsuarios = async (req, res, next) => {
  try {
    // Extrae el token desde el cuerpo de la solicitud
    const { token } = req.body;

    // Verifica el token
    const decodedToken = jwt.verify(token, "secretKey");
    if (!decodedToken) {
      throw new Error("Invalid token");
    }

    // Consulta a la base de datos
    const result = await pool.query("SELECT * FROM public.usuarios");

    // Responde con los datos y el token decodificado
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

const updateUsuario = async (req, res, next) => {
  const {
    id,
    nombre_usuario,
    nombre,
    apellido,
    correo_electronico,
    contrasena,
    rol,
    fecha_creacion,
  } = req.body;

  console.log("fecha creacion", fecha_creacion);

  try {
    const query = `
      UPDATE public.usuarios
      SET nombre = $1, apellido = $2, 
      correo_electronico = $3, contrasena = $4, 
      rol = $5, nombre_usuario = $6
      WHERE id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [
      nombre,
      apellido,
      correo_electronico,
      contrasena,
      rol,
      nombre_usuario,
      id,
    ]);

    if (result.rows.length > 0) {
      res.status(200).json({ message: "Usuario actualizado con éxito" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.body;

  try {
    const query = `
      DELETE FROM public.usuarios
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length > 0) {
      res.status(200).json({ message: "Usuario eliminado con éxito" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const {
    id,
    nombre,
    apellido,
    correo_electronico,
    contrasena,
    rol,
    fecha_creacion,
    nombre_usuario,
  } = req.body;

  idParse = parseInt(id, 10);
  console.log("id", idParse);

  try {
    const query = `
      INSERT INTO public.usuarios (
      nombre_usuario,
      nombre, apellido, 
      correo_electronico, 
      contrasena, rol, 
      fecha_creacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const result = await pool.query(query, [
      nombre_usuario,
      nombre,
      apellido,
      correo_electronico,
      contrasena,
      rol,
      fecha_creacion,
    ]);

    res.status(200).json({ message: "Usuario creado con éxito" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  contarUsuarios,
  getAllUsuarios,
  getCompleteAllUsuarios,
  updateUsuario,
  deleteUser,
  createUser,
};
