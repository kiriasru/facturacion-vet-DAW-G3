const express = require('express');
const router = express.Router();

const {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
} = require('../controllers/clientesController');

router.get('/', obtenerClientes);
router.get('/:Id', obtenerClientePorId);
router.post('/', crearCliente);
router.put('/', actualizarCliente);
router.delete('/:Id', eliminarCliente);

module.exports = router;

