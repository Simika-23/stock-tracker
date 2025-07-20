const Joi = require('joi');
const axios = require('axios');

const sentimentSchema = Joi.object({
  symbol: Joi.string().trim().uppercase().optional().default('STOCK MARKET')
});

const getNewsSentiment = async (req, res) => {
  // Validate and apply default for symbol
  const { error, value } = sentimentSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const symbol = value.symbol;
  const userId = req.user?.id || 'Anonymous';

  try {
    // Fetch top 5 news articles from NewsAPI for the symbol
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: symbol,
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: 5
      },
      headers: {
        'X-Api-Key': process.env.NEWS_API_KEY
      }
    });

    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      source: article.source.name,
      publishedAt: article.publishedAt,
      url: article.url
    }));

    // Respond with structured data
    return res.status(200).json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        query: symbol,
        topHeadlines: articles
      }
    });
  } catch (err) {
    console.error(`User ${userId} | News Sentiment fetch error for "${symbol}":`, err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch news sentiment data. Please try again later.'
    });
  }
};

module.exports = {
  getNewsSentiment
};
