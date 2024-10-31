// Importing the express module
const express = require("express");
// Creating an instance of the express router
const router = express.Router();

// Import middleware to check for authentication
const checkAuth = require("../middleware/check-auth.js");

// import user controller middleware
const userController = require("../controllers/user.controller.js");

router.route("/").post(userController.register); // PUBLIC

router.route("/login").post(userController.login); // PUBLIC

router.route("/:user_id/houses").get(checkAuth, userController.findAllHouses); // PRIVATE

router.all("*", (req, res) => {
  res.status(404).json({ message: "StockWise: what???" }); //send a predefined error message
});

//export this router
module.exports = router;
