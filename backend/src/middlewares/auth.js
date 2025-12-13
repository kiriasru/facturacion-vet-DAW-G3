const jwt = require("jsonwebtoken");
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({
            status: 401,
            message: "El token es obligatorio...",
        });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({
                status: 401,
                message: "Token invalido o expirado...",
            });
        }

        req.user = user;
        next();
    });
};

module.exports = { authMiddleware, SECRET_KEY };