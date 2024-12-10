const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    username: { type: String, required: true },
    products: [
        {
            description: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
