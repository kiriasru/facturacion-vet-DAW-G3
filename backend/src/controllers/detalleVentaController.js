const pool = require('../config/db');

const obtenerDetalles = (req, res) => {
    const sql = 'SELECT Id, Id_Venta, Id_Producto, Cantidad, Subtotal FROM detalleventa';

    pool.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ status: 500, message: 'Error en la consulta sql...' });
        }

        return res.status(200).json({ status: 200, message: 'Success...', data: results });
    });
};

const obtenerDetallesPorVenta = (req, res) => {
    const Id = parseInt(req.params.Id);

    if (!Id) {
        return res.status(400).json({ status: 400, message: 'El Id de la venta es requerido.' });
    }

    const sql = `
        SELECT d.Id, d.Id_Venta, d.Id_Producto, p.Nombre AS NombreProducto, d.Cantidad, p.Precio AS PrecioUnitario, d.Subtotal
        FROM detalleventa d
        JOIN Producto p ON d.Id_Producto = p.Id
        WHERE d.Id_Venta = ?
    `;

    pool.query(sql, [Id], (err, results) => {
        if (err) {
            return res.status(500).json({ status: 500, message: 'Error en la consulta sql...' });
        }

        return res.status(200).json({ status: 200, message: 'Detalles encontrados exitosamente', data: results });
    });
};

const obtenerDetallesPorProducto = (req, res) => {
    const Id = parseInt(req.params.Id);

    if (!Id) {
        return res.status(400).json({ status: 400, message: 'El Id del producto es requerido.' });
    }

    const sql = 'SELECT Id, Id_Venta, Id_Producto, Cantidad, Subtotal FROM detalleventa WHERE Id_Producto = ?';

    pool.query(sql, [Id], (err, results) => {
        if (err) {
            return res.status(500).json({ status: 500, message: 'Error en la consulta sql...' });
        }

        return res.status(200).json({ status: 200, message: 'Detalles encontrados exitosamente', data: results });
    });
};

const obtenerDetallePorId = (req, res) => {
    const Id = parseInt(req.params.Id);

    if (!Id) {
        return res.status(400).json({ status: 400, message: 'El Id es requerido.' });
    }

    const sql = 'SELECT Id, Id_Venta, Id_Producto, Cantidad, Subtotal FROM detalleventa WHERE Id = ?';

    pool.query(sql, [Id], (err, results) => {
        if (err) {
            return res.status(500).json({ status: 500, message: 'Error en la consulta sql...' });
        }

        if (results.length === 0) {
            return res.status(404).json({ status: 404, message: 'Detalle no encontrado.' });
        }

        return res.status(200).json({ status: 200, message: 'Detalle encontrado exitosamente', data: results[0] });
    });
};


module.exports = {
    obtenerDetalles,
    obtenerDetallesPorVenta,
    obtenerDetallesPorProducto,
    obtenerDetallePorId
};