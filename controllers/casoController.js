const pool = require("../config/db");

const contarCasos = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM public.casos_uso");
    const count = result.rows[0].count;
    res.status(200).json({ total_casos: parseInt(count, 10) });
  } catch (error) {
    next(err);
  }
};

const casosUsoById = async (req, res, next) => {
  const proyectoId = req.params.id;

  if (!proyectoId) {
    return res
      .status(400)
      .json({ error: "El ID del proyecto es requerido", data: null });
  }

  try {
    const query = `
    SELECT 
          p.id AS proyecto_id, 
          p.nombre AS proyecto_nombre, 
          p.estado AS proyecto_estado, 
          cu.id,
          cu.titulo,
          cu.descripcion,
          cp.id AS caso_prueba_id,
          cp.titulo AS caso_prueba_titulo,
          cp.descripcion AS caso_prueba_descripcion,
          cp.estado AS caso_prueba_estado,
          d.id AS defecto_id,
          d.descripcion AS defecto_descripcion,
          d.estado AS defecto_estado,
          d.prioridad AS defecto_prioridad
      FROM 
          public.proyectos p
      JOIN 
          public.usuarios u ON p.creado_por = u.id
      LEFT JOIN 
          public.casos_uso cu ON cu.id_proyecto = p.id
      LEFT JOIN 
          public.casos_prueba cp ON cp.id_caso_uso = cu.id
      LEFT JOIN 
          public.defectos d ON d.id_caso_prueba = cp.id
      WHERE 
          p.id = $1
      ORDER BY 
          p.id, cu.id, cp.id, d.id;
    `;

    const result = await pool.query(query, [proyectoId]);

    if (result.rows[0].caso_prueba_estado === null) {
      return res
        .status(200)
        .json({ error: "No existen casos de uso", data: null });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

const casosPruebaById = async (req, res, next) => {
  const proyectoId = req.params.id;

  if (!proyectoId) {
    return res
      .status(400)
      .json({ error: "El ID del proyecto es requerido", data: null });
  }

  try {
    const query = `
    SELECT 
        cp.id,
        cp.titulo,
        cp.descripcion,
        cp.estado
    FROM 
        public.proyectos p
    JOIN 
        public.usuarios u ON p.creado_por = u.id
    LEFT JOIN 
        public.casos_uso cu ON cu.id_proyecto = p.id
    LEFT JOIN 
        public.casos_prueba cp ON cp.id_caso_uso = cu.id
    LEFT JOIN 
        public.defectos d ON d.id_caso_prueba = cp.id
    WHERE 
        p.id = $1
    ORDER BY 
        p.id, cu.id, cp.id, d.id;

    `;

    const result = await pool.query(query, [proyectoId]);

    if (result.rows[0].id === null) {
      return res
        .status(200)
        .json({ error: "No existen casos de prueba", data: null });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

const obtenerAllCasosUso = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
      cu.id AS caso_uso_id, 
      cu.id_proyecto,
      p.nombre AS proyecto_nombre, 
      cu.titulo AS caso_uso_titulo,
      cu.descripcion AS caso_uso_descripcion,
      cu.fecha_creacion AS caso_uso_creacion
      FROM 
      public.casos_uso cu
      JOIN 
      public.proyectos p ON cu.id_proyecto = p.id
      ORDER BY 
      cu.id ASC;
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const updateCasoUso = async (req, res, next) => {
  const {
    caso_uso_creacion,
    caso_uso_descripcion,
    caso_uso_id,
    caso_uso_titulo,
    id_proyecto,
    proyecto_nombre,
  } = req.body;
  console.log("id_proyecto", id_proyecto);
  console.log("caso_uso_titulo", caso_uso_titulo);

  const query = `
    UPDATE public.casos_uso
    SET 
      id_proyecto = $1,
      titulo = $2,
      descripcion = $3,
      fecha_creacion = $4
    WHERE 
      id = $5;
  `;
  console.log("proyecto", proyecto_nombre);
  const idProyectoParsedToInt = parseInt(id_proyecto, 10);
  const values = [
    idProyectoParsedToInt,
    caso_uso_titulo,
    caso_uso_descripcion,
    caso_uso_creacion,
    caso_uso_id,
  ];

  try {
    const result = await pool.query(query, values);
    if (result) {
      res.status(200).json({ message: "Caso prueba actualizado con éxito" });
    }
    console.log("Caso prueba actualizado con éxito", result);
  } catch (error) {
    console.error("Error actualizando el caso de prueba:", error);
  }
};

const eliminarCasoUso = async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ error: "El ID del caso de uso es requerido" });
  }

  const query = `
  DELETE FROM public.casos_uso
  WHERE id =$1
  RETURNING *;
  `;

  try {
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(400).json({ error: "Caso uso no encontrado" });
    }
    res
      .status(200)
      .json({ error: "Caso uso encontrado y eliminado con exito" });
  } catch (error) {
    next(error);
  }
};

const obtenerAllCasosPrueba = async (req, res, next) => {
  try {
    const result = await pool.query(`
    SELECT 
  cp.id, 
  cp.id_caso_uso,
  cp.creado_por,
  cu.titulo AS caso_uso_titulo,  -- Obtenemos el título del caso de uso
  cp.titulo AS caso_prueba_titulo, 
  cp.descripcion AS caso_prueba_descripcion, 
  cp.fecha_creacion AS caso_prueba_creacion,
  cp.estado AS caso_prueba_estado,
  u.nombre AS creador_nombre,    -- Obtenemos el nombre del creador
  u.apellido AS creador_apellido -- Obtenemos el apellido del creador
FROM 
  public.casos_prueba cp
JOIN 
  public.casos_uso cu ON cp.id_caso_uso = cu.id  -- Relacionamos casos_prueba con casos_uso
JOIN 
  public.usuarios u ON cp.creado_por = u.id  -- Relacionamos casos_prueba con usuarios (creador)
ORDER BY 
  cp.id ASC;


    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const updateCasoPrueba = async (req, res, next) => {
  const {
    id,
    id_caso_uso,
    creado_por,
    caso_uso_titulo,
    caso_prueba_titulo,
    caso_prueba_descripcion,
    caso_prueba_creacion,
    caso_prueba_estado,
    creador_nombre,
    creador_apellido,
  } = req.body;
  console.log("creado por", creado_por);
  console.log("caso_uso_titulo", caso_uso_titulo);
  console.log("creado por", creador_nombre + " " + creador_apellido);

  const query = `
    UPDATE public.casos_prueba
    SET 
      titulo = $1,
      descripcion = $2,
      fecha_creacion = $3,
      estado = $4,
      creado_por = $5,
      id_caso_uso = $6
    WHERE 
      id = $7;
  `;
  const idCasoUsoParsedToInt = parseInt(id_caso_uso, 10);
  const values = [
    caso_prueba_titulo,
    caso_prueba_descripcion,
    caso_prueba_creacion,
    caso_prueba_estado,
    creado_por,
    idCasoUsoParsedToInt,
    id,
  ];

  try {
    const result = await pool.query(query, values);
    if (result) {
      res.status(200).json({ message: "Caso prueba actualizado con éxito" });
    }
    console.log("Caso prueba actualizado con éxito", result);
  } catch (error) {
    console.error("Error actualizando el caso de prueba:", error);
  }
};

const eliminarCasoPrueba = async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "El ID del proyecto es requerido" });
  }

  const query = `
  DELETE FROM public.casos_prueba
  WHERE id =$1
  RETURNING *;
  `;

  try {
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(400).json({ error: "Caso prueba no encontrado" });
    }
    res
      .status(200)
      .json({ error: "Caso prueba encontrado y eliminado con exito" });
  } catch (error) {
    next(error);
  }
};

const crearCasoPrueba = async (req, res, next) => {
  const {
    id_caso_uso,
    casoPrueba_titulo,
    casoPrueba_descripcion,
    casoPrueba_creacion,
    casoPrueba_estado,
    creado_por,
  } = req.body;

  // Comprobar que todos los campos requeridos están presentes
  if (
    !id_caso_uso ||
    !casoPrueba_titulo ||
    !casoPrueba_descripcion ||
    !casoPrueba_creacion ||
    !casoPrueba_estado ||
    !creado_por
  ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const query = `
    INSERT INTO public.casos_prueba 
    (
      id_caso_uso,
      titulo, 
      descripcion, 
      estado, 
      creado_por,
      fecha_creacion
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const idCasoUsoParsedToInt = parseInt(id_caso_uso, 10); // Asegurarse de que id_caso_uso es un número
  const values = [
    idCasoUsoParsedToInt,
    casoPrueba_titulo,
    casoPrueba_descripcion,
    casoPrueba_estado, // Aquí debe ir el estado
    creado_por,
    casoPrueba_creacion, // Y aquí debe ir la fecha de creación
  ];

  try {
    // Ejecutar la consulta para crear el caso de prueba
    const result = await pool.query(query, values);

    // Devolver el caso de prueba creado
    res.status(201).json({
      message: "Caso de prueba creado con éxito",
      casoPrueba: result.rows[0],
    });
  } catch (error) {
    console.error("Error al crear el caso de prueba:", error);
    next(error); // Pasar el error al middleware de manejo de errores
  }
};

const crearCasoUso = async (req, res, next) => {
  const {
    id_proyecto,
    titulo_caso_uso,
    descripcion_caso_uso,
    creacion_caso_uso,
  } = req.body;

  // Comprobar que todos los campos requeridos están presentes
  if (
    !id_proyecto ||
    !titulo_caso_uso ||
    !descripcion_caso_uso ||
    !creacion_caso_uso
  ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const query = `
    INSERT INTO public.casos_uso 
    (
      id_proyecto,
      titulo, 
      descripcion, 
      fecha_creacion
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const idProyectoParsedToInt = parseInt(id_proyecto, 10); // Asegurarse de que id_caso_uso es un número
  const values = [
    idProyectoParsedToInt,
    titulo_caso_uso,
    descripcion_caso_uso,
    creacion_caso_uso, // Y aquí debe ir la fecha de creación
  ];

  try {
    // Ejecutar la consulta para crear el caso de prueba
    const result = await pool.query(query, values);

    // Devolver el caso de prueba creado
    res.status(201).json({
      message: "Caso de uso creado con éxito",
      casoPrueba: result.rows[0],
    });
  } catch (error) {
    console.error("Error al crear el caso de uso:", error);
    next(error); // Pasar el error al middleware de manejo de errores
  }
};

module.exports = {
  contarCasos,
  casosUsoById,
  casosPruebaById,
  obtenerAllCasosUso,
  obtenerAllCasosPrueba,
  updateCasoPrueba,
  eliminarCasoPrueba,
  crearCasoPrueba,
  updateCasoUso,
  eliminarCasoUso,
  crearCasoUso,
};
