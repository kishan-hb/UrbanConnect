const Review = require('../models/review');
const Booking = require('../models/booking');
const { isValidObjectId } = require('../utils/validateObjectId');
const { handleDuplicateKeyError } = require('../utils/handleduplicate');
const { validateRequiredFields } = require('../utils/validateRequiredFields');
const { formatValidationError } = require('../utils/formatValidationError');
const asyncHandler = require('../utils/asyncHandler');

function buildError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find();
  res.json(reviews);
});

const getReviewById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid review id' });
  }

  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  res.json(review);
});

const createReview = asyncHandler(async (req, res) => {
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

  if (booking.customerClerkId !== req.auth.userId || booking.providerClerkId !== providerClerkId) {
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

  try {
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

    throw buildError(err.message, 400);
  }
});

module.exports = {
  getAllReviews,
  getReviewById,
  createReview
};
