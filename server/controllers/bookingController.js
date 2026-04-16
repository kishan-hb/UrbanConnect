const Booking = require('../models/booking');
const User = require('../models/user');
const Service = require('../models/services');
const { isValidObjectId } = require('../utils/validateObjectId');
const { handleDuplicateKeyError } = require('../utils/handleduplicate');
const { validateRequiredFields } = require('../utils/validateRequiredFields');
const asyncHandler = require('../utils/asyncHandler');

function buildError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function getRequesterByClerkId(clerkId) {
  if (!clerkId) {
    throw buildError('Unauthorized', 401);
  }

  const requester = await User.findOne({ clerkId }).select('clerkId role');
  if (!requester) {
    throw buildError('User not found', 404);
  }

  return requester;
}

function canAccessBooking(requester, booking) {
  if (!requester || !booking) return false;
  if (requester.role === 'admin') return true;
  if (requester.role === 'customer' && booking.customerClerkId === requester.clerkId) return true;
  if (requester.role === 'provider' && booking.providerClerkId === requester.clerkId) return true;
  return false;
}

const getAllBookings = asyncHandler(async (req, res) => {
  const requester = await getRequesterByClerkId(req.auth?.userId);

  let filter = {};
  if (requester.role === 'provider') {
    filter = { providerClerkId: requester.clerkId };
  } else if (requester.role === 'customer') {
    filter = { customerClerkId: requester.clerkId };
  } else if (requester.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const bookings = await Booking.find(filter).sort({ createdAt: -1 });
  res.json(bookings);
});

const getBookingById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid booking id' });
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  const requester = await getRequesterByClerkId(req.auth?.userId);
  if (!canAccessBooking(requester, booking)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  res.json(booking);
});

const createBooking = asyncHandler(async (req, res) => {
  const { bookingId, serviceId, date, timeSlot } = req.body || {};
  const requiredFields = validateRequiredFields(req.body, ['bookingId', 'serviceId', 'date', 'timeSlot']);

  if (!requiredFields.isValid) {
    return res.status(400).json({
      message: `Missing required fields: ${requiredFields.missingFields.join(', ')}`
    });
  }

  const requester = await getRequesterByClerkId(req.auth?.userId);
  if (requester.role !== 'customer') {
    return res.status(403).json({ message: 'Forbidden: only customers can create bookings' });
  }

  const service = await Service.findOne({ serviceId });
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }

  const provider = await User.findOne({ clerkId: service.providerClerkId }).select(
    'clerkId role isActive approvedByAdmin'
  );

  if (!provider) {
    return res.status(404).json({ message: 'Provider not found' });
  }

  if (provider.role !== 'provider') {
    return res.status(400).json({ message: 'Selected user is not a provider' });
  }

  if (!provider.isActive || !provider.approvedByAdmin) {
    return res.status(400).json({ message: 'Provider is not available for booking' });
  }

  const booking = new Booking({
    bookingId,
    customerClerkId: requester.clerkId,
    providerClerkId: provider.clerkId,
    serviceId,
    date,
    timeSlot
  });

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    const duplicateError = handleDuplicateKeyError(err, 'bookingId', 'Booking ID already exists.');
    if (duplicateError.handled) {
      return res.status(duplicateError.status).json({ message: duplicateError.message });
    }

    throw buildError(err.message, 400);
  }
});

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking
};