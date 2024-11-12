// models/user.model.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
      "User",
      {
          user_id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              allowNull: false,
              autoIncrement: true,
          },
          name: {
              type: DataTypes.STRING,
              allowNull: false,
              unique: {
                  msg: "Este nome de utilizador já está registado"
              },
              validate: {
                  notEmpty: {
                      msg: "O nome de utilizador é obrigatório"
                  },
                  notNull: {
                      msg: "O nome de utilizador é obrigatório"
                  },
                  len: {
                      args: [3, 50],
                      msg: "O nome deve ter entre 3 e 50 caracteres"
                  },
                  is: {
                      args: /^[a-zA-Z0-9_]+$/,
                      msg: "O nome só pode conter letras, números e underscore"
                  }
              }
          },
          email: {
              type: DataTypes.STRING,
              allowNull: false,
              unique: {
                  msg: "Este email já está registado"
              },
              validate: {
                  notEmpty: {
                      msg: "O email é obrigatório"
                  },
                  notNull: {
                      msg: "O email é obrigatório"
                  },
                  isEmail: {
                      msg: "Email inválido"
                  }
              }
          },
          password: {
              type: DataTypes.STRING,
              allowNull: false,
              validate: {
                  notEmpty: {
                      msg: "A palavra-passe é obrigatória"
                  },
                  notNull: {
                      msg: "A palavra-passe é obrigatória"
                  },
                  len: {
                      args: [8, 100],
                      msg: "A palavra-passe deve ter pelo menos 8 caracteres"
                  },
                  isStrongPassword(value) {
                      if (!/(?=.*\d)(?=.*[!@#$%^&*])/.test(value)) {
                          throw new Error(
                              "A palavra-passe deve conter pelo menos um número e um caractere especial"
                          );
                      }
                  },
              }
          },
          created_at: {
              type: DataTypes.DATE,
              defaultValue: DataTypes.NOW,
              allowNull: false
          }
      },
      {
          tableName: "user",
          timestamps: false
      }
  );
  return User;
};