const express = require("express");
const router = express.Router();
const {
  loginUser,
  contarUsuarios,
  getAllUsuarios,
  getCompleteAllUsuarios,
  updateUsuario,
  createUser,
  deleteUser,
} = require("../controllers/userController");

router.post("/login", loginUser);
router.get("/count", contarUsuarios);
router.get("/getAllUsuarios", getAllUsuarios);
router.post("/getCompleteAllUsuarios", getCompleteAllUsuarios);
router.post("/updateUsuario", updateUsuario);
router.post("/createUser", createUser);
router.delete("/deleteUser", deleteUser);

module.exports = router;
