const User = require('../models/user');
const { isValidObjectId } = require('../utils/validateObjectId');
const asyncHandler = require('../utils/asyncHandler');

function buildError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const getAllUsersAdmin = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

const getUserByIdAdmin = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw buildError('User not found', 404);
  }

  res.json(user);
});

const getPendingProviders = asyncHandler(async (req, res) => {
  const providers = await User.find({
    approvedByAdmin: false,
    backgroundCheckStatus: 'pending'
  }).sort({ createdAt: -1 });

  res.json(providers);
});

const getApprovedProviders = asyncHandler(async (req, res) => {
  const providers = await User.find({
    role: 'provider',
    approvedByAdmin: true,
    backgroundCheckStatus: 'approved'
  }).sort({ createdAt: -1 });

  res.json(providers);
});

const getProviderRequestById = async (id) => {
  if (!isValidObjectId(id)) {
    return { error: { status: 400, message: 'Invalid user id' } };
  }

  const user = await User.findById(id);

  if (!user) {
    return { error: { status: 404, message: 'User not found' } };
  }

  if (user.role === 'admin') {
    return { error: { status: 400, message: 'Admin accounts cannot be moderated as providers' } };
  }

  return { user };
};

const approveProvider = asyncHandler(async (req, res) => {
  const result = await getProviderRequestById(req.params.id);
  if (result.error) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  const user = result.user;
  user.role = 'provider';
  user.approvedByAdmin = true;
  user.backgroundCheckStatus = 'approved';

  const updatedUser = await user.save();
  res.json({
    message: 'Provider approved successfully',
    user: updatedUser
  });
});

const rejectProvider = asyncHandler(async (req, res) => {
  const result = await getProviderRequestById(req.params.id);
  if (result.error) {
    return res.status(result.error.status).json({ message: result.error.message });
  }

  const user = result.user;
  user.role = 'customer';
  user.approvedByAdmin = false;
  user.backgroundCheckStatus = 'rejected';

  const updatedUser = await user.save();
  res.json({
    message: 'Provider rejected successfully',
    user: updatedUser
  });
});

const activateUser = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw buildError('User not found', 404);
  }

  user.isActive = true;

  const updatedUser = await user.save();
  res.json({
    message: 'User activated successfully',
    user: updatedUser
  });
});

const deactivateUser = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw buildError('User not found', 404);
  }

  user.isActive = false;

  const updatedUser = await user.save();
  res.json({
    message: 'User deactivated successfully',
    user: updatedUser
  });
});

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
