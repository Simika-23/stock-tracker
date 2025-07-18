const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authguard');
const { createAlert, getAlerts, updateAlert, deleteAlert } = require('../controllers/alertController');
const { checkAlerts } = require('../controllers/alertChecker');
const isAdmin = require('../middleware/isAdmin');

router.use(authGuard);

router.post('/', createAlert);
router.get('/', getAlerts);
router.put('/:id', updateAlert);
router.delete('/:id', deleteAlert);

router.get('/check', authGuard, isAdmin, async (req, res) => {
  try {
    await checkAlerts();
    res.status(200).json({ success: true, message: 'Alert checked manually' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;