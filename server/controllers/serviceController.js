const Service = require('../models/services');
const { isValidObjectId } = require('../utils/validateObjectId');
const { handleDuplicateKeyError } = require('../utils/handleduplicate');
const { validateRequiredFields } = require('../utils/validateRequiredFields');
const asyncHandler = require('../utils/asyncHandler');

function buildError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const getAllServices = asyncHandler(async (req, res) => {
  const search = (req.query.search || '').trim();
  const zip = (req.query.zip || '').trim();

  const filter = {};

  if (search) {
    const safeSearch = escapeRegex(search);
    const searchRegex = new RegExp(safeSearch, 'i');
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { category: searchRegex }
    ];
  }

  if (zip) {
    const safeZip = escapeRegex(zip);
    filter['location.zipCode'] = new RegExp(`^${safeZip}$`, 'i');
  }

  const services = await Service.find(filter).sort({ createdAt: -1 });
  res.json(services);
});

const getServiceById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid service id' });
  }

  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }

  res.json(service);
});

const createService = asyncHandler(async (req, res) => {
  const {
    serviceId,
    category,
    title,
    description,
    price,
    availability,
    location
  } = req.body || {};
  const requiredFields = validateRequiredFields(req.body, ['serviceId', 'category', 'title', 'price']);

  if (!requiredFields.isValid) {
    return res.status(400).json({
      message: `Missing required fields: ${requiredFields.missingFields.join(', ')}`
    });
  }

  const service = new Service({
    serviceId,
    providerClerkId: req.auth.userId,
    category,
    title,
    description,
    price,
    availability,
    location
  });

  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    const duplicateError = handleDuplicateKeyError(err, 'serviceId', 'Service ID already exists.');
    if (duplicateError.handled) {
      return res.status(duplicateError.status).json({ message: duplicateError.message });
    }

    throw buildError(err.message, 400);
  }
});

module.exports = {
  getAllServices,
  getServiceById,
  createService
};
