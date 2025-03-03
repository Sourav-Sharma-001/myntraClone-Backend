const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const authRouter = require('./Routes/auth');
const ensureAuthenticated = require('./middleware/auth');



mongoose.connect('mongodb+srv://BAHURJA:1234567889@cluster0.hhwof.mongodb.net/localApp');
const app = express();

app.use(express.json());
app.use(cors());


app.use('/auth', authRouter);

app.get('/home', async (req, res) => {
  const homeData = await mongoose.connection.db.collection('home').find({}).toArray();
  return res.send(homeData);
});


app.get('/getProductsDetails', ensureAuthenticated, async (req, res) => {
  const viewData = await mongoose.connection.db.collection('view').find({_id, image}).toArray();
  return res.send(viewData);
});


app.get('/view', ensureAuthenticated, async (req, res) => {
  const viewData = await mongoose.connection.db
    .collection('view')
    .find({ _id: new ObjectId(req.query.id, name, title, price, thumbnail, discount) })
    .toArray();
  return res.send(viewData);
});


const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`Your server is live on port ${port}`);
});
