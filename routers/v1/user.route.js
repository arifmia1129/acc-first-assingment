const express = require("express");

const router = express.Router();
const userController = require("../../controllers/user.controller");

router.get("/random", userController.randomUser);
router.get("/all", userController.allUser);
router.post("/save", userController.saveUser);
router.post("/update/:id", userController.updateUser);


module.exports = router;