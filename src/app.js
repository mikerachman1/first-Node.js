const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./models/customer');


const app = express();
mongoose.set('strictQuery', false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

const customers = [
  {
    "name": "Caleb",
    "industry": "music"
  },
  {
    "name": "John",
    "industry": "networking"
  },
  {
    "name": "Sal",
    "industry": "sports medicine"
  }
];

const customer = new Customer({
  name: 'John',
  industry: 'marketing'
});



app.get('/', (req, res) => {
  res.send("welcome!")
});

app.get('/api/customers', async (req, res) => {
  try {
    const result = await Customer.find();
    res.send({"customers": result})

  } catch(err) {
    res.status(500).json({error: err.message})
  }
});

app.post('/api/customers', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.post('/', (req, res) => {
  res.send('This is a post request!!!');
});



const start = async() => {
  try{
    await mongoose.connect(CONNECTION);

    app.listen(PORT, () => {
      console.log('App listening on port ' + PORT);
    });
  } catch(err) {
    console.log(err.message);
  }
};

start();