require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the public folder
app.use(express.static('public'));

// Import Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const shippingRoutes = require('./routes/shippingRoutes');
const billingRoutes = require('./routes/billingRoutes');
const returnRoutes = require('./routes/returnRoutes');

// Connect to database
connectDB();

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT'], allowedHeaders: ['Content-Type'] }));
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/returns', returnRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
