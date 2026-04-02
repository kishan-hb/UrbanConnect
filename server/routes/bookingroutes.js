const express = require('express');
const router = express.Router();
const {requireAuthentication} = require('../middleware/auth');
const {requireRole} = require('../middleware/role');
const {
  getAllBookings,
  getBookingById,
  createBooking
} = require('../controllers/bookingController');

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', requireAuthentication, requireRole('customer'), createBooking);

module.exports = router;
