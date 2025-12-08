const express = require('express');
const router = express.Router();

const {
    obtenerClientes,
    obtenerClientesPorId,
    crearCliente,
    actualizarClientes,
    eliminarCliente
} = require ('../controllers/clientes-controller');

router.get('/', obtenerClientes);
router.get('/:Id', obtenerClientesPorId);
router.post('/', crearCliente);
router.put('/', actualizarClientes);
router.delete('/:Id', eliminarCliente);

module.exports = router;

