const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/',(req,res) =>{
    const sql = 'select Id, Nombre, Telefono from Cliente';
    
    pool.query(sql,(err, results)=>{
        if(err){
            console.log('Error en la consulta sql...')
            res.status(500).json({status:500, message:'Error en la consulta sql...'})
        }else{
            res.status(200).json({status:200, message:'Success...', data:results })
        }
    });
});

router.get('/id/:Id',(req,res)=>{
    const Id = req.params.Id;

    if (!Id){
        res.status(400).json({status:400,message:'El Id es requerido.'})
    }else{
        const sql = 'select Id, Nombre, Telefono from Cliente where Id =?';

        pool.query(sql,[Id],(err,results)=>{
           if(err){
            res.status(500).json({status:500, message:'Error en la consulta sql...'})
            }else{
            res.status(200).json({status:200, message:'Success...', data:results })
            } 
        });
    }
});

router.post('/',(req,res)=>{
    const cliente = req.body;
    if (!cliente.Nombre || !cliente.Telefono){
        return res.status(400).json({status:400,message:'Los parametros Nombre y Telefono son requeridos'})
    }

     const sqlExiste = 'select count(*) as conteo from Cliente where Nombre = ?';
     pool.query(sqlExiste,[cliente.Nombre],(err,results)=>{
        if (err) {
            return res.status(500).json({status: 500, message:'Error en la consulta sql...' })
        }

        if (results[0].conteo>0){
            return res.status(400).json({ status:400, message: 'El cliente ya existe..'});

        }

        const sql ='insert into Cliente ( Nombre, Telefono) values (?,?)';
        pool.query(sql,[ cliente.Nombre, cliente.Telefono],(err, results)=>{
            if (err){
                res.status(500).json({status:500, message:'Error en la consulta sql...'})
            }
            else{
                cliente.Id = results.insertId;
                res.status(200).json({status:200, message:'success...', data:cliente })
            }
        });
     });
});

router.put('/',(req,res)=>{
    const cliente = req.body;

    if (!cliente.Id){
        return res.status(400).json({status:400, message:'El Id es requerido...'});
    }

    const sql = 'update Cliente set Nombre=?, Telefono=? where Id=?';
    pool.query(sql,[cliente.Nombre, cliente.Telefono, cliente.Id],(err, results)=>{
        if(err){
            res.status(500).json({status:500, message:'Error en la consulta sql...'})
        }else if(results.affectedRows === 0){
             res.status(404).json({status:404, message:'Cliente no encontrado...'}) 
        }else {
            res.status(200).json({status:200, message:'Success...', data:cliente })
        }
    });
});

router.delete('/:Id', (req,res)=>{
    const Id = parseInt(req.params.Id);

    if (!Id){
        return res.status(400).json ({status:400, message: 'El Id es requerido...'});
    }

    const sql = 'delete from Cliente where Id=?';

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