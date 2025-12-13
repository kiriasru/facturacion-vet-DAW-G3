const express = require('express');
const router = express.Router();

const {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorNombre,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuariosController');   


router.get('/', obtenerUsuarios);

router.get('/id/:id', obtenerUsuarioPorId);

router.get('/nombre/:nombre', obtenerUsuarioPorNombre);

router.put('/:id', actualizarUsuario);

router.delete('/:id', eliminarUsuario);

module.exports = router;