let products = [
    { id: 1, name: "mobile" },
    { id: 2, name: "laptop" },
    { id: 3, name: "watch" },
    { id: 4, name: "desktop" }
]

module.exports.getAllProduct = (req, res) => {

    products.push(req.body);
    // res.send(products);
    res.status(200).send({
        success: true,
        message: "Success",
        data: products
    })
    // res.status(500).send({
    //     success: false,
    //     error: "Internal sever error"
    // })
}

module.exports.saveAProduct = (req, res) => {
    res.send("Your product have successfully saved!")
}


module.exports.productDetails = (req, res, next) => {
    res.send("Specific product details!");
}

module.exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const existingData = products.find(product => product.id === Number(id));
    existingData.name = data.name;
    res.send(products);
}
module.exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    products = products.filter(product => product.id !== Number(id));
    res.send(products);
}