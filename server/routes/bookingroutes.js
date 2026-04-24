const express = require('express');
const router = express.Router();
const { requireAuthentication } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const {
  getAllBookings,
  getBookingById,
  createBooking,
  confirmBookingAdmin,
  cancelBookingAdmin,
  completeBookingAdmin,
  acceptBookingProvider,
  rejectBookingProvider,
  deleteBookingAdmin,
} = require('../controllers/bookingController');

router.get('/', requireAuthentication, getAllBookings);
router.get('/:id', requireAuthentication, getBookingById);
router.post('/', requireAuthentication, requireRole('customer'), createBooking);
router.delete('/:id', requireAuthentication, requireRole('admin'), deleteBookingAdmin);

router.patch('/:id/confirm', requireAuthentication, requireRole('admin'), confirmBookingAdmin);
router.patch('/:id/cancel', requireAuthentication, requireRole('admin'), cancelBookingAdmin);
router.patch('/:id/complete', requireAuthentication, requireRole('admin'), completeBookingAdmin);
router.patch('/:id/accept', requireAuthentication, requireRole('provider'), acceptBookingProvider);
router.patch('/:id/reject', requireAuthentication, requireRole('provider'), rejectBookingProvider);

module.exports = router;
