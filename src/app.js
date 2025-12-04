const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const pool = require('./config/db');
const app = express();
const PORT = 3000;

app.use(express.json());




app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});