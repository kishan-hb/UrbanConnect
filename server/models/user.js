const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true }, 
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true,  unique: true, match: /^\S+@\S+\.\S+$/, message: 'Please enter a valid email address' },
    profilePicture: { type: String },
    role: { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
    phone: { type: String, match: [/^\+?\d{10,15}$/, 'Please use a valid phone number.'] 
    },
    isActive: { type: Boolean, default: true },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    servicesOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    bio: { type: String, maxlength: 500 },
    backgroundCheckStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rating: { type: Number, min: 0, max: 5 , default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    approvedByAdmin: { type: Boolean, default: false },
    documents: [{ type: String }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
