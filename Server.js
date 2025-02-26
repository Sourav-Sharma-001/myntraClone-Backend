const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ObjectId } = require('mongodb');
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Ensure bcrypt is imported
const verifyTokenMiddleware = require('./middleware') // This is your JWT verification middleware

// Database connection
mongoose.connect('mongodb+srv://BAHURJA:1234567889@cluster0.hhwof.mongodb.net/localApp');
const app = express();

app.use(express.json());
app.use(cors());

// Register route (No authentication needed here)
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  res.status(201).send('User registered');
});

// Login route (No authentication needed here)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
});

// Protected route: Home Data
app.get('/home', verifyTokenMiddleware, async (req, res) => {
  const homeData = await mongoose.connection.db.collection('home').find({}).toArray();
  return res.send(homeData);
});

// Protected route: View Data
app.get('/view', verifyTokenMiddleware, async (req, res) => {
  const viewData = await mongoose.connection.db.collection('view').find({}).toArray();
  return res.send(viewData);
});

// Protected route: Get Product Details
app.get('/getProductDetails', verifyTokenMiddleware, async (req, res) => {
  const viewData = await mongoose.connection.db
    .collection('view')
    .find({ _id: new ObjectId(req.query.id) })
    .toArray();
  return res.send(viewData);
});

// Start the server
const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`Your server is live on port ${port}`);
});
