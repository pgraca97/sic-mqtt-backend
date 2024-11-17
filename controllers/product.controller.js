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

exports.updateProduct = async (req, res) => {
    try {
        const { product_id } = req.params;
        const updates = req.body;

        // Log para debug
        console.log('Atualizando produto:', {
            product_id,
            updates
        });

        // Validar se o produto existe
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }

        // Atualizar o produto
        await product.update(updates);

        // Log após atualização
        console.log('Produto atualizado:', {
            product_id,
            newState: product.toJSON()
        });

        res.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erro ao atualizar produto'
        });
    }
};