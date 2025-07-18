const Joi = require('joi');
const axios = require('axios');
const Watchlist = require('../models/watchlist');

const watchlistSchema = Joi.object({
  stockSymbol: Joi.string().trim().uppercase().required()
});

// Add stock to watchlist
const addToWatchlist = async (req, res) => {
  const { error, value } = watchlistSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const { stockSymbol } = value;
  const userId = req.user.id;

  try {
    const existing = await Watchlist.findOne({ where: { userId, stockSymbol } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Stock already in watchlist' });
    }

    const newEntry = await Watchlist.create({ userId, stockSymbol });
    res.status(201).json({ success: true, message: 'Added to watchlist', data: newEntry });
  } catch (err) {
    console.error(`User ${userId} | Add Watchlist Error:`, err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user's watchlist with live stock prices
const getWatchlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const items = await Watchlist.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    // For each stock in watchlist, fetch live price from API
    const enrichedItems = await Promise.all(items.map(async (item) => {
      try {
        const response = await axios.get(`https://api.twelvedata.com/price?symbol=${item.stockSymbol}&apikey=${process.env.TWELVE_DATA_API_KEY}`);
        item.dataValues.price = response.data.price || "N/A";
      } catch (err) {
        console.error(`Price fetch failed for ${item.stockSymbol}:`, err.message);
        item.dataValues.price = "Unavailable";
      }
      return item;
    }));

    res.status(200).json({ success: true, data: enrichedItems });
  } catch (err) {
    console.error(`User ${userId} | Get Watchlist Error:`, err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove stock from watchlist
const removeFromWatchlist = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  try {
    const deleted = await Watchlist.destroy({ where: { id, userId } });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Stock not found in watchlist' });
    }

    res.status(200).json({ success: true, message: 'Removed from watchlist' });
  } catch (err) {
    console.error(`User ${userId} | Remove Watchlist Error:`, err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist
};
