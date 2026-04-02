const express = require('express');
const router = express.Router();
const { requireAuthentication } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const {
  getProviderProfile,
  getProviderStatus,
  updateProviderProfile,
  updateProviderDocuments,
  getMyServices,
  getProviderByClerkId,
  getProviderServicesByClerkId
} = require('../controllers/providerController');

router.get('/me', requireAuthentication, requireRole('provider'), getProviderProfile);
router.get('/me/status', requireAuthentication, requireRole('provider'), getProviderStatus);
router.patch('/me/profile', requireAuthentication, requireRole('provider'), updateProviderProfile);
router.patch('/me/documents', requireAuthentication, requireRole('provider'), updateProviderDocuments);
router.get('/me/services', requireAuthentication, requireRole('provider'), getMyServices);

router.get('/:clerkId', getProviderByClerkId);
router.get('/:clerkId/services', getProviderServicesByClerkId);

module.exports = router;
