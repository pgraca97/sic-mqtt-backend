const express = require("express");
const router = express.Router();
const shelfController = require("../controllers/shelf.controller");
const checkAuth = require("../middleware/check-auth");

router.get("/house/:house_id", checkAuth, shelfController.findByHouse);

module.exports = router;