const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: Number, required: true, unique: true }, // Enforce unique productId
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema);
