const express = require('express');
const userControllers = require('../controllers/userController');

const router = express.Router();

router.route('/').post(userControllers.userSignup);
router.route('/login').post(userControllers.userLogin);
router.route('/me/access-token').get(userControllers.getToken);

module.exports = router