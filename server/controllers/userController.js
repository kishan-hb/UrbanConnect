const User = require('../models/user');
const { isValidObjectId } = require('../utils/validateObjectId');
const { handleDuplicateKeyError } = require('../utils/handleduplicate');
const asyncHandler = require('../utils/asyncHandler');

function buildError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function isAdminByClerkId(clerkId) {
  if (!clerkId) return false;
  const requester = await User.findOne({ clerkId }).select('role');
  return requester?.role === 'admin';
}

async function canAccessUserByClerkId(requesterClerkId, targetClerkId) {
  if (!requesterClerkId || !targetClerkId) return false;
  if (requesterClerkId === targetClerkId) return true;
  return isAdminByClerkId(requesterClerkId);
}

const getAllUsers = asyncHandler(async (req, res) => {
  const isAdmin = await isAdminByClerkId(req.auth?.userId);
  if (!isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const users = await User.find();
  res.json(users);
});

const getUserByClerkId = asyncHandler(async (req, res) => {
  const allowed = await canAccessUserByClerkId(req.auth?.userId, req.params.clerkId);
  if (!allowed) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const user = await User.findOne({ clerkId: req.params.clerkId });
  if (!user) {
    throw buildError('User not found', 404);
  }

  res.json(user);
});

const getUserById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw buildError('User not found', 404);
  }

  const allowed = await canAccessUserByClerkId(req.auth?.userId, user.clerkId);
  if (!allowed) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  res.json(user);
});

const createUser = asyncHandler(async (req, res) => {
  const requesterClerkId = req.auth?.userId;
  if (!requesterClerkId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const requesterIsAdmin = await isAdminByClerkId(requesterClerkId);

  const user = new User({
    clerkId: requesterClerkId,
    username: req.body.username,
    email: req.body.email,
    profilePicture: req.body.profilePicture,
    role: requesterIsAdmin ? req.body.role : 'customer',
    phone: req.body.phone,
    servicesOffered: req.body.servicesOffered,
    bio: req.body.bio,
    backgroundCheckStatus: requesterIsAdmin ? req.body.backgroundCheckStatus : undefined,
    rating: requesterIsAdmin ? req.body.rating : undefined
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

    throw buildError(err.message, 400);
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const existingUser = await User.findById(req.params.id);
  if (!existingUser) {
    throw buildError('User not found', 404);
  }

  const requesterClerkId = req.auth?.userId;
  const allowed = await canAccessUserByClerkId(requesterClerkId, existingUser.clerkId);
  if (!allowed) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const requesterIsAdmin = await isAdminByClerkId(requesterClerkId);
  const safeUpdates = { ...req.body };

  delete safeUpdates.clerkId;

  if (!requesterIsAdmin) {
    delete safeUpdates.role;
    delete safeUpdates.backgroundCheckStatus;
    delete safeUpdates.rating;
    delete safeUpdates.approvedByAdmin;
    delete safeUpdates.isActive;
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, safeUpdates, {
    new: true,
    runValidators: true
  });

  res.json(updatedUser);
});

const deleteUserById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const existingUser = await User.findById(req.params.id);
  if (!existingUser) {
    throw buildError('User not found', 404);
  }

  const allowed = await canAccessUserByClerkId(req.auth?.userId, existingUser.clerkId);
  if (!allowed) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

const requestProviderAccess = asyncHandler(async (req, res) => {
  const requesterClerkId = req.auth?.userId;
  if (!requesterClerkId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { phone, bio, servicesOffered, documents } = req.body || {};
  if (!Array.isArray(documents) || documents.length === 0) {
    return res.status(400).json({ message: 'documents must be a non-empty array' });
  }

  const hasInvalidDoc = documents.some((doc) => typeof doc !== 'string' || doc.trim() === '');
  if (hasInvalidDoc) {
    return res.status(400).json({ message: 'Each document must be a non-empty string' });
  }

  if (phone !== undefined && typeof phone !== 'string') {
    return res.status(400).json({ message: 'phone must be a string' });
  }

  if (bio !== undefined && typeof bio !== 'string') {
    return res.status(400).json({ message: 'bio must be a string' });
  }

  if (servicesOffered !== undefined && !Array.isArray(servicesOffered)) {
    return res.status(400).json({ message: 'servicesOffered must be an array' });
  }

  const user = await User.findOne({ clerkId: requesterClerkId });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.role === 'admin') {
    return res.status(403).json({ message: 'Admin cannot request provider access' });
  }

  if (user.role === 'provider' && user.approvedByAdmin) {
    return res.status(400).json({ message: 'User is already an approved provider' });
  }

  if (user.backgroundCheckStatus === 'pending') {
    return res.status(400).json({ message: 'Provider request is already pending' });
  }

  user.documents = documents;
  user.backgroundCheckStatus = 'pending';
  user.approvedByAdmin = false;

  if (typeof phone === 'string') {
    user.phone = phone.trim();
  }

  if (typeof bio === 'string') {
    user.bio = bio.trim();
  }

  if (Array.isArray(servicesOffered)) {
    user.servicesOffered = servicesOffered;
  }

  const updatedUser = await user.save();

  res.json({
    message: 'Provider access request submitted successfully',
    user: {
      id: updatedUser._id,
      clerkId: updatedUser.clerkId,
      role: updatedUser.role,
      approvedByAdmin: updatedUser.approvedByAdmin,
      backgroundCheckStatus: updatedUser.backgroundCheckStatus,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      servicesOffered: updatedUser.servicesOffered,
      documents: updatedUser.documents
    }
  });
});

module.exports = {
  getAllUsers,
  getUserByClerkId,
  getUserById,
  createUser,
  requestProviderAccess,
  updateUserById,
  deleteUserById
};

