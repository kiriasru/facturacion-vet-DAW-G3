const express = require("express");
const {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
} = require("../controllers/productosController");

const router = express.Router();

router.get("/", getProductos);
router.get("/:id", getProductoById);
router.post("/", createProducto);
router.put("/:id", updateProducto);
router.delete("/:id", deleteProducto);

module.exports = router;