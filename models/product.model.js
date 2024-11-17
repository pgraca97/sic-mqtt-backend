// models/product.model.js
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("Product", {
        product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        shelf_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'shelves',
                key: 'shelf_id'
            }
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Nome é obrigatório"
                }
            }
        },
        rfid_tag: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: {
                msg: "Esta tag RFID já está registada"
            },
            validate: {
                notEmpty: {
                    msg: "Tag RFID é obrigatória"
                }
            }
        },
        container_weight: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [0],
                    msg: "O peso do recipiente deve ser maior que 0"
                }
            }
        },
        min_stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [0],
                    msg: "O stock mínimo deve ser maior que 0"
                }
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },        current_weight: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        max_capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [0],
                    msg: "A capacidade máxima deve ser maior que 0"
                }
            }
        },
        location_status: {
            type: DataTypes.ENUM('in_shelf', 'removed'),
            allowNull: false,
            defaultValue: 'in_shelf'
        }
    }, {
        tableName: 'products',
        timestamps: false
    });

    return Product;
};