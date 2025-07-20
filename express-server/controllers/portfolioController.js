// portfolioController.js

const axios = require('axios');
const Joi = require('joi');
const Portfolio = require('../models/portfolio');

// Input Validation Schema using Joi
const portfolioSchema = Joi.object({
  stockSymbol: Joi.string().trim().uppercase().required(),
  quantity: Joi.number().positive().required(),
  purchasePrice: Joi.number().positive().required()
});

// Live Data Caching to reduce API load
const liveDataCache = new Map();

/**
 * Fetch detailed live stock data for portfolio entries
 * Caches result to optimize API calls during session
 */
const fetchLiveData = async (symbol) => {
  try {
    if (liveDataCache.has(symbol)) return liveDataCache.get(symbol); // Return cached data

    const { data } = await axios.get(
      `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${process.env.TWELVE_DATA_API_KEY}`
    );

    if (!data || data.status === 'error' || !data.name) return null;

    const parsed = {
      name: data.name,
      price: parseFloat(data.price),
      change_percent: data.percent_change,
      exchange: data.exchange,
      currency: data.currency,
      open: parseFloat(data.open),
      previous_close: parseFloat(data.previous_close)
    };

    liveDataCache.set(symbol, parsed);
    return parsed;
  } catch (err) {
    console.error(`Live data error for ${symbol}:`, err.message);
    return null;
  }
};

/**
 * Fetch only current stock price for performance calculations
 */
const fetchCurrentStockPrice = async (symbol) => {
  try {
    const { data } = await axios.get(
      `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${process.env.TWELVE_DATA_API_KEY}`
    );

    if (!data || data.status === 'error' || !data.price) return null;

    return parseFloat(data.price);
  } catch (err) {
    console.error(`Current price fetch error for ${symbol}:`, err.message);
    return null;
  }
};

const createPortfolioEntry = async (req, res) => {
  try {
    const { error, value } = portfolioSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { stockSymbol, quantity, purchasePrice } = value;
    const userId = req.user.id;

    const live = await fetchLiveData(stockSymbol);
    if (!live) return res.status(502).json({ success: false, message: 'Failed to retrieve live stock data.' });

    const newEntry = await Portfolio.create({
      userId,
      stockSymbol,
      quantity,
      purchasePrice,
      openingPrice: live.open ?? null,
      closingPrice: live.previous_close ?? null
    });

    res.status(201).json({ success: true, data: newEntry.get({ plain: true }) });
  } catch (err) {
    console.error(`User ${req.user.id} | Create Error:`, err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getPortfolioEntries = async (req, res) => {
  try {
    const userId = req.user.id;

    const portfolio = await Portfolio.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    const enriched = await Promise.all(portfolio.map(async entry => {
      const live = await fetchLiveData(entry.stockSymbol);
      return { ...entry.get({ plain: true }), live };
    }));

    res.status(200).json({ success: true, data: enriched });
  } catch (err) {
    console.error(`User ${req.user.id} | Fetch Error:`, err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getPortfolioEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const entry = await Portfolio.findOne({ where: { id, userId } });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });

    const live = await fetchLiveData(entry.stockSymbol);
    res.status(200).json({ success: true, data: { ...entry.get({ plain: true }), live } });
  } catch (err) {
    console.error(`User ${req.user.id} | Get By ID Error:`, err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updatePortfolioEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { stockSymbol, quantity, purchasePrice } = req.body;

    const entry = await Portfolio.findOne({ where: { id, userId } });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });

    if (quantity && quantity <= 0) return res.status(400).json({ success: false, message: 'Quantity must be positive' });
    if (purchasePrice && purchasePrice <= 0) return res.status(400).json({ success: false, message: 'Price must be positive' });

    entry.stockSymbol = stockSymbol ?? entry.stockSymbol;
    entry.quantity = quantity ?? entry.quantity;
    entry.purchasePrice = purchasePrice ?? entry.purchasePrice;

    await entry.save();
    res.status(200).json({ success: true, data: entry.get({ plain: true }) });
  } catch (err) {
    console.error(`User ${req.user.id} | Update Error:`, err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deletePortfolioEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const entry = await Portfolio.findOne({ where: { id, userId } });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });

    await entry.destroy();
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error(`User ${req.user.id} | Delete Error:`, err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getPortfolioPerformance = async (req, res) => {
  const userId = req.user.id;

  try {
    const portfolio = await Portfolio.findAll({ where: { userId } });

    let totalInvested = 0;
    let totalCurrent = 0;

    for (const item of portfolio) {
      totalInvested += item.quantity * item.purchasePrice;

      const currentPrice = await fetchCurrentStockPrice(item.stockSymbol);
      if (currentPrice === null) {
        return res.status(502).json({ success: false, message: `Failed to retrieve current price for ${item.stockSymbol}` });
      }

      totalCurrent += item.quantity * currentPrice;
    }

    const profitOrLoss = totalCurrent - totalInvested;
    const percentChange = totalInvested === 0 ? 0 : (profitOrLoss / totalInvested) * 100;

    res.status(200).json({ 
      success: true,
      data: {
        totalInvested,
        totalCurrent,
        profitOrLoss,
        percentChange
      }
    });
  } catch (error) {
    console.error("Performance calculation error:", error);
    res.status(500).json({ success: false, message: "Error calculating performance" });
  }
};

module.exports = {
  createPortfolioEntry,
  getPortfolioEntries,
  getPortfolioEntryById,
  updatePortfolioEntry,
  deletePortfolioEntry,
  getPortfolioPerformance
};
