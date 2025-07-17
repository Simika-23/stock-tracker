const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authGuard = require('../middleware/authguard');
const {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist
} = require('../controllers/watchlistController');

// Rate limiter: 30 requests per minute per IP
const watchlistLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { message: "Too many requests on watchlist, please try again later." }
});

// Apply global middlewares
router.use(authGuard);
router.use(watchlistLimiter);

// Watchlist routes
router.post('/add', addToWatchlist);
router.get('/', getWatchlist);
router.delete('/:id', removeFromWatchlist);

module.exports = router;
