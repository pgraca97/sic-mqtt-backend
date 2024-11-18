// models/invite.model.js
module.exports = (sequelize, DataTypes) => {
  const Invite = sequelize.define("Invite", {
    invite_id: {
      type: DataTypes.STRING,  // Mantém como string mas remove auto_increment
      primaryKey: true,
      allowNull: false,
      // Removido autoIncrement pois não funciona com STRING
    },
    house_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "house",
        key: "house_id"
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "user_id"
      }
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "declined"),
      allowNull: false,
      defaultValue: "pending"
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: "invite",
    timestamps: false
  });

  return Invite;
};