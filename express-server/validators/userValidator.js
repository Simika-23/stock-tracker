const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required()
    .messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must be at most 30 characters',
    }),
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Please enter a valid email',
      'string.empty': 'Email is required',
    }),
  password: Joi.string().min(6).required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Please enter a valid email',
      'string.empty': 'Email is required',
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'Password is required',
    }),
});

module.exports = { registerSchema, loginSchema };
