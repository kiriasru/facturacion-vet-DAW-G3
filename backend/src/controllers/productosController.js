const pool = require("../config/db");

/* GET - todos los productos */
const getProductos = async (req, res) => {
    const sql = "SELECT Id, Nombre, Stock, Precio FROM Producto";

    pool.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error en la consulta SQL...",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Productos encontrados exitosamente",
            data: results,
        });
    });
};

/* GET - producto por ID */
const getProductoById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            status: 400,
            message: "El ID es requerido.",
        });
    }

    const sql = "SELECT Id, Nombre, Stock, Precio FROM Producto WHERE Id = ?";

    pool.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error en la consulta SQL...",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Producto encontrado exitosamente",
            data: results,
        });
    });
};

/* POST - crear producto */
const createProducto = async (req, res) => {
    const { Nombre, Stock, Precio } = req.body;

    if (!Nombre || !Stock || !Precio) {
        return res.status(400).json({
            status: 400,
            message: "Nombre, Stock y Precio son requeridos.",
        });
    }

    const sql = "INSERT INTO Producto (Nombre, Stock, Precio) VALUES (?, ?, ?)";

    pool.query(sql, [Nombre, Stock, Precio], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error en la consulta SQL...",
            });
        }

        return res.status(201).json({
            status: 201,
            message: "Producto creado exitosamente...",
            data: results,
        });
    });
};

/* PUT - actualizar producto */
const updateProducto = async (req, res) => {
    const { id } = req.params;
    const { Nombre, Stock, Precio } = req.body;

    if (!id || !Nombre || !Stock || !Precio) {
        return res.status(400).json({
            status: 400,
            message: "Todos los campos son requeridos.",
        });
    }

    const sql =
        "UPDATE Producto SET Nombre = ?, Stock = ?, Precio = ? WHERE Id = ?";

    pool.query(sql, [Nombre, Stock, Precio, id], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error en la consulta SQL...",
            });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Producto no encontrado.",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Producto actualizado exitosamente.",
        });
    });
};

/* DELETE - eliminar producto */
const deleteProducto = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            status: 400,
            message: "El ID es requerido.",
        });
    }

    const sql = "DELETE FROM Producto WHERE Id = ?";

    pool.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: "Error en la consulta SQL...",
            });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Producto no encontrado.",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Producto eliminado exitosamente.",
        });
    });
};

module.exports = {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
};