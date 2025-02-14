const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ObjectId } = require('mongodb');
// const jwt = require('jsonwebtoken');

mongoose.connect('mongodb+srv://BAHURJA:1234567889@cluster0.hhwof.mongodb.net/localApp');
const app = express();

app.use(express.json());
app.use(cors());

// app.post('/login', async (req, res) => {
//   const token = jwt.sign({ time: Date.now() }, 'shhhhh');
//   return res.send(token);
// });

// const users = require('./user');

// app.post('/login', async (req, res) => {
//   const user = new users(req.body);
//   const result = await user.save();
//   res.send(result);
// })


app.get('/home', async (req, res) => {
  const homeData = await mongoose.connection.db.collection('home').find({}).toArray();
  return res.send(homeData);
});

app.get('/view', async (req, res) => {
  const viewData = await mongoose.connection.db.collection('view').find({}).toArray();
  return res.send(viewData);
});

app.get('/getProductDetails', async (req, res) => {
const viewData = await mongoose.connection.db
  .collection('view')
  .find({ _id: new ObjectId(req.query.id) })
  .toArray();
  return res.send(viewData);
});

const port = process.env.PORT || 4001;
app.listen(port, (req, res) => {
  console.log(`Your server is on http://localhost:${port}/`);
});