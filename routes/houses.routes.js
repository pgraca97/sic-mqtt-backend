// Importing the express module
const express = require("express");
// Creating an instance of the express router
const router = express.Router();

// Import middleware to check for authentication
const checkAuth = require("../middleware/check-auth.js");

// import house controller middleware
const houseController = require("../controllers/house.controller.js");

router.route("/").post(checkAuth, houseController.register); // PRIVATE

router.route("/:house_id").patch(checkAuth, houseController.update); // PRIVATE

router
  .route("/:house_id/invites")
  .post(checkAuth, houseController.createInvite); // PRIVATE

// router.route("/").get(checkAuth, houseController.findAll);

router.all("*", (req, res) => {
  res.status(404).json({ message: "StockWise: what???" }); //send a predefined error message
});

//export this router
module.exports = router;
