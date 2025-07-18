const Joi = require('joi');
const Alert = require('../models/alert');

const alertSchema = Joi.object({
  stockSymbol: Joi.string().trim().uppercase().required(),
  targetPrice: Joi.number().positive().required(),
  condition: Joi.string().valid('above', 'below').required(),
  isActive: Joi.boolean()
});

const createAlert = async (req, res) => {
  const { error, value } = alertSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const alert = await Alert.create({
      userId: req.user.id,
      ...value
    });
    res.status(201).json({ success: true, data: alert });
  } catch (err) {
    console.error(`User ${req.user.id} | Create Alert Error:`, err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
    res.status(200).json({ success: true, data: alerts });
  } catch (err) {
    console.error(`User ${req.user.id} | Get Alerts Error:`, err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateAlert = async (req, res) => {
  const { id } = req.params;
  const { error, value } = alertSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const alert = await Alert.findOne({ where: { id, userId: req.user.id } });
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });

    await alert.update(value);
    res.status(200).json({ success: true, data: alert });
  } catch (err) {
    console.error(`User ${req.user.id} | Update Alert Error:`, err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteAlert = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Alert.destroy({ where: { id, userId: req.user.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Alert not found' });

    res.status(200).json({ success: true, message: 'Alert deleted' });
  } catch (err) {
    console.error(`User ${req.user.id} | Delete Alert Error:`, err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createAlert,
  getAlerts,
  updateAlert,
  deleteAlert
};
