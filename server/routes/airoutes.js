const express = require('express');
const router = express.Router();
const { handleAIAssistant } = require('../controllers/aiController');

router.post('/booking-assistant', handleAIAssistant);

module.exports = router;