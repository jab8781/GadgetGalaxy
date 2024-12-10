const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    username: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    refundMethod: { type: String, enum: ['store-credit', 'original-payment'], required: true },
    products: [
        {
            description: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Return', returnSchema);
