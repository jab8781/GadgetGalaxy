const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.put('/', async (req, res) => {
    try {
        const { productId, description, category, price } = req.body;

        if (!productId || !description || !category || !price) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Upsert operation: update if productId exists, insert if not
        const result = await Product.findOneAndUpdate(
            { productId }, // Search by unique productId
            { description, category, price }, // Update these fields
            { new: true, upsert: true } // Create if productId doesn't exist
        );

        res.status(200).json({
            message: `Product ${result ? 'updated' : 'created'} successfully!`,
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
router.get('/search', async (req, res) => {
    try {
        const { productId, description, category } = req.query;

        const query = {};
        if (productId) query.productId = productId;
        if (description) query.description = new RegExp(description, 'i'); // Case-insensitive search
        if (category) query.category = category;

        // Select only the desired fields and exclude _id
        const products = await Product.find(query).select('productId description category price -_id');

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
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({}).select('productId description price -_id');
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
