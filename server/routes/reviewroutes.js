const express = require('express');
const router = express.Router();
const { requireAuthentication } = require('../middleware/auth');
const {requireRole} = require('../middleware/role');
const {
  getAllReviews,
  getReviewById,
  createReview
} = require('../controllers/reviewController');

router.get('/', getAllReviews);
router.get('/:id', getReviewById);
router.post('/', requireAuthentication, requireRole('customer'), createReview);

module.exports = router;
