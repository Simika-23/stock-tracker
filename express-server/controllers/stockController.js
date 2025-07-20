const axios = require('axios');
const Joi = require('joi');

// Joi schema to validate stock symbol for search
const stockSearchSchema = Joi.object({
  symbol: Joi.string().trim().uppercase().min(1).required()
});

// Joi schema to validate historical chart parameters
const historicalSchema = Joi.object({
  symbol: Joi.string().trim().uppercase().min(1).required(),
  range: Joi.string().valid('1day', '1week', '1month', '3months', '1year').default('1month'),
  interval: Joi.string().valid('1min', '5min', '15min', '30min', '1h', '1day') // optional
});

// GET: Real-time Stock Quote

const searchStock = async (req, res) => {
  try {
    const { symbol } = req.query;
    const value = await stockSearchSchema.validateAsync({ symbol });

    const apiUrl = `https://api.twelvedata.com/quote?symbol=${value.symbol}&apikey=${process.env.TWELVE_DATA_API_KEY}`;
    const response = await axios.get(apiUrl);

    if (!response.data || response.data.status === 'error') {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    const data = response.data;

    return res.status(200).json({
      success: true,
      data: {
        symbol: data.symbol,
        name: data.name,
        price: data.close,
        changePercent: data.change_pct
      }
    });
  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({ success: false, message: err.details[0].message });
    }
    console.error('searchStock error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch stock data' });
  }
};

// GET: Historical Stock Data 

const getHistoricalStockData = async (req, res) => {
  try {
    const { symbol, range, interval } = req.query;
    const value = await historicalSchema.validateAsync({ symbol, range, interval });

    const intervalMap = {
      '1day': '5min',
      '1week': '30min',
      '1month': '1h',
      '3months': '1day',
      '1year': '1day'
    };

    const finalInterval = value.interval || intervalMap[value.range] || '1h';

    const apiUrl = `https://api.twelvedata.com/time_series?symbol=${value.symbol}&interval=${finalInterval}&outputsize=100&apikey=${process.env.TWELVE_DATA_API_KEY}`;
    const response = await axios.get(apiUrl);

    if (!response.data || response.data.status === 'error' || !response.data.values) {
      return res.status(404).json({ success: false, message: 'Historical stock data not found' });
    }

    const dataPoints = response.data.values.map(point => ({
      datetime: point.datetime,
      timestamp: new Date(point.datetime).getTime(),
      open: parseFloat(point.open),
      high: parseFloat(point.high),
      low: parseFloat(point.low),
      close: parseFloat(point.close),
      volume: parseInt(point.volume, 10)
    }));

    const sortedData = dataPoints.sort((a, b) => a.timestamp - b.timestamp);

    return res.status(200).json({
      success: true,
      data: {
        symbol: value.symbol,
        interval: finalInterval,
        range: value.range,
        historicalData: sortedData
      }
    });
  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({ success: false, message: err.details[0].message });
    }
    console.error('getHistoricalStockData error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch historical stock data' });
  }
};


module.exports = {
  searchStock,
  getHistoricalStockData
};
