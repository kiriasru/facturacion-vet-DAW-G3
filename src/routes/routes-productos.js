const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/producto',(req,res) =>{
    const sql = 'select Id, Nombre, Stock, Precio';
    
    pool.query(sql,(err, results)=>{
        if(err){
            console.log('Error en la consulta sql...')
            res.status(500).json({status:500, message:'Error en la consulta sql...'})
        }else{
            res.status(200).json({status:200, message:'Productos encontrados exitosamente', data:results })
        }
    });
});

router.get('/producto/:Id',(req,res)=>{
    const Id = req.params.Id;

    if (!Id){
        res.status(400).json({status:400,message:'El ID es requerido.'})
    }else{
        const sql = 'select Id, Nombre, Stock, Precio from Producto where Id =?';

        pool.query(sql,[Id],(err,results)=>{
           if(err){
            res.status(500).json({status:500, message:'Error en la consulta sql...'})
            }else{
            res.status(200).json({status:200, message:'ID encontrado exitosamente', data:results })
            } 
        });
    }
});

router.get('/producto/:Nombre',(req,res)=>{
    const Nombre = req.params.Nombre;

    if (!Nombre){
        res.status(400).json({status:400,message:'El Nombre es requerido.'})
    }else{
        const sql = 'select Id, Nombre, Stock, Precio from Producto where Nombre =?';

        pool.query(sql,[Nombre],(err,results)=>{
           if(err){
            res.status(500).json({status:500, message:'Error en la consulta sql...'})
            }else{
            res.status(200).json({status:200, message:'Nombre encontrado exitosamente', data:results })
            } 
        });
    }
});

router.get('/producto/:Stock',(req,res)=>{
    const Stock = req.params.Stock;

    if (!Stock){
        res.status(400).json({status:400,message:'El Stock es requerido.'})
    }else{
        const sql = 'select Id, Nombre, Stock, Precio from Producto where Stock =?';

        pool.query(sql,[Stock],(err,results)=>{
           if(err){
            res.status(500).json({status:500, message:'Error en la consulta sql...'})
            }else{
            res.status(200).json({status:200, message:'Stock encontrado exitosamente', data:results })
            } 
        });
    }
});

router.get('/producto/:Precio',(req,res)=>{
    const Precio = req.params.Precio;

    if (!Precio){
        res.status(400).json({status:400,message:'El Precio es requerido.'})
    }else{
        const sql = 'select Id, Nombre, Stock, Precio from Producto where Precio =?';

        pool.query(sql,[Precio],(err,results)=>{
           if(err){
            res.status(500).json({status:500, message:'Error en la consulta sql...'})
            }else{
            res.status(200).json({status:200, message:'Precio encontrado exitosamente', data:results })
            } 
        });
    }
});

router.post('/producto',(req,res)=>{
    const producto = req.body;
    if (!producto.Nombre || !producto.Stock || !producto.Precio){
        return res.status(400).json({status:400,message:'Los parametros Nombre, Stock y Precio son requeridos'})
    }

     const sqlExiste = 'select count(*) as conteo from Producto where Nombre = ?';
     pool.query(sqlExiste,[producto.Nombre],(err,results)=>{
        if (err) {
            return res.status(500).json({status: 500, message:'Error en la consulta sql...' })
        }

        if (results[0].conteo>0){
            return res.status(400).json({ status:400, message: 'El producto ya existe..'});

        }

        const sql ='insert into Producto ( Nombre, Stock, Precio) values (?,?,?)';
        pool.query(sql,[ producto.Nombre, producto.Stock, producto.Precio],(err, results)=>{
            if (err){
                res.status(500).json({status:500, message:'Error en la consulta sql...'})
            }
            else{
                producto.Id = results.insertId;
                res.status(200).json({status:200, message:'Producto creado exitosamente', data:producto })
            }
        });
     });
});

router.put('/producto',(req,res)=>{
    const producto = req.body;

    if (!producto.Id){
        return res.status(400).json({status:400, message:'El Id es requerido...'});
    }
    if (!producto.Nombre || !producto.Stock || !producto.Precio){
        return res.status(400).json({status:400,message:'Los parametros Nombre, Stock y Precio son requeridos'})
    }

    const sql = 'update Producto set Nombre=?, Stock=?, Precio=? where Id=?';
    pool.query(sql,[producto.Nombre, producto.Stock, producto.Precio, producto.Id],(err, results)=>{
        if(err){
            res.status(500).json({status:500, message:'Error en la consulta sql...'})
        }else if(results.affectedRows === 0){
             res.status(404).json({status:404, message:'Producto no encontrado...'}) 
        }else {
            res.status(200).json({status:200, message:'Producto actualizado exitosamente', data:producto })
        }
    });
});

router.delete('/producto/:Id', (req,res)=>{
    const Id = parseInt(req.params.Id);

    if (!Id){
        return res.status(400).json ({status:400, message: 'El Id es requerido...'});
    }

    const sql = 'delete from Producto where Id=?';

    pool.query (sql,[Id], (err, results)=>{
        if (err){
            return res.status(500).json({status:500, message:'Error en la consulta sql...'})
        }
        
        if( results.affectedRows ===0){
            return res.status(404).json({status:404, message:'Error en la consulta sql...'})
        }

        return res.status(200).json({status:200, message:'Registro eliminado exitosamente...'})
    });
});




module.exports = router;