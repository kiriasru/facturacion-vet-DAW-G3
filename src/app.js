const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const pool = require('./config/db');
const app = express();
const PORT = 3000;
const clientesRoutes = require('./routes/routes-clientes');

app.use(express.json());
app.use('/api', clientesRoutes)





app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});