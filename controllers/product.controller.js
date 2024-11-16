// controllers/product.controller.js
const db = require("../models");
const Product = db.product;

exports.findByShelf = async (req, res) => {
    try {
        const shelf_id = req.params.shelf_id;
        
        const products = await Product.findAll({
            where: { shelf_id },
            order: [['name', 'ASC']]
        });

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Erro ao buscar produtos"
        });
    }
};

exports.create = async (req, res) => {
    try {
        const { name, rfid_tag, container_weight, min_stock, shelf_id } = req.body;

        const product = await Product.create({
            name,
            rfid_tag,
            container_weight,
            min_stock,
            shelf_id
        });

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Erro ao criar produto"
        });
    }
};