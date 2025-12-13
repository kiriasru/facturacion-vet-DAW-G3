const express = require("express");
const productos = require("./controllers/productosController");

const router = express.Router();

router.get("/", productos.getProductos);
router.get("/:id", productos.getProductoById);
router.post("/", productos.createProducto);
router.put("/:id", productos.updateProducto);
router.delete("/:id", productos.deleteProducto);

module.exports = router;
