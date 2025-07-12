const axios = require('axios');
const Joi = require('joi');

// Validation schema for query param
const stockSearchSchema = Joi.object({
  symbol: Joi.string().trim().min(1).required()
});

exports.searchStock = async (req, res) => {
  const { symbol } = req.query;

  // Validate input
  const { error } = stockSearchSchema.validate({ symbol });
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const apiUrl = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${process.env.TWELVEDATA_API_KEY}`;

    const response = await axios.get(apiUrl);

    const data = response.data;

    return res.json({
      symbol: data.symbol,
      name: data.name,
      price: data.close,           // use 'close' as price
      changePercent: data.change_pct, // percentage change
    });
  } catch (err) {
    console.error('Stock API error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch stock data' });
  }
};
