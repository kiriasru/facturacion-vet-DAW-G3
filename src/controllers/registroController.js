const bcrypt = require("bcrypt");
const pool = require("../config/db");

const registroUsuario = async (req, res) => {
    const user = req.body;

    if (!user.Nombre || !user.Password) {
        return res.status(400).json({
            status: 400,
            message: "Nombre y Password son requeridos.",
        });
    }

    const saltRound = 10;
    const passwordHash = await bcrypt.hash(user.Password, saltRound);

    const sql =
        "INSERT INTO Usuario (Nombre, Correo, Password) VALUES (?, ?, ?)";
    pool.query(
        sql,
        [user.Nombre, user.Correo, passwordHash],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: "Error en la consulta SQL...",
                });
            }
            return res.status(201).json({
                status: 201,
                message: "Usuario creado exitosamente...",
                data: results,
            });
        }
    );
};

module.exports = registroUsuario