const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    ownerName: { type: String, required: true },
    carModel: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    rentPrice: { type: Number, required: true },
    contactInfo: { type: String, required: true }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
