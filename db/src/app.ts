// SERVER SETUP

const express = require('express');
const mongoose = require('mongoose');
import {Customer} from './models/customer';
const cors = require('cors');
import { Request, Response } from 'express';

const app = express();
mongoose.set('strictQuery', false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

// CREATE

app.post('/api/customers', async (req: Request, res: Response) => {
  console.log(req.body);
  const customer = new Customer(req.body);
  try {
    await customer.save();
    // destructured property customer that contains nested data
    res.status(201).json({customer})
  } catch(e) {
    res.status(400).json({error: e.message});
  }
});

// READ

app.get('/', (req: Request, res: Response) => {
  res.send("welcome!!!!")
});

app.get('/api/customers', async (req: Request, res: Response) => {
  try {
    const result = await Customer.find();
    res.send({"customers": result})

  } catch(err) {
    res.status(500).json({error: err.message})
  }
});

app.get('/api/customers/:id', async (req: Request, res: Response) => {
  console.log({
    // different paths, like a file structure
    requestParams: req.params,
    // extra data passed after ? in url ex: ?age=50&state=ohio
    requestQuery: req.query
  });
  try{
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    console.log(customer);
    if (!customer) { 
      res.status(404).json({error: 'no user found'});
    } else {
      res.json({customer});
    }
  } catch(e) {
    res.status(500).json({error: 'something went wrong'})
  }
});

app.get('/api/orders/:id', async (req: Request, res: Response) => {
  console.log({requestParams: req.params});
  try {
    const orderId = req.params.id;
    const order = await Customer.findOne({'orders._id': orderId});
    console.log(order);
    if (order) {
      res.json({order});
    } else {
      res.status(404).json({error: 'no order found'});
    }
  } catch(e) {
    console.log(e);
    res.status(500).json({error: 'something went wrong'});
  }
});

// UPDATE

app.put('/api/customers/:id', async(req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findOneAndReplace({_id: customerId}, req.body, {new: true});
    res.json({customer});  
  } catch(e) {
    res.status(500).json({error: 'something went wrong'});
  }
});

app.patch('/api/customers/:id', async(req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findOneAndUpdate({_id: customerId}, req.body, {new: true});
    res.json({customer});  
  } catch(e) {
    res.status(500).json({error: 'something went wrong'});
  }
})

app.patch('/api/orders/:id', async(req: Request, res: Response) => {
  console.log(req.params)
  const orderId = req.params.id;
  // so updated order doesnt have new Id set by mongo
  req.body._id = orderId;
  try {
    const result = await Customer.findOneAndUpdate(
      {'orders._id': orderId},
      { $set: { 'orders.$': req.body } }, 
      { new: true }
    );
    if(result) {
      res.json({result})
    } else {
      res.status(404).json({error: 'Something went wrong'});
    }
  } catch(e) {
    console.log(e.message);
    res.status(500).json({error: 'Something went wrong'});
  }
});

// DESTROY

app.delete('/api/customers/:id', async(req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.deleteOne({_id: customerId});
    res.json({deletedCount: result.deletedCount});
  } catch(e) {
    res.status(500).json({error: 'something went wrong'});
  }
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