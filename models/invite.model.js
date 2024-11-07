const { user } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Invite = sequelize.define(
    "Invite",
    {
      invite_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: true,
      },
      house_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "house",
          key: "house_id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "user_id",
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "declined"),
        defaultValue: "pending",
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "invite",
      timestamps: false,
    }
  );
  return Invite;
};
