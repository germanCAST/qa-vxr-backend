const express = require("express");
const router = express.Router();

const {
  defectosById,
  getAllDefectos,
  updateDefecto,
  deleteDefecto,
  createDefecto,
} = require("../controllers/defectoController");

router.get("/getDefectosById/:id", defectosById);
router.get("/getAllDefectos", getAllDefectos);
router.post("/updateDefecto", updateDefecto);
router.post("/createDefecto", createDefecto);
router.delete("/deleteDefecto", deleteDefecto);

module.exports = router;
