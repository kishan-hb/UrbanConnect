const mongoose = require('mongoose');
const User = require('../models/user');
const { isValidObjectId } = require('../utils/validateObjectId');

const getAllUsersAdmin = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const getUserByIdAdmin = async (req, res, next) => {
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

const getPendingProviders = async (req, res, next) => {
  try {
    const providers = await User.find({
      role: 'provider',
      approvedByAdmin: false
    }).sort({ createdAt: -1 });

    res.json(providers);
  } catch (err) {
    next(err);
  }
};

const getApprovedProviders = async (req, res, next) => {
  try {
    const providers = await User.find({
      role: 'provider',
      approvedByAdmin: true
    }).sort({ createdAt: -1 });

    res.json(providers);
  } catch (err) {
    next(err);
  }
};

const getProviderById = async (id) => {
  if (!isValidObjectId(id)) {
    return { error: { status: 400, message: 'Invalid user id' } };
  }

  const user = await User.findById(id);

  if (!user) {
    return { error: { status: 404, message: 'User not found' } };
  }

  if (user.role !== 'provider') {
    return { error: { status: 400, message: 'Only provider accounts can be moderated' } };
  }

  return { user };
};

const approveProvider = async (req, res, next) => {
  try {
    const result = await getProviderById(req.params.id);
    if (result.error) {
      return res.status(result.error.status).json({ message: result.error.message });
    }

    const user = result.user;
    user.approvedByAdmin = true;
    user.backgroundCheckStatus = 'approved';

    const updatedUser = await user.save();
    res.json({
      message: 'Provider approved successfully',
      user: updatedUser
    });
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

const rejectProvider = async (req, res, next) => {
  try {
    const result = await getProviderById(req.params.id);
    if (result.error) {
      return res.status(result.error.status).json({ message: result.error.message });
    }

    const user = result.user;
    user.approvedByAdmin = false;
    user.backgroundCheckStatus = 'rejected';

    const updatedUser = await user.save();
    res.json({
      message: 'Provider rejected successfully',
      user: updatedUser
    });
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

const activateUser = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = true;

    const updatedUser = await user.save();
    res.json({
      message: 'User activated successfully',
      user: updatedUser
    });
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;

    const updatedUser = await user.save();
    res.json({
      message: 'User deactivated successfully',
      user: updatedUser
    });
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

module.exports = {
  getAllUsersAdmin,
  getUserByIdAdmin,
  getPendingProviders,
  getApprovedProviders,
  approveProvider,
  rejectProvider,
  activateUser,
  deactivateUser
};
