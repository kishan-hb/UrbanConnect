const express = require('express');
const router = express.Router();
const { requireAuthentication } = require('../middleware/auth');
const {
  getAllUsers,
  getUserByClerkId,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById
} = require('../controllers/userController');

router.get('/', getAllUsers);

router.get('/clerk/:clerkId', getUserByClerkId);
router.get('/:id', getUserById);
router.post('/', requireAuthentication, createUser);
router.put('/:id', requireAuthentication, updateUserById);
router.delete('/:id', requireAuthentication, deleteUserById);

module.exports = router;
