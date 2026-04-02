const express = require('express');
const router = express.Router();
const { requireAuthentication } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const {
  getAllUsersAdmin,
  getUserByIdAdmin,
  getPendingProviders,
  getApprovedProviders,
  approveProvider,
  rejectProvider,
  activateUser,
  deactivateUser
} = require('../controllers/adminController');

router.get('/users', requireAuthentication, requireRole('admin'), getAllUsersAdmin);
router.get('/users/:id', requireAuthentication, requireRole('admin'), getUserByIdAdmin);
router.get('/providers/pending', requireAuthentication, requireRole('admin'), getPendingProviders);
router.get('/providers/approved', requireAuthentication, requireRole('admin'), getApprovedProviders);
router.patch('/providers/:id/approve', requireAuthentication, requireRole('admin'), approveProvider);
router.patch('/providers/:id/reject', requireAuthentication, requireRole('admin'), rejectProvider);
router.patch('/users/:id/activate', requireAuthentication, requireRole('admin'), activateUser);
router.patch('/users/:id/deactivate', requireAuthentication, requireRole('admin'), deactivateUser);

module.exports = router;
