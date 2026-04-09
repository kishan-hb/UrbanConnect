const express = require('express');
const router = express.Router();
const { requireAuthentication } = require('../middleware/auth');
const {requireRole} = require('../middleware/role');
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', requireAuthentication, requireRole('provider'), createService);
router.patch('/:serviceId', requireAuthentication, requireRole('provider'), updateService);
router.delete('/:serviceId', requireAuthentication, requireRole('provider'), deleteService);

module.exports = router;
