const Joi = require('joi');

const portfolioSchema = Joi.object({
  userId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'User ID must be a number',
      'number.integer': 'User ID must be an integer',
      'number.positive': 'User ID must be positive',
      'any.required': 'User ID is required',
    }),
  stockSymbol: Joi.string().min(1).max(10).required()
    .messages({
      'string.empty': 'Stock symbol is required',
      'string.min': 'Stock symbol must be at least 1 character',
      'string.max': 'Stock symbol must be at most 10 characters',
    }),
  quantity: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.positive': 'Quantity must be positive',
      'any.required': 'Quantity is required',
    }),
  purchasePrice: Joi.number().positive().required()
    .messages({
      'number.base': 'Purchase price must be a number',
      'number.positive': 'Purchase price must be positive',
      'any.required': 'Purchase price is required',
    }),
});

module.exports = { portfolioSchema };
