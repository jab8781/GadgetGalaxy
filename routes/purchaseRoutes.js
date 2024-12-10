const express = require('express');
const Purchase = require('../models/Purchase');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { username, products, total } = req.body;

        if (!username || !products || !total) {
            return res.status(400).json({ message: 'Purchase data is incomplete' });
        }

        const newPurchase = new Purchase({ username, products, total });
        await newPurchase.save();

        res.status(201).json({ message: 'Purchase saved successfully!' });
    } catch (error) {
        console.error('Error saving purchase:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
