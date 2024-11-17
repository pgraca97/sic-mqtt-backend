// routes/products.routes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const checkAuth = require("../middleware/check-auth");

router.get("/shelf/:shelf_id", checkAuth, productController.findByShelf);
router.post("/", checkAuth, productController.create);
router.patch("/:product_id", checkAuth, productController.updateProduct);


module.exports = router;