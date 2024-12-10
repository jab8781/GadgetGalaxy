const express = require('express');
const Shipping = require('../models/Shipping');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const shippingData = new Shipping(req.body);
        await shippingData.save();
        res.status(201).json({ message: 'Shipping data submitted successfully!' });
    } catch (error) {
        console.error('Error saving shipping data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
