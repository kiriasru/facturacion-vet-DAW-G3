const express = require("express");
const registroUsuario = require("../controllers/registroController");
const router = express.Router();

router.post("/", registroUsuario);

module.exports = router;