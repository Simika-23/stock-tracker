
const route = require('express').Router();

const homeController = require('../controllers/homeController');


route.get('/', homeController.renderWelcome)
route.get('/about', homeController.aboutPage)
route.get('/register', homeController.createUser)
route.get('/login', homeController.loginUsers)
route.get('/profile', homeController.viewProfile)
route.get('/changepassword',homeController.changePassword)


module.exports = route;



