const pool = require('../config/db');

//GET VENTAS
const obtenerVentas = (req, res) => {

    const sql = 'SELECT Id, Id_Usuario, Id_Cliente, DATE_FORMAT(Fecha, "%Y-%m-%d %H:%i") as Fecha, Total FROM Venta';

    pool.query (sql, (err, results) => {
        if (err) {
            console.log ('Error en la consulta SQL ventas...');
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

    const sql = 'SELECT Id, Id_Usuario, Id_Cliente, DATE_FORMAT(Fecha, "%Y-%m-%d %H:%i") as Fecha, Total FROM Venta WHERE Id = ?';

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
    const Id_Usuario = req.user.id;
    const { Id_Cliente, Detalles } = req.body;

    if (!Id_Cliente || !Detalles || !Array.isArray(Detalles) || Detalles.length === 0){
        return res.status(400).json({status:400, message: 'Id_Cliente y Detalles son requeridos'});
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
        
        const clienteInfo = resultsCliente[0];
        let total = 0;
        let detallesConPrecio = [];

        const procesarProducto = (index) => {
            if (index >= Detalles.length) {
                insertarVenta(total, detallesConPrecio, Id_Usuario, Id_Cliente, clienteInfo, res);
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
                    Nombre: producto.Nombre,
                    Precio: producto.Precio,
                    Cantidad: detalle.Cantidad,
                    Subtotal: subtotal
                });
                procesarProducto(index + 1);
            });
        };
        procesarProducto(0);
    });
};

const insertarVenta = (total, detallesConPrecio, Id_Usuario, Id_Cliente, clienteInfo, res) => {
    const sqlVenta = 'INSERT INTO Venta (Id_Usuario, Id_Cliente, Fecha, Total) VALUES (?, ?, NOW(), ?)';

    pool.query(sqlVenta, [Id_Usuario, Id_Cliente, total], (errVenta, resultVenta) => {
        if (errVenta) {
            console.log('Error al insertar la venta...');
            return res.status(500).json({status: 500, message: 'Error al insertar la venta...'});
        }
        const Id_Venta = resultVenta.insertId;
        insertarDetalles(Id_Venta, detallesConPrecio, 0, res, Id_Usuario, Id_Cliente, clienteInfo, total);
    });
};

const insertarDetalles = (Id_Venta, detallesConPrecio, index, res, Id_Usuario, Id_Cliente, clienteInfo, total) => {
    if (index >= detallesConPrecio.length) {
        
        const subtotal = total;
        const isv = subtotal * 0.15;
        const totalConISV = subtotal + isv;

        return res.status(201).json({
            status: 201,
            message: 'Venta creada exitosamente.',
            factura: {
                veterinaria: {
                    nombre: 'Veterinaria X',
                    direccion: 'Tegucigalpa, Honduras',
                    telefono: '2222-2222'
                },
                venta: {
                    numeroFactura: Id_Venta,
                    fecha: new Date().toLocaleString('es-HN', { timeZone: 'America/Tegucigalpa' })
                },
                cliente: {
                    nombre: clienteInfo.Nombre,
                    telefono: clienteInfo.Telefono
                },
                productos: detallesConPrecio.map(detalle => ({
                    nombre: detalle.Nombre,
                    precio: detalle.Precio,
                    cantidad: detalle.Cantidad,
                    subtotal: detalle.Subtotal
                })),
                totales: {
                    subtotal: subtotal.toFixed(2),
                    isv: isv.toFixed(2),
                    total: totalConISV.toFixed(2)
                }
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

        const sqlUpdateStock = 'UPDATE Producto SET Stock = Stock - ? WHERE Id = ?';

        pool.query(sqlUpdateStock, [detalle.Cantidad, detalle.Id_Producto], (errStock, resultsStock) => {
            if (errStock) {
                console.log('Error al actualizar el stock...');
                return res.status(500).json({
                    status: 500,
                    message: 'Error al actualizar el stock...'
                });
            }

            insertarDetalles(Id_Venta, detallesConPrecio, index + 1, res, Id_Usuario, Id_Cliente, clienteInfo, total);
        });
    });
};

module.exports = {
    obtenerVentas,
    obtenerVentasPorId,
    crearVenta
};