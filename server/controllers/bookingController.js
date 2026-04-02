const Booking = require('../models/booking');
const User = require('../models/user');
const Service = require('../models/services');
const { isValidObjectId } = require('../utils/validateObjectId');
const { handleDuplicateKeyError } = require('../utils/handleduplicate');
const { validateRequiredFields } = require('../utils/validateRequiredFields');

const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid booking id' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
};



const createBooking = async (req, res, next) => {
  try {
    const { bookingId, serviceId, date, timeSlot, status, paymentStatus } = req.body || {};
    const requiredFields = validateRequiredFields(req.body, ['bookingId', 'serviceId', 'date', 'timeSlot']);

    if (!requiredFields.isValid) {
      return res.status(400).json({
        message: `Missing required fields: ${requiredFields.missingFields.join(', ')}`
      });
    }

    const customer = await User.findOne({ clerkId: req.auth.userId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (customer.role !== 'customer') {
      return res.status(400).json({ message: 'Selected user is not a customer' });
    }

    const service = await Service.findOne({ serviceId: serviceId });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const provider = await User.findOne({ clerkId: service.providerClerkId });
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    if (provider.role !== 'provider') {
      return res.status(400).json({ message: 'Selected user is not a provider' });
    }

   const booking = new Booking({
  bookingId,
  customerClerkId: req.auth.userId,
  providerClerkId: service.providerClerkId,
  serviceId,
  date,
  timeSlot,
  status,
  paymentStatus
});


    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    const duplicateError = handleDuplicateKeyError(err, 'bookingId', 'Booking ID already exists.');
    if (duplicateError.handled) {
      return res.status(duplicateError.status).json({ message: duplicateError.message });
    }

    next({ status: 400, message: err.message });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking
};
