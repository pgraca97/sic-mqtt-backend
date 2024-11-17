const { ValidationError, UniqueConstraintError } = require("sequelize");
const db = require("../models"); // Adjust the path as necessary
const { generateInvite } = require("../utils/generateInvite");

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


/**
 * Obtém detalhes de uma casa específica com suas prateleiras e produtos
 */
exports.findOne = async (req, res) => {
  try {
      const house_id = req.params.house_id;
      const user_id = req.userData.user_id;

      // Verificar se o utilizador tem acesso à casa
      const userHouse = await db.userHouse.findOne({
          where: { user_id, house_id }
      });

      if (!userHouse) {
          return res.status(403).json({
              success: false,
              message: "Sem permissão para aceder a esta casa"
          });
      }

      // Buscar casa com prateleiras e produtos
      const house = await db.house.findOne({
          where: { house_id },
          include: [{
              model: db.shelf,
              include: [{
                  model: db.product,
                  attributes: [
                    'product_id', 'name', 'rfid_tag', 
                    'container_weight', 'min_stock',
                    'current_weight', 'max_capacity', 'location_status' 
                ]
              }]
          }]
      });

      if (!house) {
          return res.status(404).json({
              success: false,
              message: "Casa não encontrada"
          });
      }

      res.json({
          success: true,
          data: house
      });

  } catch (error) {
      console.error('Erro ao buscar detalhes da casa:', error);
      res.status(500).json({
          success: false,
          message: error.message || "Erro ao buscar detalhes da casa"
      });
  }
};

/**
 * Update a house by their ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
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
      msg: `Error retrieving house with ID ${req.params.house_id}.`,
    });
  }
};

/**
 * Create an invite for a house.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.createInvite = async (req, res) => {
  try {
    const house_id = req.params.house_id;
    const user_id = req.userData.user_id;
    const invite_id = generateInvite();
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Check if the user is the owner of the house
    const userHouse = await db.userHouse.findOne({
      where: { user_id, house_id, role: "owner" },
    });

    if (!userHouse) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create invites for this house",
      });
    }

    // Save the invite in the database
    await db.invite.create({
      invite_id,
      house_id,
      user_id,
      expires_at,
    });

    // Construct the invite URL
    const invite_url = `${req.protocol}://${req.get(
      "host"
    )}/invite/${invite_id}`;

    // Responding with a success message
    res.status(201).json({
      success: true,
      message: "Invite created successfully",
      data: invite_url,
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
      msg: `Error retrieving house with ID ${req.params.house_id}.`,
    });
  }
};

/**
 * Accept an invite for a house.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.acceptInvite = async (req, res) => {
  try {
    const invite_id = req.params.invite_id;
    const user_id = req.userData.user_id;

    // verify if the invite exists
    const invite = await db.invite.findOne({
      where: { invite_id },
    });

    // Verify if the invite didn't expire
    if (invite.expires_at < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invite expired",
      });
    }

    // Verify if the user is not already in the house
    const userHouse = await db.userHouse.findOne({
      where: { user_id, house_id: invite.house_id },
    });

    if (userHouse) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this house",
      });
    }

    // Add the user to the house
    await db.userHouse.create({
      user_id,
      house_id: invite.house_id,
      role: "member",
      created_at: new Date(),
    });

    // Delete the invite
    await db.invite.destroy({
      where: { invite_id },
    });

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "Successfully joined the house",
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
      msg: `Error retrieving house with ID ${req.params.house_id}.`,
    });
  }
};
