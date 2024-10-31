// Importing the bcrypt library
const bcrypt = require("bcrypt");

// Importing Sequelize errors
const { ValidationError, UniqueConstraintError } = require("sequelize");

// Importing all the models
const db = require("../models/index.js");

/**
 * Creates a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.register = async (req, res) => {
  try {
    // Extracts the password property from the request body
    const { password } = req.body;

    // Validate the password
    // Create a temporary instance of the User model with only the password set
    const userInstance = db.user.build({ password });

    // Validate only the password field
    try {
      await userInstance.validate({ fields: ["password"] });
    } catch (error) {
      // If there are validation errors in the password, return them
      return res.status(400).json({
        success: false,
        msg: error.errors.map((e) => e.message),
      });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add the hashed password to the request body
    req.body.password = hashedPassword;

    // Extract necessary user data from the request body
    const userdata = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    // Save the user in the database
    let newUser = await db.user.create(userdata);

    // If the user is created successfully, return a 201 response with the user data
    res.status(201).json({
      success: true,
      data: {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    // If a validation error occurs, return a 400 response with error messages
    if (err instanceof ValidationError)
      res.status(400).json({
        success: false,
        msg: err.errors.map((e) => e.message),
      });
    // If a unique index error occurs, return a 400 response with error messages
    else if (err instanceof UniqueConstraintError)
      res.status(400).json({
        success: false,
        msg: err.errors.map((e) => e.message),
      });
    // If an error occurs, return a 500 response with an error message
    else
      res.status(500).json({
        success: false,
        msg: err.message || "Some error occurred while creating the user.",
      });
  }
};
