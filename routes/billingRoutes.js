const express = require('express');
const Billing = require('../models/Billing');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const billingData = new Billing(req.body);
        await billingData.save();
        res.status(201).json({ message: 'Billing data submitted successfully!' });
    } catch (error) {
        console.error('Error saving billing data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
