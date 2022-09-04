const express = require("express");

const router = express.Router();
const userController = require("../../controllers/user.controller");

router.get("/random", userController.randomUser);
router.get("/all", userController.allUser);


module.exports = router;