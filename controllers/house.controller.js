const { ValidationError, UniqueConstraintError } = require("sequelize");
const db = require("../models"); // Adjust the path as necessary

exports.register = async (req, res) => {
  try {
    // Extracting the user data from the request body
    const { name, min_temperature, max_temperature } = req.body;

    if (!name || !min_temperature || !max_temperature) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (min_temperature > max_temperature) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum temperature cannot be greater than maximum temperature",
      });
    }

    const owner_id = req.userData.user_id;

    // Creating a new house record in the database
    const house = await db.house.create({
      user_id: owner_id,
      name,
      min_temperature,
      max_temperature,
    });

    // Responding with a success message
    res.status(201).json({
      success: true,
      message: "House registered successfully",
      data: house,
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
