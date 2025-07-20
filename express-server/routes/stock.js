const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { searchStock, getHistoricalStockData } = require('../controllers/stockController');
const authGuard = require('../middleware/authguard'); 

// Rate limiter: 30 requests per minute per IP
const stockSearchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { message: "Too many requests, please try again later." }
});

// Secure route with authGuard and rate limiter
router.use(authGuard);
router.use(stockSearchLimiter);

router.get('/search', searchStock );
router.get('/chart', getHistoricalStockData)

module.exports = router;
