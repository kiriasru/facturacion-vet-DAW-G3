const express = require('express');
require('dotenv').config();
const app = express();
const PORT = 3000;

const { authMiddleware } = require('./src/middlewares/auth');

const clientesRoutes = require('./src/routes/routes-clientes');
const usuariosRoutes = require('./src/routes/routes-usuarios');
const productosRoutes = require('./src/routes/routes-productos');
const loginRoutes = require('./src/routes/routes-login');
const registrarRoutes = require('./src/routes/routes-registrar');

app.use(express.json());

// Rutas protegidas
app.use('/clientes', authMiddleware, clientesRoutes);
app.use('/productos', authMiddleware, productosRoutes);
app.use('/usuarios', authMiddleware, usuariosRoutes);

// Rutas publicas
app.use('/login', loginRoutes);
app.use('/registro', registrarRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});