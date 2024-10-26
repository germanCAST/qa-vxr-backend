const pool = require("../config/db");

const defectosById = async (req, res, next) => {
  const proyectoId = req.params.id;

  if (!proyectoId) {
    return res
      .status(400)
      .json({ error: "El ID del proyecto es requerido", data: null });
  }

  try {
    const query = `
    SELECT 
    d.id,
    d.descripcion,
    d.estado,
    d.prioridad
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
        AND d.id IS NOT NULL
    ORDER BY 
        p.id, cu.id, cp.id, d.id;
    `;

    const result = await pool.query(query, [proyectoId]);

    if (result.rows.length <= 0) {
      return res.status(200).json({
        error: "No se encontraron defectos creados del proyecto",
        data: null,
      });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getAllDefectos = async (req, res, next) => {
  try {
    const query = `
    SELECT 
    d.id AS defecto_id,
    d.descripcion AS defecto_descripcion,
    d.estado AS defecto_estado,
    d.prioridad AS defecto_prioridad,
    d.fecha_creacion AS defecto_fecha_creacion,
    d.fecha_actualizacion AS defecto_fecha_actualizacion,
    d.creado_por AS creador_id,
    uc.nombre AS creador_nombre,
    uc.apellido AS creador_apellido,
    d.asignado_a AS asignado_id,
    ua.nombre AS asignado_nombre,
    ua.apellido AS asignado_apellido,
    cp.id AS caso_prueba_id,
    cp.titulo AS caso_prueba_titulo  -- Obtenemos el título del caso de prueba
    FROM 
    public.defectos d
    JOIN 
    public.usuarios uc ON d.creado_por = uc.id  -- Join para obtener datos del creador
    JOIN 
    public.usuarios ua ON d.asignado_a = ua.id  -- Join para obtener datos del usuario asignado
    JOIN 
    public.casos_prueba cp ON d.id_caso_prueba = cp.id  -- Join para obtener datos del caso de prueba
    ORDER BY 
    d.id ASC;
    `;

    const result = await pool.query(query);

    if (result.rows.length <= 0) {
      return res.status(400).json({
        error: "No se encontraron defectos",
        data: null,
      });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

const updateDefecto = async (req, res) => {
  const {
    defecto_id,
    defecto_descripcion,
    defecto_estado,
    defecto_prioridad,
    defecto_fecha_creacion,
    defecto_fecha_actualizacion,
    creador_id,
    creador_nombre,
    creador_apellido,
    asignado_id,
    asignado_nombre,
    asignado_apellido,
    caso_prueba_id,
    caso_prueba_titulo,
  } = req.body;

  console.log({
    defecto_fecha_creacion,
    creador_nombre,
    creador_apellido,
    asignado_nombre,
    asignado_apellido,
    caso_prueba_titulo,
  });

  const query = `
    UPDATE public.defectos
    SET 
      descripcion = $1,
      estado = $2,
      prioridad = $3,
      fecha_actualizacion = $4,
      creado_por = $5,
      asignado_a = $6,
      id_caso_prueba = $7
    WHERE 
      id = $8;
  `;

  const values = [
    defecto_descripcion,
    defecto_estado,
    defecto_prioridad,
    defecto_fecha_actualizacion,
    parseInt(creador_id),
    parseInt(asignado_id),
    parseInt(caso_prueba_id),
    defecto_id,
  ];

  try {
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Defecto no encontrado" });
    }

    res.status(200).json({ message: "Defecto actualizado exitosamente" });
  } catch (error) {
    console.error("Error actualizando el defecto:", error);
    res.status(500).json({ error: "Error al actualizar el defecto" });
  }
};

const deleteDefecto = async (req, res) => {
  const defectoId = req.body.defecto_id;

  if (!defectoId) {
    return res
      .status(400)
      .json({ error: "El ID del defecto es requerido", data: null });
  }

  const query = `
    DELETE FROM public.defectos
    WHERE id = $1;
  `;

  try {
    const result = await pool.query(query, [defectoId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Defecto no encontrado" });
    }

    res.status(200).json({ message: "Defecto eliminado exitosamente" });
  } catch (error) {
    console.error("Error eliminando el defecto:", error);
    res.status(500).json({ error: "Error al eliminar el defecto" });
  }
};

const createDefecto = async (req, res) => {
  const {
    descripcion,
    estado,
    prioridad,
    fecha_creacion,
    creado_por,
    asignado_a,
    id_caso_prueba,
  } = req.body;

  const query = `
    INSERT INTO public.defectos (
      descripcion,
      estado,
      prioridad,
      fecha_creacion,
      creado_por,
      asignado_a,
      id_caso_prueba
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    )
  `;

  const values = [
    descripcion,
    estado,
    prioridad,
    fecha_creacion,
    parseInt(creado_por),
    parseInt(asignado_a),
    parseInt(id_caso_prueba),
  ];

  try {
    const result = await pool.query(query, values);

    res.status(200).json({ message: "Defecto creado exitosamente" });
  } catch (error) {
    console.error("Error creando el defecto:", error);
    res.status(500).json({ error: "Error al crear el defecto" });
  }
};

module.exports = {
  defectosById,
  getAllDefectos,
  createDefecto,
  updateDefecto,
  deleteDefecto,
};

module.exports = {
  defectosById,
  getAllDefectos,
  createDefecto,
  updateDefecto,
  deleteDefecto,
  createDefecto,
};

module.exports = {
  defectosById,
  getAllDefectos,
  updateDefecto,
  deleteDefecto,
  createDefecto,
};
