// controllers/product.controller.js
const db = require("../models");
const Product = db.product;
const { ValidationError } = require("sequelize");

exports.create = async (req, res) => {
    try {
        const {
            name,
            rfid_tag,
            shelf_id,
            container_weight,
            min_stock,
            max_capacity,
            current_weight,
            location_status = 'in_shelf'
        } = req.body;

        // Validar dados obrigatórios
        if (!name || !rfid_tag || !shelf_id || !container_weight || !min_stock || !max_capacity) {
            return res.status(400).json({
                success: false,
                message: "Todos os campos obrigatórios devem ser fornecidos"
            });
        }

        // Verificar se RFID já existe
        const existingProduct = await Product.findOne({ where: { rfid_tag } });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "RFID tag já registada"
            });
        }

        // Validações de negócio
        if (container_weight <= 0) {
            return res.status(400).json({
                success: false,
                message: "Peso do recipiente deve ser maior que 0"
            });
        }

        if (max_capacity <= container_weight) {
            return res.status(400).json({
                success: false,
                message: "Capacidade máxima deve ser maior que o peso do recipiente"
            });
        }

        if (min_stock <= 0 || min_stock > (max_capacity - container_weight)) {
            return res.status(400).json({
                success: false,
                message: "Stock mínimo inválido"
            });
        }

        // Criar produto
        const product = await Product.create({
            name,
            rfid_tag,
            shelf_id,
            container_weight,
            min_stock,
            max_capacity,
            current_weight: current_weight || container_weight,
            location_status
        });

        res.status(201).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Erro ao criar produto:', error);

        if (error instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                message: error.errors.map(e => e.message)
            });
        }

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

        // Validar se produto existe
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }

        // Se estiver a atualizar RFID, verificar duplicação
        if (updates.rfid_tag && updates.rfid_tag !== product.rfid_tag) {
            const existingProduct = await Product.findOne({
                where: { rfid_tag: updates.rfid_tag }
            });

            if (existingProduct) {
                return res.status(400).json({
                    success: false,
                    message: "RFID tag já registada"
                });
            }
        }

        // Atualizar produto
        await product.update(updates);

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

exports.findByShelf = async (req, res) => {
    try {
        const { shelf_id } = req.params;
        
        const products = await Product.findAll({
            where: { shelf_id },
            order: [['name', 'ASC']]
        });

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Erro ao buscar produtos"
        });
    }
};