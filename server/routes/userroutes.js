const express = require('express');
const router = express.Router();
const { requireAuthentication } = require('../middleware/auth');
const {
  getAllUsers,
  getUserByClerkId,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  requestProviderAccess
} = require('../controllers/userController');

router.get('/', requireAuthentication, getAllUsers);
router.get('/clerk/:clerkId', requireAuthentication, getUserByClerkId);
router.get('/:id', requireAuthentication, getUserById);
router.post('/', requireAuthentication, createUser);
router.put('/:id', requireAuthentication, updateUserById);
router.delete('/:id', requireAuthentication, deleteUserById);
router.post('/request-provider-access', requireAuthentication, requestProviderAccess);

module.exports = router;

