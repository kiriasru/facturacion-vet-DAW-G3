const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/',(req,res) =>{
    const sql = 'SELECT Id, Id_Venta, Id_Producto, Cantidad, Subtotal FROM detalleventa';
    
    pool.query(sql,(err, results)=>{
        if(err){
            console.log('Error en la consulta sql...')
            res.status(500).json({status:500, message:'Error en la consulta sql...'})
        }else{
            res.status(200).json({status:200, message:'Success...', data:results })
        }
    });
});

router.get('/venta/:Id', (req, res) => {
    const Id = parseInt(req.params.Id);
    const sql = 'SELECT Id, Id_Venta, Id_Producto, Cantidad, Subtotal FROM detalleventa WHERE Id_Venta = ?';

    pool.query(sql, [Id], (err, results) => {
        if (err) {
            console.log('Error en la consulta sql...');
            return res.status(500).json({ status: 500, message: 'Error en la consulta sql...' });
        }
        res.status(200).json({ status: 200, message: 'Detalles encontrados exitosamente', data: results });
    });
});

router.get('/:Id', (req, res) => {
    const Id = parseInt(req.params.Id);
    const sql = 'SELECT Id, Id_Venta, Id_Producto, Cantidad, Subtotal FROM detalleventa WHERE Id = ?';

    pool.query(sql, [Id], (err, results) => {
        if (err) {
            console.log('Error en la consulta sql...');
            return res.status(500).json({ status: 500, message: 'Error en la consulta sql...' });
        }
        res.status(200).json({ status: 200, message: 'Detalle encontrado exitosamente', data: results[0] });
    });
});

router.get('/producto/:Id', (req, res) => {
    const Id = parseInt(req.params.Id);
    const sql = 'SELECT Id, Id_Venta, Id_Producto, Cantidad, Subtotal FROM detalleventa WHERE Id_Producto = ?';

    pool.query(sql, [Id], (err, results) => {
        if (err) {
            console.log('Error en la consulta sql...');
            return res.status(500).json({ status: 500, message: 'Error en la consulta sql...' });
        }
        res.status(200).json({ status: 200, message: 'Detalles encontrados exitosamente', data: results });
    });
});

router.post('/', (req, res) => {
    const detalle = req.body;
    
    if (!detalle.Id_Venta || !detalle.Id_Producto || !detalle.Cantidad || !detalle.Subtotal){
        return res.status(400).json({status:400,message:'Los parametros Id_Venta, Id_Producto, Cantidad y Subtotal son requeridos'})
    }

    const sql = `
        INSERT INTO detalleventa (Id_Venta, Id_Producto, Cantidad, Subtotal)
        VALUES (?, ?, ?, ?)
    `;

    pool.query(sql, [detalle.Id_Venta, detalle.Id_Producto, detalle.Cantidad, detalle.Subtotal], (err, result) => {
        if (err){
            res.status(500).json({status:500, message:'Error en la consulta sql...'})
        }
        else{
            detalle.Id = result.insertId;
            res.status(200).json({status:200, message:'success...', data:detalle })
        }
    });
});

router.put('/', (req, res) => {
    const detalle = req.body;

    const sql = `
        UPDATE detalleventa
        SET Id_Venta = ?, Id_Producto = ?, Cantidad = ?, Subtotal = ?
        WHERE Id = ?
    `;

    pool.query(sql, [detalle.Id_Venta, detalle.Id_Producto, detalle.Cantidad, detalle.Subtotal, detalle.Id], (err, result) => {
        if (err) {
            res.status(500).json({status:500, message:'Error en la consulta sql...'})
        }
        else {
            detalle.Id = result.insertId;
            res.status(200).json({status:200, message:'Detalle actualizado exitosamente', data:detalle })
        }
    });
});

router.delete('/:Id', (req, res) => {
    const Id = parseInt(req.params.Id);
    const sql = 'DELETE FROM detalleventa WHERE Id = ?'; 

    pool.query(sql, [Id], (err, result) => {
        if (err){
            return res.status(500).json({status:500, message:'Error en la consulta sql...'})
        }
        
        if( result.affectedRows ===0){
            return res.status(404).json({status:404, message:'Error en la consulta sql...'})
        }

        return res.status(200).json({status:200, message:'Registro eliminado exitosamente...'})
    });
});

module.exports = router;