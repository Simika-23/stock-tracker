const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { getNewsSentiment } = require('../controllers/newsSentimentController');
const authGuard = require('../middleware/authguard');

// Rate limiter: max 5 requests per 15 minutes per user/IP
const sentimentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Too many sentiment analysis requests. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/sentiment', authGuard, sentimentLimiter, getNewsSentiment);

module.exports = router;
