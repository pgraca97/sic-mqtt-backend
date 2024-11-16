module.exports = (sequelize, DataTypes) => {
  const House = sequelize.define(
    "House",
    {
      house_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "user_id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name cannot be empty",
          },
          notNull: {
            msg: "Name cannot be null",
          },
        },
      },
      min_temperature: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Minimum temperature cannot be empty",
          },
          notNull: {
            msg: "Minimum temperature cannot be null",
          },
          isInt: {
            msg: "Minimum temperature must be an integer",
          },
        },
        min: {
          args: [0],
          msg: "Minimum temperature must be greater than or equal to 0",
        },
      },
      max_temperature: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Maximum temperature cannot be empty",
          },
          notNull: {
            msg: "Maximum temperature cannot be null",
          },
          isInt: {
            msg: "Maximum temperature must be an integer",
          },
          min: {
            args: [0],
            msg: "Maximum temperature must be greater than or equal to 0",
          },
        },
      },
      buffer_zone: {
        type: DataTypes.DECIMAL(4,2),
        allowNull: false,
        defaultValue: 1.0,
        validate: {
          min: 0.1,
          max: 5.0
        }
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      tableName: "house", // Specify the table name explicitly
      timestamps: false, // Disable automatic creation of `createdAt` and `updatedAt` columns
    }
  );
  return House;
};
