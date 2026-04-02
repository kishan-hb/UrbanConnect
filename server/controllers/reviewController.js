const Review = require('../models/review');
const Booking = require('../models/booking');
const { isValidObjectId } = require('../utils/validateObjectId');
const { handleDuplicateKeyError } = require('../utils/handleduplicate');
const { validateRequiredFields } = require('../utils/validateRequiredFields');
const { formatValidationError } = require('../utils/formatValidationError');

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

const getReviewById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { reviewId, bookingId, providerClerkId, rating, comment } = req.body || {};
    const requiredFields = validateRequiredFields(req.body, ['reviewId', 'bookingId', 'providerClerkId', 'rating']);

    if (!requiredFields.isValid) {
      return res.status(400).json({
        message: `Missing required fields: ${requiredFields.missingFields.join(', ')}`
      });
    }

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (
      booking.customerClerkId !== req.auth.userId ||
      booking.providerClerkId !== providerClerkId
    ) {
      return res.status(400).json({ message: 'Review does not match the booking' });
    }

    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review for this booking already exists' });
    }

    const review = new Review({
      reviewId,
      bookingId,
      customerClerkId: req.auth.userId,
      providerClerkId,
      rating,
      comment
    });

    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    const duplicateError = handleDuplicateKeyError(err, 'reviewId', 'Review ID already exists.');
    if (duplicateError.handled) {
      return res.status(duplicateError.status).json({ message: duplicateError.message });
    }

    const validationError = formatValidationError(err);
    if (validationError.handled) {
      return res.status(validationError.status).json({ message: validationError.message });
    }

    next({ status: 400, message: err.message });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview
};
