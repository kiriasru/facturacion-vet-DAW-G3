const pool = require('../config/db');

//GET VENTAS
const obtenerVentas = (req, res) => {

    const sql = 'SELECTE Id, Id_Usuario, Id_Cliente, Fecha, Total FROM Venta';

    pool.query (sql, (err, results) => {
        if (err) {
            console.log ('Error en la consutla SQL ventas...');
            return res.status(500).json ({status:500, message: 'Error en la consulta SQL...'});
        }

        return res.status(200).json ({status:200, message:'Ventas encontradas exitosamente...', data:results});
    });
};

//GET POR ID
const obtenerVentasPorId = (req, res) => {
    const Id = parseInt(req.params.Id);

    if(!Id){
        return res.status(400).json({status:400, message: 'El Id es requerido...'});
    }

    const sql = 'SELECT Id, Id_Usario, Id_Cliente, Fecha, Total FROM Venta WHERE Id = ?';

    pool.query(sql, [Id], (err, results) => {
        if(err) {
            console.log ('Error en la consulta SQL Ventas...');
            return res.status(500).json({status:500, message: 'Error en la consulta SQL...', data: results});
        }
        return res.status(200).json({status:200, message: 'Venta encontrada exitosamente', data: results});
    });
};

//POST 

const crearVenta = (req, res) => {
    const Id_Usuario = req.user && req.user.id;
    const { Id_Cliente, Detalles } = req.body;

    if(!Id_Usuario) {
        return res.status(401).json ({status:401, message: 'Usuario no autenticado.'});
    }

    if (!Id_Cliente || !Detalles || !Array.isArray(Detalles) || Detalles.length === 0){
        return res.status(400).json({status:400, message: 'Id_Cliente y Detalles de productos'});
    }

    const sqlCliente = 'SELECT Id, Nombre, Telefono FROM Cliente WHERE Id = ?';

    pool.query(sqlCliente, [Id_Cliente], (errCliente, resultsCliente) => {
        if (errCliente) {
            console.log('Error en la consulta SQL...');
            return res.status(500).json({status: 500, message: 'Error en la consulta SQL...'});
        }

        if (resultsCliente.length === 0){
            return res.status(404).json ({ status:404, message: "Cliente no encontrado..."});
        }
        
        let total = 0;
        let detallesConPrecio = [];

        const procesarProducto = (index) => {
            if (index >= Detalles.length) {
                insertarVenta(total, detallesConPrecio, Id_Usuario, Id_Cliente, res);
                return;
            }

            const detalle = Detalles [index];

            if (!detalle.Id_Producto || !detalle.Cantidad) {
                return res.status(400).json ({status:400, message: 'Cada detalle debe tener Id_Producto y Cantidad'});
            }

            const sqlProducto = 'SELECT Id, Nombre, Precio, Stock FROM Producto WHERE Id =?';

            pool.query(sqlProducto, [detalle.Id_Producto], (errProd, resultsProd) => {
                if (errProd) {
                    console.log ('Error en la consulta SQL...');
                    return res.status(500).json({status:500, message:'Error en la consulta SQL...'});
                }

                if(resultsProd.length === 0) {
                    return res.status(404).json({stats:404, message:`Producto con Id ${detalle.Id_Producto} no encontrado.`});
                }

                const producto = resultsProd[0];

                if(producto.Stock < detalle.Cantidad) {
                    return res.status(400).json({status:400, message:`Stock insuficiente para el producto ${producto.Nombre}.`});
                }

                const subtotal = producto.Precio * detalle.Cantidad;
                total += subtotal;

                detallesConPrecio.push({
                    Id_Producto: detalle.Id_Producto,
                    Cantidad: detalle.Cantidad,
                    Subtotal: subtotal
                });
                procesarProducto(index + 1);
            });
        };
        procesarProducto(0);
    });
};

const insertarVenta = (total, detallesConPrecio, Id_Usuario, Id_Cliente, res) => {
    const sqlVenta = 'INSERT INTO Venta (Id_Usuario, Id_Cliente, Fecha, Total) VALUES (?, ?, NOW(), ?)';

    pool.query(sqlVenta, [Id_Usuario, Id_Cliente, total], (erVenta, resultVenta) => {
        if (errVenta) {
            console.log('Error al insertar la venta...');
            return res.status(500).json({status: 500, message: 'Error al insertar la venta...'});
        }
        const Id_Venta = resultsVenta.insertId;

        insertarDetalles(Id_Venta, detallesConPrecio, 0, res, Id_Usuario, Id_Cliente, total);
    });
};

const insertarDetalles = (Id_Venta, detallesConPrecio, index, res, Id_Usuario, Id_Cliente, total) => {
    if (index >= detallesConPrecio.length) {
        return res.status(201).json({
            status: 201,
            message: 'Venta creada exitosamente.',
            data: {
                Id: Id_Venta,
                Id_Usuario: Id_Usuario,
                Id_Cliente: Id_Cliente,
                Total: total,
                Detalles: detallesConPrecio
            }
        });
    }
    const detalle = detallesConPrecio[index];

    const sqlDetalle = `
        INSERT INTO detalleventa (Id_Venta, Id_Producto, Cantidad, Subtotal)
        VALUES (?, ?, ?, ?)
    `;

    pool.query(sqlDetalle, [Id_Venta, detalle.Id_Producto, detalle.Cantidad, detalle.Subtotal], (errDet, resultsDet) => {
        if (errDet) {
            console.log('Error al insertar el detalle de venta...');
            return res.status(500).json({
                status: 500,
                message: 'Error al insertar el detalle de la venta...'
            });
        }

        // Actualizar stock
        const sqlUpdateStock = 'UPDATE Producto SET Stock = Stock - ? WHERE Id = ?';

        pool.query(sqlUpdateStock, [detalle.Cantidad, detalle.Id_Producto], (errStock, resultsStock) => {
            if (errStock) {
                console.log('Error al actualizar el stock...');
                return res.status(500).json({
                    status: 500,
                    message: 'Error al actualizar el stock...'
                });
            }

            insertarDetalles(Id_Venta, detallesConPrecio, index + 1, res, Id_Usuario, Id_Cliente, total);
        });
    });
};

module.exports = {
    obtenerVentas,
    obtenerVentasPorId,
    crearVenta
};