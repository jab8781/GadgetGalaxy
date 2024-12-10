const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    username: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    shippingCarrier: { type: String, required: true },
    shippingMethod: { type: String, required: true },
});

module.exports = mongoose.model('Shipping', shippingSchema);
