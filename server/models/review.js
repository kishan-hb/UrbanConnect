const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    reviewId: { type: String, required: true, unique: true },
    bookingId: { type: String, required: true }, 
    customerClerkId: { type: String, required: true }, 
    providerClerkId: { type: String, required: true }, 
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
