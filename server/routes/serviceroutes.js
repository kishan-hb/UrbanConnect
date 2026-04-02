const express = require('express');
const router = express.Router();
const { requireAuthentication } = require('../middleware/auth');
const {requireRole} = require('../middleware/role');
const {
  getAllServices,
  getServiceById,
  createService
} = require('../controllers/serviceController');

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', requireAuthentication, requireRole('provider'), createService);

module.exports = router;
