require('dotenv').config();

const express = require('express');
const https = require('https');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize app
const app = express();
app.use(bodyParser.json()); // Parse JSON request bodies

// HTTPS options
const options = {
  key: fs.readFileSync('/data/ist256.key'),
  cert: fs.readFileSync('/data/ist256.cert'),
};

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Handle preflight request
  }
  next();
});

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI);

client.connect()
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a simple route
app.get('/', (req, res) => {
  res.status(200).send('Secure HTTPS');
  console.log('Sending a response');
});

app.get('/hello', (req, res) => {
  res.send('Secure HTTPS');
});

// PUT route for user form submission
app.put('/api/join', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const db = client.db('team5DB');
        const collection = db.collection('users');

        // Upsert operation: update if username exists, insert if not
        const result = await collection.findOneAndUpdate(
            { username }, // Search by unique username
            { $set: { email, password } }, // Update these fields
            { returnDocument: 'after', upsert: true } // Create if doesn't exist
        );

        res.status(200).json({
            message: `User ${result.value ? 'updated' : 'created'} successfully!`,
        });
    } catch (error) {
        if (error.code === 11000) {
            // Error - username already exists
            return res.status(409).json({ message: 'Username already exists' });
        }

        console.error('Error handling user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// PUT route for product form submission
app.put('/api/products', async (req, res) => {
  try {
    const { productId, description, category, price } = req.body;

    if (!productId || !description || !category || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const db = client.db('team5DB');
    const collection = db.collection('products');

    // Upsert operation: update if productId exists, insert if not
    const result = await collection.findOneAndUpdate(
      { productId }, // Search by unique productId
      { $set: { description, category, price } }, // Update these fields
      { returnDocument: 'after', upsert: true } // Create if doesn't exist
    );

    res.status(200).json({
      message: `Product ${result.value ? 'updated' : 'created'} successfully!`,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Error - productId already exists
      return res.status(409).json({ message: 'Product ID already exists' });
    }

    console.error('Error handling product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET route for product search
app.get('/api/products/search', async (req, res) => {
    try {
        const { productId, description, category } = req.query;

        const query = {};
        if (productId) query.productId = productId; // Treat productId as a string
        if (description) query.description = new RegExp(description, 'i'); // Case-insensitive search
        if (category) query.category = category;

        const db = client.db('team5DB');
        const collection = db.collection('products');

        console.log('Search Query:', query); // Log the query to debug

        // Select only the desired fields and exclude _id
        const products = await collection.find(query).project({ productId: 1, description: 1, category: 1, price: 1, _id: 0 }).toArray();

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found matching the criteria.' });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET route to fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const db = client.db('team5DB');
    const collection = db.collection('products');
    const products = await collection.find({}).project({ productId: 1, description: 1, price: 1, _id: 0 }).toArray();

    // Convert price to number
    const sanitizedProducts = products.map(product => ({
      ...product,
      price: parseFloat(product.price)
    }));

    res.status(200).json(sanitizedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST route for purchase/checkout form submission
app.post('/api/purchases', async (req, res) => {
  try {
    const { username, products, total } = req.body;

    if (!username || !products || !total) {
      return res.status(400).json({ message: 'Purchase data is incomplete' });
    }

    const db = client.db('team5DB');
    const collection = db.collection('purchases');
    const newPurchase = { username, products, total, date: new Date() };
    await collection.insertOne(newPurchase);

    res.status(201).json({ message: 'Purchase saved successfully!' });
  } catch (error) {
    console.error('Error saving purchase:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST route for shipping form submission
app.post('/api/shipping', async (req, res) => {
    try {
        const db = client.db('team5DB');
        const collection = db.collection('shipping');
        
        const shippingData = req.body;
        await collection.insertOne(shippingData);
        
        res.status(201).json({ message: 'Shipping data submitted successfully!' });
    } catch (error) {
        console.error('Error saving shipping data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST route for billing form submission
app.post('/api/billing', async (req, res) => {
  try {
    const db = client.db('team5DB');
    const collection = db.collection('billing');
    const billingData = req.body;
    await collection.insertOne(billingData);

    res.status(201).json({ message: 'Billing data submitted successfully!' });
  } catch (error) {
    console.error('Error saving billing data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST route for return form submission
app.post('/api/returns', async (req, res) => {
  try {
    const db = client.db('team5DB');
    const collection = db.collection('returns');
    const returnData = req.body;
    await collection.insertOne(returnData);

    res.status(201).json({ message: 'Return processed successfully!' });
  } catch (error) {
    console.error('Error processing return:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start HTTPS server
https.createServer(options, app).listen(3005, () => {
    console.log('HTTPS server running on https://ist256.up.ist.psu.edu:3005');
});
