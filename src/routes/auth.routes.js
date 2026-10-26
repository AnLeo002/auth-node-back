const express = require("express");
const { registrarUsuario, login } = require("../controllers/auth.controller");
const router = express.Router();
const validarAuth = require("../middleware/validarAuth")

router.post("/registro", validarAuth, registrarUsuario);
router.post("/login", validarAuth, login);

module.exports = router;