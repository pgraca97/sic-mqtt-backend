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

    // Register the house and the user as the owner in the user_house table
    await db.userHouse.create({
      user_id: owner_id,
      house_id: house.house_id,
      role: "owner",
      created_at: new Date(),
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

exports.update = async (req, res) => {
  try {
    const house_id = req.params.house_id;
    const noParam = house_id == ":house_id";

    if (noParam) {
      return res.status(400).json({
        success: false,
        message: "House ID is required",
      });
    }

    // check if the user trying to update the house is the owner of the house
    const owner_id = req.userData.user_id;
    const userHouse = await db.userHouse.findOne({
      where: { user_id: owner_id, house_id, role: "owner" },
    });

    if (!userHouse) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this house",
      });
    }

    // Extracting the house data from the request body
    const { name, min_temperature, max_temperature } = req.body;

    if (min_temperature > max_temperature) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum temperature cannot be greater than maximum temperature",
      });
    }

    // Attempt to update the house with the provided data
    let affectedRows = await db.house.update(req.body, {
      where: {
        user_id: owner_id,
      },
    });

    // If no rows were affected, return a success message indicating no updates were made
    if (affectedRows[0] === 0) {
      return res.status(200).json({
        success: true,
        msg: `No updates were made to house with ID ${house_id}.`,
      });
    }

    // Return a success message indicating the house was updated successfully
    return res.json({
      success: true,
      msg: `House with ID ${house_id} was updated successfully.`,
    });
  } catch (err) {
    // If a validation error occurs, return a 400 response with error messages
    if (err instanceof ValidationError)
      return res.status(400).json({
        success: false,
        msg: err.errors.map((e) => e.message),
      });

    // If an error occurs, return a 500 response with an error message
    res.status(500).json({
      success: false,
      msg: `Error retrieving user with ID ${req.params.user_id}.`,
    });
  }
};
