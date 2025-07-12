const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authguard');
const { createPortfolioEntry, getPortfolioEntries, updatePortfolioEntry, deletePortfolioEntry, getPortfolioEntryById } = require('../controllers/portfolioController');

router.post('/', authGuard, createPortfolioEntry);
router.get('/', authGuard, getPortfolioEntries);
router.get('/:id', authGuard, getPortfolioEntryById);
router.put('/:id', authGuard, updatePortfolioEntry);
router.delete('/:id', authGuard, deletePortfolioEntry);

module.exports = router;
