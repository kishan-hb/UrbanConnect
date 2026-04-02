const Service = require('../models/services');
const { isValidObjectId } = require('../utils/validateObjectId');
const { handleDuplicateKeyError } = require('../utils/handleduplicate');
const { validateRequiredFields } = require('../utils/validateRequiredFields');

const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    next(err);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid service id' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (err) {
    next(err);
  }
};

const createService = async (req, res, next) => {
  try {
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

    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    const duplicateError = handleDuplicateKeyError(err, 'serviceId', 'Service ID already exists.');
    if (duplicateError.handled) {
      return res.status(duplicateError.status).json({ message: duplicateError.message });
    }

    next({ status: 400, message: err.message });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService
};
