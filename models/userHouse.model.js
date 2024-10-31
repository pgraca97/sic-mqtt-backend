const { type } = require("os");
const { user } = require(".");
const { create } = require("domain");

module.exports = (sequelize, DataTypes) => {
  const UserHouse = sequelize.define(
    "UserHouse",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "user",
          key: "user_id",
        },
      },
      house_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "house",
          key: "house_id",
        },
      },
      role: {
        type: DataTypes.ENUM("owner", "member"),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Role cannot be empty",
          },
          notNull: {
            msg: "Role cannot be null",
          },
        },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      tableName: "user_house", // Specify the table name explicitly
      timestamps: false, // Disable automatic creation of `createdAt` and `updatedAt` columns
    }
  );
  return UserHouse;
};
