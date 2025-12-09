const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;

require('dotenv').config();

const authMiddleware  = require('./src/middlewares/authMiddleware.js');

const clientesRoutes = require('./src/routes/clientesRoute.js');
const usuariosRoutes = require('./src/routes/usuariosRoutes.js');
const productosRoutes = require('./src/routes/productosRoute.js');
const loginRoutes = require('./src/routes/loginRoute.js');
const registrarRoutes = require('./src/routes/registroRoute.js');
const detalleVentaRoutes = require('./src/routes/detalleVentaRoute.js');

app.use(express.json());
app.use(cors());

// Rutas protegidas
app.use('/clientes', authMiddleware, clientesRoutes);
app.use('/productos', authMiddleware, productosRoutes);
app.use('/usuarios', authMiddleware, usuariosRoutes);
app.use('/detalleVenta', authMiddleware, detalleVentaRoutes);

// Rutas publicas
app.use('/login', loginRoutes);
app.use('/registro', registrarRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});