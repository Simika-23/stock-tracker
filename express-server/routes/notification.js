const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authguard');
const { getUserNotifications, markAsRead } = require('../controllers/notificationController');

router.get('/', authGuard, getUserNotifications);
router.put('/:id/read', authGuard, markAsRead);

module.exports = router;
