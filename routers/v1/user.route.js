const express = require("express");
const axios = require('axios');

const router = express.Router();
const users = require("../../user.json");

router.get("/random", async (req, res) => {
    const number = Math.random() * 5;
    const id = Math.ceil(number);
    const user = users.find(user => user.Id === id);
    res.send(user)
})


module.exports = router;