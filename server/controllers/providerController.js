const User = require('../models/user');
const Service = require('../models/services');

const getProviderProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

const getProviderStatus = async (req, res, next) => {
  try {
    res.json({
      clerkId: req.user.clerkId,
      role: req.user.role,
      approvedByAdmin: req.user.approvedByAdmin,
      backgroundCheckStatus: req.user.backgroundCheckStatus,
      isActive: req.user.isActive
    });
  } catch (err) {
    next(err);
  }
};

const updateProviderProfile = async (req, res, next) => {
  try {
    const allowedFields = ['username', 'profilePicture', 'phone', 'bio'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedProvider = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    res.json(updatedProvider);
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

const updateProviderDocuments = async (req, res, next) => {
  try {
    const { documents } = req.body || {};

    if (!Array.isArray(documents)) {
      return res.status(400).json({ message: 'documents must be an array' });
    }

    req.user.documents = documents;
    req.user.backgroundCheckStatus = 'pending';
    req.user.approvedByAdmin = false;

    const updatedProvider = await req.user.save();
    res.json({
      message: 'Provider documents updated successfully',
      user: updatedProvider
    });
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

const getMyServices = async (req, res, next) => {
  try {
    const services = await Service.find({ providerClerkId: req.user.clerkId }).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
};

const getProviderByClerkId = async (req, res, next) => {
  try {
    const provider = await User.findOne({
      clerkId: req.params.clerkId,
      role: 'provider'
    });

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json(provider);
  } catch (err) {
    next(err);
  }
};

const getProviderServicesByClerkId = async (req, res, next) => {
  try {
    const provider = await User.findOne({
      clerkId: req.params.clerkId,
      role: 'provider'
    });

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const services = await Service.find({ providerClerkId: req.params.clerkId }).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProviderProfile,
  getProviderStatus,
  updateProviderProfile,
  updateProviderDocuments,
  getMyServices,
  getProviderByClerkId,
  getProviderServicesByClerkId
};
