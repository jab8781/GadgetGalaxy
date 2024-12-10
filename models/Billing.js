const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    username: { type: String, required: true },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    creditCardCompany: { type: String, required: true },
    creditCardNumber: { type: String, required: true },
    expirationDate: { type: String, required: true }
});

module.exports = mongoose.model('Billing', billingSchema);
