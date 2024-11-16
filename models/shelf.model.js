// models/shelf.model.js
module.exports = (sequelize, DataTypes) => {
    const Shelf = sequelize.define("Shelf", {
        shelf_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        house_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'house',
                key: 'house_id'
            }
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Nome é obrigatório"
                }
            }
        },
        rfid_sensor_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "ID do sensor RFID é obrigatório"
                }
            }
        },
        weight_sensor_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "ID do sensor de peso é obrigatório"
                }
            }
        },
        max_weight: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30000,
            validate: {
                min: {
                    args: [0],
                    msg: "O peso máximo deve ser maior que 0"
                }
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'shelves',
        timestamps: false
    });

    return Shelf;
};