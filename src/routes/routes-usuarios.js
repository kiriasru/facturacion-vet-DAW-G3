const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    const sql = 'SELECT Id, Nombre, Correo FROM Usuario';
    pool.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                status: 500,
                message: 'Error en la consulta SQL...',
                data: null
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Consulta exitosa',
            data: results
        });

    });

});

router.get('/:id', (req, res) => {
    const Id = parseInt(req.params.id);

    if (!Id) {
        return res.status(400).json({
            status: 400,
            message: 'El Id es requerido.',
            data: null
        });
    }

    const sql = 'SELECT Id, Nombre, Correo FROM Usuario WHERE Id = ?';

    pool.query(sql, [Id], (err, results) => {

        if (err) {
            return res.status(500).json({
                status: 500,
                message: 'Error en la consulta SQL...',
                data: null
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Usuario no encontrado.',
                data: null
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Consulta exitosa',
            data: results[0]
        });

    });

});

router.get('/:nombre', (req, res) => {

    const Nombre = req.params.nombre;

    if (!Nombre) {
        return res.status(400).json({
            status: 400,
            message: 'El nombre es requerido.',
            data: null
        });
    }

    const sql = 'SELECT Id, Nombre, Correo FROM Usuario WHERE Nombre = ?';

    pool.query(sql, [Nombre], (err, results) => {

        if (err) {
            return res.status(500).json({
                status: 500,
                message: 'Error en la consulta SQL...',
                data: null
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Consulta exitosa',
            data: results
        });

    });

});

router.post('/', async (req, res) => {
  const user = req.body;

  if (!user.Nombre || !user.Password) {
    return res.status(400).json({
      status: 400,
      message: 'Nombre y Password son requeridos.'
    });
  }

  const saltRound = 10;
  const passwordHash = await bcrypt.hash(user.Password, saltRound);

  const sql = 'INSERT INTO Usuario (Nombre, Correo, Password) VALUES (?, ?, ?)';
  pool.query(sql, [user.Nombre, user.Correo, passwordHash], (err, results) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: 'Error en la consulta SQL...',
      });
    }
    return res.status(201).json({
      status: 201,
      message: 'Usuario creado exitosamente...',
      data: results
    });
  });
});

router.put('/:id', async (req, res) => {

    const Id = parseInt(req.params.id);
    const { Nombre, Correo, Password } = req.body;

    if (!Id) {
        return res.status(400).json({
            status: 400,
            message: 'El Id es requerido.',
        });
    }

    let campos = [];
    let valores = [];

    if (Nombre) {
        campos.push('Nombre = ?');
        valores.push(Nombre);
    }

    if (Correo) {
        campos.push('Correo = ?');
        valores.push(Correo);
    }

    if (Password) {
        const hashed = await bcrypt.hash(Password, 10);
        campos.push('Password = ?');
        valores.push(hashed);
    }

    if (campos.length === 0) {
        return res.status(400).json({
            status: 400,
            message: 'Debe enviar al menos un campo para actualizar.',
        });
    }

    valores.push(Id);

    const sql = `UPDATE Usuario SET ${campos.join(', ')} WHERE Id = ?`;

    pool.query(sql, valores, (err, results) => {

        if (err) {
            return res.status(500).json({
                status: 500,
                message: 'Error en la consulta SQL...',
            });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Usuario no encontrado.',
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Usuario actualizado exitosamente.',
        });

    });

});

router.delete('/:id', (req, res) => {

    const Id = parseInt(req.params.id);

    if (!Id) {
        return res.status(400).json({
            status: 400,
            message: 'El Id es requerido.',
        });
    }

    const sql = 'DELETE FROM Usuario WHERE Id = ?';

    pool.query(sql, [Id], (err, results) => {

        if (err) {
            return res.status(500).json({
                status: 500,
                message: 'Error en la consulta SQL...',
            });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Usuario no encontrado.',
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Usuario eliminado exitosamente.',
        });

    });

});

module.exports = router;