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

module.exports.updateUser = (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const update = Object.keys(data)[0];
    if (isNaN(id) === true) {
        res.send("Sorry id should be number not string!")
    }
    else {
        if (id > 5) {
            res.send("Sorry! Id should be less than 5.")
        }
        else {
            const user = users.find(user => user.Id === Number(id));
            if (!user[`${update}`]) {
                res.send("Property name not matched with our server!")
            }
            else {
                user[`${update}`] = data[`${update}`];
                res.send(users);
            }
        }
    }
}
module.exports.bulkUpdateUser = (req, res) => {
    const data = req.body;

    for (let i = 0; i < data.length; i++) {
        const singleData = data[i];
        const Id = Object.keys(singleData)[0];
        const Info = Object.keys(singleData)[1];
        const id = singleData.Id;
        if (!Id || !Info) {
            res.send("Sorry your sending data is not valid! Demo data example: [{id:1, contact:'01849676331'}, {id:2, name:'AB Arif'}] ")
        }
        else {
            if (id > 5) {
                res.send("Sorry! Id should be less than 5.")
            }
            else {
                const user = users.find(user => user.Id === Number(id));
                if (!user[`${Info}`]) {
                    res.send("Property name not matched with our server!")
                }
                else {
                    user[`${Info}`] = singleData[`${Info}`];
                }
            }
        }
    }
    res.send(users);

}