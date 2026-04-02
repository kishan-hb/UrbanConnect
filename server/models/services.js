const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
    serviceId: { type: String, required: true, unique: true }, 
    providerClerkId: { type: String, required: true },
    category: { type: String, required: true, },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    availability: [{ type: String }], 
    location: {
        city: { type: String },
        area: { type: String }
    },
    createdAt: { type: Date, default: Date.now }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
