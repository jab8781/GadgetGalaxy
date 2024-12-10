const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.put('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Upsert operation: update if username exists, insert if not
        const result = await User.findOneAndUpdate(
            { username }, // Search by unique username
            { email, password }, // Update these fields
            { new: true, upsert: true } // Create if username doesn't exist
        );

        res.status(200).json({
            message: `User ${result.wasNew ? 'created' : 'updated'} successfully!`,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        console.error('Error handling user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
