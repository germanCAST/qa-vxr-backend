const pool = require("../config/db");

/**
 * @swagger
 * /proyectos:
 *   get:
 *     summary: Obtiene todos los proyectos.
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Lista de proyectos obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID del proyecto.
 *                   proyecto_nombre:
 *                     type: string
 *                     description: Nombre del proyecto.
 *                   proyecto_descripcion:
 *                     type: string
 *                     description: Descripción del proyecto.
 *                   fecha_inicio:
 *                     type: string
 *                     format: date
 *                     description: Fecha de inicio del proyecto.
 *                   fecha_fin:
 *                     type: string
 *                     format: date
 *                     description: Fecha de fin del proyecto.
 *                   estado:
 *                     type: string
 *                     description: Estado del proyecto.
 *                   creado_por:
 *                     type: string
 *                     description: Nombre del creador del proyecto.
 */
const obtenerProyectos = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id, 
        p.nombre as proyecto_nombre, 
        p.descripcion as proyecto_descripcion, 
        p.fecha_inicio, 
        p.fecha_fin, 
        p.estado, 
        u.id as creado_por_id,
        CONCAT(u.nombre, ' ', u.apellido) AS creado_por 
      FROM 
        public.proyectos p
      JOIN 
        public.usuarios u 
      ON 
        p.creado_por = u.id
      ORDER BY 
      p.id DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /proyectos/{id}:
 *   put:
 *     summary: Actualiza un proyecto existente.
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proyecto_nombre:
 *                 type: string
 *                 description: Nombre del proyecto.
 *               proyecto_descripcion:
 *                 type: string
 *                 description: Descripción del proyecto.
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del proyecto.
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del proyecto.
 *               estado:
 *                 type: string
 *                 description: Estado del proyecto.
 *               creado_por:
 *                 type: integer
 *                 description: ID del usuario que crea el proyecto.
 *     responses:
 *       200:
 *         description: Proyecto actualizado con éxito.
 */
const updateProyecto = async (req, res, next) => {
  const {
    id,
    proyecto_nombre,
    proyecto_descripcion,
    fecha_inicio,
    fecha_fin,
    estado,
    creado_por_id,
    creado_por,
  } = req.body;
  const query = `
    UPDATE public.proyectos
    SET 
      nombre = $1,
      descripcion = $2,
      fecha_inicio = $3,
      fecha_fin = $4,
      estado = $5,
      creado_por = $6
    WHERE 
      id = $7;
  `;
  console.log("creado por", creado_por);
  const values = [
    proyecto_nombre,
    proyecto_descripcion,
    fecha_inicio,
    fecha_fin,
    estado,
    parseInt(creado_por, 10),
    id,
  ];

  try {
    const result = await pool.query(query, values);
    if (result) {
      res.status(200).json({ message: " Proyecto actualizado con éxito" });
    }
    console.log("Proyecto actualizado con éxito", result);
  } catch (error) {
    console.error("Error actualizando el proyecto:", error);
  }
};

/**
 * @swagger
 * /proyectos/count:
 *   get:
 *     summary: Cuenta el total de proyectos.
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Total de proyectos calculado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de proyectos.
 */
const contarProyectos = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM public.proyectos");
    const count = result.rows[0].count;
    res.status(200).json({ total: parseInt(count, 10) });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /proyectos/{id}:
 *   delete:
 *     summary: Elimina un proyecto por ID.
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto a eliminar.
 *     responses:
 *       200:
 *         description: Proyecto eliminado con éxito.
 *       400:
 *         description: Proyecto no encontrado.
 */
const eliminarProyecto = async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "El ID del proyecto es requerido" });
  }

  const query = `
  DELETE FROM public.proyectos
  WHERE id =$1
  RETURNING *;
  `;

  try {
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(400).json({ error: "Proyecto no encontrado" });
    }
    res
      .status(200)
      .json({ error: "Proyecto encontrado y eliminado con exito" });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /proyectos:
 *   post:
 *     summary: Crea un nuevo proyecto.
 *     tags: [Proyectos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proyecto_nombre:
 *                 type: string
 *                 description: Nombre del proyecto.
 *               proyecto_descripcion:
 *                 type: string
 *                 description: Descripción del proyecto.
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del proyecto.
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del proyecto.
 *               estado:
 *                 type: string
 *                 description: Estado del proyecto.
 *               creado_por:
 *                 type: integer
 *                 description: ID del usuario que crea el proyecto.
 *     responses:
 *       201:
 *         description: Proyecto creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación.
 *                 proyecto:
 *                   type: object
 *                   description: Proyecto creado.
 */
const crearProyecto = async (req, res, next) => {
  const {
    proyecto_nombre,
    proyecto_descripcion,
    fecha_inicio,
    fecha_fin,
    estado,
    creado_por,
  } = req.body;

  if (
    !proyecto_nombre ||
    !proyecto_descripcion ||
    !fecha_inicio ||
    !fecha_fin ||
    !estado ||
    !creado_por
  ) {
    return res.status(200).json({ error: "Todos los campos son obligatorios" });
  }

  const query = `
    INSERT INTO public.proyectos (nombre, descripcion, fecha_inicio, fecha_fin, estado, creado_por)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    proyecto_nombre,
    proyecto_descripcion,
    fecha_inicio,
    fecha_fin,
    estado,
    creado_por,
  ];

  try {
    // Ejecutar la consulta para crear el proyecto
    const result = await pool.query(query, values);

    // Devolver el proyecto creado
    res
      .status(201)
      .json({ message: "Proyecto creado con éxito", proyecto: result.rows[0] });
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    next(error); // Pasar el error al middleware de manejo de errores
  }
};

module.exports = {
  obtenerProyectos,
  contarProyectos,
  updateProyecto,
  eliminarProyecto,
  crearProyecto,
};

/**
 * @swagger
 * tags:
 *   name: Proyectos
 *   description: API para la gestión de proyectos.
 */
