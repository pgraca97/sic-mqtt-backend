// Importing the express module
const express = require("express");
// Creating an instance of the express router
const router = express.Router();

// import user controller middleware
const userController = require("../controllers/user.controller.js");

router.route("/").post(userController.create); // PUBLIC

router.all("*", (req, res) => {
  res.status(404).json({ message: "CodeMaster: what???" }); //send a predefined error message
});

//export this router
module.exports = router;