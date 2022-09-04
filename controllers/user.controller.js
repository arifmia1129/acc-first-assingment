const users = require("../user.json");

module.exports.randomUser = (req, res) => {
    const number = Math.random() * 5;
    const id = Math.ceil(number);
    const user = users.find(user => user.Id === id);
    res.send(user)
}

module.exports.allUser = (req, res) => {
    res.send(users);
}