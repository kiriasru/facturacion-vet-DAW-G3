const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
require('dotenv').config();

const loginUser = async (req, res) => {
    const { Correo, Password } = req.body;

    if (!Correo || !Password) {
        return res.status(400).json({
            status: 400,
            message: 'El correo y la password son requeridos.',
        });
    }

    const sql = 'SELECT * FROM Usuario WHERE Correo = ?';
    pool.query(sql, [Correo], async (err, results) => {

        if (err) {
            return res.status(500).json({
                status: 500,
                message: 'Error en la consulta SQL...',
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                status: 401,
                message: 'Credenciales inválidas...',
            });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(Password, user.Password);

        if (!isMatch) {
            return res.status(401).json({
                status: 401,
                message: 'Credenciales inválidas...',
            });
        }

        const token = jwt.sign(
            { id: user.Id, correo: user.Correo },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            status: 200,
            message: 'Login exitoso...',
            token,
        });
    });
};

module.exports = loginUser