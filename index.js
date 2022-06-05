const express = require("express");
const cors = require("cors");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const stripe = require("stripe")(process.env.PAYMENT_KEY);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;




app.use(cors({
    origin: "https://a-b-group.web.app"
}));
app.use(express.json());

header("Access-Control-Allow-Origin: https://a-b-group.web.app");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, X-Auto-Token, Origin, Authorization");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rkkub.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const verifyJWT = (req, res, next) => {
    const reqAuth = req?.headers?.authorization;
    if (!reqAuth) {
        return res.status(401).send({ message: "Unauthorized access" });
    }
    const token = reqAuth?.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Forbidden access." })
        }
        req.decoded = decoded;
        next();
    })
}

const options = {
    auth: {
        api_key: process.env.EMAIL_API
    }
}
const emailSenderClient = nodemailer.createTransport(sgTransport(options));

const bookingConfirmEmail = (bookingInfo) => {
    const { productId,
        product,
        orderQuantity,
        totalPrice,
        user,
        phone,
        address } = bookingInfo;
    const email = {
        from: process.env.EMAIL_SENDER,
        to: user,
        subject: `Your order booked for ${product}`,
        text: `Your order booked for ${product}`,
        html:
            `
        <div>
                <h2>Assalamu Alaikum Dear Sir/Mam,</h2>,
                <h1>We have receive your order.</h1>
                <h3>Your order details is :</h3>
                <ul>
                    <li>Order for: ${product}</li>
                    <li>Order quantity: ${orderQuantity}</li>
                    <li>Total price: ${totalPrice}</li>
                    <li>Contact No: ${phone}</li>
                    <li>Address: ${address}</li>
                </ul>
                <p>If you want confirm order please go to Dashboard panel and make sure payment.</p>
                <h2>Thanks for your order.</h2>
                <h2>Stay with us!</h2>
                <br />
                <br />
                <h1>A&B Group of Industries Ltd.</h1>
            </div>
        `
    };

    emailSenderClient.sendMail(email, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Message sent: ', info);
        }
    });
}
const paymentEmail = (paymentInfo) => {
    const {
        product,
        orderQuantity,
        totalPrice,
        user,
        tnxId } = paymentInfo;
    const email = {
        from: process.env.EMAIL_SENDER,
        to: user,
        subject: `Your payment is done for ${product}`,
        text: `Your payment is done for ${product}`,
        html:
            `
        <div>
                <h2>Assalamu Alaikum Dear Sir/Mam,</h2>,
                <h1>We have receive your payment.</h1>
                <h3>Your order details is :</h3>
                <ul>
                    <li>Order for: ${product}</li>
                    <li>Order quantity: ${orderQuantity}</li>
                    <li>Total price: ${totalPrice}</li>
                </ul>
                <p>Thank you for you payment. Now we are working for your order.</p>
                <h2>Stay with us!</h2>
                <br />
                <br />
                <h1>A&B Group of Industries Ltd.</h1>
            </div>
        `
    };

    emailSenderClient.sendMail(email, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Message sent: ', info);
        }
    });
}



async function run() {
    try {
        await client.connect();
        const productCollection = client.db("ab_group").collection("product");
        const bookingCollection = client.db("ab_group").collection("booking");
        const userCollection = client.db("ab_group").collection("user");
        const paymentCollection = client.db("ab_group").collection("payment");
        const reviewCollection = client.db("ab_group").collection("review");

        app.post("/create-payment-intent", async (req, res) => {
            const { price } = req.body;
            const paymentIntent = await stripe.paymentIntents.create({
                amount: price * 100,
                currency: "usd",
                payment_method_types: [
                    "card"
                ],
            });

            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        });


        const verifyAdmin = async (req, res, next) => {
            const adminRequester = req.decoded.email;
            const user = await userCollection.findOne({ email: adminRequester });
            if (user.role === "admin") {
                next();
            }
            else {
                res.status(403).send({ message: "Forbidden access!" })
            }
        }


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

        app.post("/product", verifyAdmin, async (req, res) => {
            const productInfo = req.body;
            const result = await productCollection.insertOne(productInfo);
            res.send(result);
        })

        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

        app.get("/booking", verifyJWT, async (req, res) => {
            const decodedEmail = req?.decoded?.email;
            const email = req?.query?.email;
            if (email === decodedEmail) {
                const query = { user: email };
                const result = await bookingCollection.find(query).toArray();
                return res.send(result);
            }
            return res.status(401).send({ message: "Unauthorized access" })
        })
        app.get("/all-booking", verifyJWT, verifyAdmin, async (req, res) => {
            const decodedEmail = req?.decoded?.email;
            const email = req?.query?.email;
            if (email === decodedEmail) {
                const query = {};
                const result = await bookingCollection.find(query).toArray();
                return res.send(result);
            }
            return res.status(401).send({ message: "Unauthorized access" })
        })
        app.get("/booking/:id", verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.findOne(query);
            return res.send(result);
        })
        app.post("/booking", async (req, res) => {
            const bookingInfo = req.body;
            const result = await bookingCollection.insertOne(bookingInfo);
            bookingConfirmEmail(bookingInfo);
            res.send(result);
        })
        app.delete("/booking/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })
        app.put("/booking/:id", verifyJWT, async (req, res) => {
            const id = req.params.id;
            const info = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: info,
            }
            const result = await bookingCollection.updateOne(filter, updateDoc, options);
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
        app.get("/user/:email", verifyJWT, async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const result = await userCollection.findOne(query);
            res.send(result);
        })
        app.get("/admin/:email", verifyJWT, async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await userCollection.findOne(query);
            const isAdmin = user?.role === "admin";
            res.send({ isAdmin });
        })
        app.get("/user", verifyJWT, verifyAdmin, async (req, res) => {
            const query = {};
            const result = await userCollection.find(query).toArray();
            res.send(result);
        })
        app.post("/payment", async (req, res) => {
            const paymentInfo = req.body;
            const result = await paymentCollection.insertOne(paymentInfo);
            paymentEmail(paymentInfo);
            res.send(result);
        })
        app.post("/review", async (req, res) => {
            const reviewInfo = req.body;
            const result = await reviewCollection.insertOne(reviewInfo);
            res.send(result);
        })

        app.get("/review", async (req, res) => {
            const query = {};
            const result = await reviewCollection.find(query).toArray();
            res.send(result);
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
