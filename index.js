const express = require("express");
const cors = require("cors");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rkkub.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("ab_group").collection("product");
        const bookingCollection = client.db("ab_group").collection("booking");
        const userCollection = client.db("ab_group").collection("user");

        app.get("/product", async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const product = await productCollection.findOne(filter);
            res.send(product);
        })
        app.patch("/product/:id", async (req, res) => {
            const id = req.params.id;
            const quantity = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: quantity,
            }
            const result = await productCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.get("/booking", async (req, res) => {
            const query = {};
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        })
        app.post("/booking", async (req, res) => {
            const bookingInfo = req.body;
            const result = await bookingCollection.insertOne(bookingInfo);
            res.send(result);
        })
        app.put("/user", async (req, res) => {
            const user = req.body;
            const { email } = user;
            const filter = { email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            }
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email }, process.env.SECRET_KEY, {
                expiresIn: "1d"
            })
            res.send({ result, token });
        })
    }
    finally {

    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server running for A&B Group Website!")
})

app.listen(port, () => {
    console.log(`A&B Group app listening on port ${port}`);
})
