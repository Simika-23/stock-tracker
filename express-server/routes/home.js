
const router = require('express').Router();

const homeController = require('../controllers/homeController');


router.get('/', homeController.renderWelcome)
router.get('/about', homeController.aboutPage)

module.exports = router;



