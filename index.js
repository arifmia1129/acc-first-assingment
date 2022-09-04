const express = require("express");
const cors = require("cors");
const dbConnect = require("./utils/dbConnect");
const app = express();
const port = process.env.PORT || 5000;
const productRoutes = require("./routers/v1/product.route.js");
const userRoutes = require("./routers/v1/user.route.js");
const viewCount = require("./middleware/viewCount");

app.use(cors({
    origin: 'https://a-b-group.web.app'
}));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// app.use(viewCount);


dbConnect();

app.use("/api/v1/product", productRoutes);
app.use("/user", userRoutes);


app.get("/", (req, res) => {
    // res.sendFile(__dirname + "/public/test.html");
    res.render("home.ejs", {
        id: 2,
        user: {
            name: "arif"
        }
    })
})

app.all("*", (req, res) => {
    res.send("No route found!");
})

app.listen(port, () => {
    console.log(`A&B Group app listening on port ${port}`);
})
