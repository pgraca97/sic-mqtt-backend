// routes/products.routes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const checkAuth = require("../middleware/check-auth");

// Rotas públicas
router.get("/shelf/:shelf_id", productController.findByShelf);

// Rotas protegidas
router.use(checkAuth); // Middleware de autenticação
router.post("/", productController.create);
router.patch("/:product_id", productController.updateProduct);

module.exports = router;