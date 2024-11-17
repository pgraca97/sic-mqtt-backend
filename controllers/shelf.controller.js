// controllers/shelf.controller.js
const db = require("../models");
const Shelf = db.shelf;

exports.findByHouse = async (req, res) => {
    try {
        const house_id = req.params.house_id;
        
        const shelves = await Shelf.findAll({
            where: { house_id },
            include: [{
                model: db.product,
                attributes: [
                    'product_id', 'name', 'rfid_tag', 
                    'container_weight', 'min_stock',
                    'current_weight', 'max_capacity', 'location_status' 
                ]
            }],
            order: [['created_at', 'ASC']]
        });

        if (!shelves.length) {
            return res.status(404).json({
                success: false,
                message: "Nenhuma prateleira encontrada para esta casa"
            });
        }

        res.json({
            success: true,
            data: shelves
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Erro ao buscar prateleiras"
        });
    }
};