const express = require('express');
const Return = require('../models/Return');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const returnData = new Return(req.body);
        await returnData.save();
        res.status(201).json({ message: 'Return processed successfully!' });
    } catch (error) {
        console.error('Error processing return:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
