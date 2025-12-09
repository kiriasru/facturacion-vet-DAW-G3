const express = require('express');
const router = express.Router();

const {
    obtenerVentas,
    obtenerVentaPorId,
    crearVenta
} = require('../controllers/ventasController');

router.get('/', obtenerVentas);
router.get('/:Id', obtenerVentaPorId);
router.post('/', crearVenta);

module.exports = router;