const axios = require('axios');
const Alert = require('../models/alert');
const Notification = require('../models/notification');

const checkAlerts = async () => {
  // console.log("AlertChecker running at", new Date().toISOString());

  try {
    const activeAlerts = await Alert.findAll({ where: { isActive: true } });

    for (const alert of activeAlerts) {
      const { stockSymbol, targetPrice, condition, userId } = alert;
      console.log(`Checking ${stockSymbol}: Target $${targetPrice}, Condition '${condition}'`);

      try {
        const response = await axios.get(`https://api.twelvedata.com/price?symbol=${stockSymbol}&apikey=${process.env.TWELVE_DATA_API_KEY}`);

        if (!response.data || !response.data.price) {
          console.warn(`No price data for ${stockSymbol}. Response:`, response.data);
          continue;
        }

        const currentPrice = parseFloat(response.data.price);
        const isConditionMet =
          (condition === 'above' && currentPrice >= targetPrice) ||
          (condition === 'below' && currentPrice <= targetPrice);

        if (isConditionMet) {
          console.log(`Condition met: ${stockSymbol} is ${condition} $${targetPrice} (Current: $${currentPrice})`);

          await Notification.create({
            userId,
            message: `${stockSymbol} is ${condition} $${targetPrice}. Current price: $${currentPrice}`
          });

          alert.isActive = false;
          await alert.save();
        } else {
          console.log(`Not met: ${stockSymbol} is $${currentPrice}`);
        }

      } catch (err) {
        console.error(`API error for ${stockSymbol}:`, err.message);
      }
    }
  } catch (err) {
    console.error('AlertChecker failed:', err.message);
  }
};

// Run checkAlerts every 60 seconds
setInterval(checkAlerts, 60 * 1000);

module.exports = { checkAlerts };
