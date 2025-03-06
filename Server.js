const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const authRouter = require("./Routes/authRouter");
const ensureAuthenticated = require("./middleware/auth");
require("dotenv").config();

mongoose.connect("mongodb+srv://BAHURJA:1234567889@cluster0.hhwof.mongodb.net/localApp");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);

app.get("/home", ensureAuthenticated, async (req, res) => {
    const homeData = await mongoose.connection.db.collection("home").find({}).toArray();
    return res.send(homeData);
});

app.get("/view", ensureAuthenticated, async (req, res) => {
    const viewData = await mongoose.connection.db.collection("view").find({}).toArray();
    return res.send(viewData);
});

app.get("/getProductsDetails", ensureAuthenticated, async (req, res) => {
    const viewData = await mongoose.connection.db.collection("view").find({ _id: new ObjectId(req.query.id) }).toArray();
    return res.send(viewData);
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
    console.log(`Your server is live on port ${port}`);
});
