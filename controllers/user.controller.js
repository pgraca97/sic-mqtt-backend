require("dotenv").config();

// Importing the bcrypt library
const bcrypt = require("bcrypt");

// Importing the jsonwebtoken library
const jwt = require("jsonwebtoken");

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

/**
 * Logs in a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.login = async (req, res) => {
  try {
    // Extract the email and password from the request body
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Please provide an email and a password.",
      });
    }

    // Find the user with the provided email
    const user = await db.user.findOne({ where: { email } });

    // If the user is not found, return a 404 response
    if (!user)
      return res.status(404).json({
        success: false,
        msg: "User not found.",
      });

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        {
          email: user.email,
          user_id: user.user_id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWT_EXPIRATION_TIME,
        }
      );
      res.status(200).json({
        success: true,
        msg: "Auth successful",
        accessToken: token,
      });
    } else {
      // If the password is incorrect, return a 400 response
      res.status(400).json({
        success: false,
        msg: "Auth failed",
      });
    }
  } catch (err) {
    // If an error occurs, return a 500 response with an error message
    res.status(500).json({
      success: false,
      msg: err.message || "Some error occurred while logging in.",
    });
  }
};

/**
 * Retrieves all houses for the authenticated user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.findAllHouses = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const noParam = user_id == ":user_id";

    const authenticatedUser = req.userData.user_id;

    if (authenticatedUser != user_id) {
      return res.status(400).json({
        success: false,
        msg: "User ID does not match the authenticated user.",
      });
    }

    if (noParam) {
      return res.status(400).json({
        success: false,
        msg: "Please provide a user id",
      });
    }

    // Fetch all houses associated with the authenticated user
    const houses = await db.house.findAll({ where: { user_id } });

    if (houses.length == 0) {
      return res.status(404).json({
        success: false,
        msg: "No houses found for this user.",
      });
    }

    // Return the houses in the response
    res.status(200).json({
      success: true,
      data: houses,
    });
  } catch (err) {
    // If an error occurs, return a 500 response with an error message
    res.status(500).json({
      success: false,
      msg: err.message || "Some error occurred while retrieving houses.",
    });
  }
};
