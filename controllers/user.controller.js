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

module.exports.saveUser = (req, res) => {
    const user = req.body;
    if (!user.Id) {
        res.send("Id property missing. Please included user ID.");
    }
    else if (!user.gender) {
        res.send("Gender property missing. Please included user Gender.");
    }
    else if (!user.name) {
        res.send("Name property missing. Please included user Name.");
    }
    else if (!user.contact) {
        res.send("Contact property missing. Please included user Contact.");
    }
    else if (!user.address) {
        res.send("Address property missing. Please included user Address.");
    }
    else if (!user.photoUrl) {
        res.send("PhotoUrl property missing. Please included user photoUrl.");
    }
    else {
        users.push(user);
        res.send(users);
    }

}