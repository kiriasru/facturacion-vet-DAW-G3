const express = require('express');
const router = express.Router();

const {
    obtenerVentas,
    obtenerVentasPorId,
    crearVenta
} = require('../controllers/ventasController');

router.get('/', obtenerVentas);
router.get('/:Id', obtenerVentasPorId);
router.post('/', crearVenta);

module.exports = router;