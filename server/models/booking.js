const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    bookingId: { type: String, required: true, unique: true }, 
    customerClerkId: { type: String, required: true },
    providerClerkId: { type: String, required: true }, 
    serviceId: { type: String, required: true },
    serviceTitle: { type: String },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true,   match: [/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'Please use a valid time slot format (HH:MM-HH:MM).']
 },
    customerDetails: {
        fullName: { type: String },
        email: { type: String },
        phone: { type: String },
        address: { type: String },
        city: { type: String },
        zipCode: { type: String },
        instructions: { type: String }
    },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'paid', 'refunded'], 
        default: 'pending' 
    },
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
