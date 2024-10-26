const express = require("express");
const router = express.Router();
const {
  crearProyecto,
  obtenerProyectos,
  contarProyectos,
  updateProyecto,
  eliminarProyecto,
} = require("../controllers/proyectoController");

router.post("/update", updateProyecto);
router.post("/create", crearProyecto);
router.delete("/delete", eliminarProyecto);
router.get("/", obtenerProyectos);
router.get("/count", contarProyectos);

module.exports = router;
