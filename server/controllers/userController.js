const mongoose = require('mongoose');
const User = require('../models/user');
const { isValidObjectId } = require('../utils/validateObjectId');
const { handleDuplicateKeyError } = require('../utils/handleduplicate');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const getUserByClerkId = async (req, res, next) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  const user = new User({
    clerkId: req.body.clerkId,
    username: req.body.username,
    email: req.body.email,
    profilePicture: req.body.profilePicture,
    role: req.body.role,
    phone: req.body.phone,
    servicesOffered: req.body.servicesOffered,
    bio: req.body.bio,
    backgroundCheckStatus: req.body.backgroundCheckStatus,
    rating: req.body.rating
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    const duplicateClerkId = handleDuplicateKeyError(err, 'clerkId', 'Clerk ID already exists.');
    if (duplicateClerkId.handled) {
      return res.status(duplicateClerkId.status).json({ message: duplicateClerkId.message });
    }

    const duplicateUsername = handleDuplicateKeyError(err, 'username', 'Username already exists.');
    if (duplicateUsername.handled) {
      return res.status(duplicateUsername.status).json({ message: duplicateUsername.message });
    }

    const duplicateEmail = handleDuplicateKeyError(err, 'email', 'Email already exists.');
    if (duplicateEmail.handled) {
      return res.status(duplicateEmail.status).json({ message: duplicateEmail.message });
    }

    next({ status: 400, message: err.message });
  }
};

const updateUserById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUserByClerkId,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById
};
