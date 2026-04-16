const User = require('../models/user');
const Service = require('../models/services');
const asyncHandler = require('../utils/asyncHandler');

function buildError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function findProviderByClerkId(clerkId) {
  if (!clerkId) {
    throw buildError('Clerk ID is required', 400);
  }

  const provider = await User.findOne({ clerkId, role: 'provider' });
  if (!provider) {
    throw buildError('Provider not found', 404);
  }

  return provider;
}

function toProviderPublic(provider) {
  return {
    id: provider._id,
    clerkId: provider.clerkId,
    username: provider.username,
    profilePicture: provider.profilePicture,
    bio: provider.bio,
    phone: provider.phone,
    servicesOffered: provider.servicesOffered,
    role: provider.role,
    rating: provider.rating
  };
}

const getProviderProfile = asyncHandler(async (req, res) => {
  res.json(toProviderPublic(req.user));
});

const getProviderStatus = asyncHandler(async (req, res) => {
  res.json({
    ...toProviderPublic(req.user),
    approvedByAdmin: req.user.approvedByAdmin,
    backgroundCheckStatus: req.user.backgroundCheckStatus,
    isActive: req.user.isActive
  });
});

const updateProviderProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['username', 'profilePicture', 'phone', 'bio'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No valid fields to update' });
  }

  const updatedProvider = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  });

  if (!updatedProvider) {
    throw buildError('Provider not found', 404);
  }

  res.json(toProviderPublic(updatedProvider));
});

const updateProviderDocuments = asyncHandler(async (req, res) => {
  const { documents } = req.body || {};
  if (!Array.isArray(documents)) {
    return res.status(400).json({ message: 'documents must be an array' });
  }

  const invalidDoc = documents.some((doc) => typeof doc !== 'string' || doc.trim() === '');
  if (invalidDoc) {
    return res.status(400).json({ message: 'Each document must be a non-empty string' });
  }

  req.user.documents = documents;
  req.user.backgroundCheckStatus = 'pending';
  req.user.approvedByAdmin = false;

  const updatedProvider = await req.user.save();
  res.json({
    message: 'Provider documents updated successfully',
    user: {
      ...toProviderPublic(updatedProvider),
      approvedByAdmin: updatedProvider.approvedByAdmin,
      backgroundCheckStatus: updatedProvider.backgroundCheckStatus,
      isActive: updatedProvider.isActive
    }
  });
});

const getMyServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ providerClerkId: req.user.clerkId }).sort({ createdAt: -1 });
  res.json(services);
});

const getProviderByClerkId = asyncHandler(async (req, res) => {
  const provider = await findProviderByClerkId(req.params.clerkId);
  res.json(toProviderPublic(provider));
});

const getProviderServicesByClerkId = asyncHandler(async (req, res) => {
  await findProviderByClerkId(req.params.clerkId);
  const services = await Service.find({ providerClerkId: req.params.clerkId }).sort({ createdAt: -1 });
  res.json(services);
});

module.exports = {
  getProviderProfile,
  getProviderStatus,
  updateProviderProfile,
  updateProviderDocuments,
  getMyServices,
  getProviderByClerkId,
  getProviderServicesByClerkId
};
