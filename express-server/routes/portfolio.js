const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authGuard = require('../middleware/authguard');
const { createPortfolioEntry, getPortfolioEntries, updatePortfolioEntry, deletePortfolioEntry, getPortfolioEntryById, getPortfolioPerformance } = require('../controllers/portfolioController');

// Rate limiter: 60 requests per minute per IP
const portfolioLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  message: { message: "Too many requests on portfolio, please try again later." }
});

// Apply authGuard first, then rate limiting middleware
router.use(authGuard);
router.use(portfolioLimiter);

router.post('/', authGuard, createPortfolioEntry);
router.get('/', authGuard, getPortfolioEntries);
router.get('/:id', authGuard, getPortfolioEntryById);
router.put('/:id', authGuard, updatePortfolioEntry);
router.delete('/:id', authGuard, deletePortfolioEntry);
router.get('/performance', authGuard, getPortfolioPerformance);

module.exports = router;
