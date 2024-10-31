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
        type: DataTypes.STRING, // varchar(255)
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
      email: {
        type: DataTypes.STRING, // varchar(255)
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Email cannot be empty",
          },
          notNull: {
            msg: "Email cannot be null",
          },
          isEmail: {
            msg: "Invalid email address",
          },
        },
      },
      password: {
        type: DataTypes.STRING, // varchar(255)
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password cannot be empty",
          },
          notNull: {
            msg: "Password cannot be null",
          },
          len: {
            args: [8, 100], // Minimum 8 characters
            msg: "Password must be at least 8 characters long",
          },
          isStrongPassword(value) {
            // Check if the value contains at least one digit (\d) and one special character (!@#$%^&*)
            if (!/(?=.*\d)(?=.*[!@#$%^&*])/.test(value)) {
              // If the value doesn't meet the criteria, throw an error with a specific message
              throw new Error(
                "Password must contain at least one number and one special character"
              );
            }
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
      tableName: "user", // Specify the table name explicitly
      timestamps: false, // Disable automatic creation of `createdAt` and `updatedAt` columns
    }
  );
  return User;
};
