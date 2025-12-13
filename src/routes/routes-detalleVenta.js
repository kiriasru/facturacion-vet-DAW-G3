const express = require('express');
const router = express.Router();

const {
    obtenerDetalles,
    obtenerDetallesPorVenta,
    obtenerDetallesPorProducto,
    obtenerDetallePorId
    } = require('../controllers/detalleVentaController');


router.get('/', obtenerDetalles);
router.get('/venta/:Id', obtenerDetallesPorVenta);
router.get('/producto/:Id', obtenerDetallesPorProducto);
router.get('/:Id', obtenerDetallePorId);

module.exports = router;

