const express = require('express');

const router = express.Router();

const {
  registrationController,
  loginController,
  getCurrent,
  logout,
} = require('../../controllers/authController');

const { authMiddleware } = require('../../middleware/authMiddleware');

router.route('/register').post(registrationController);
router.route('/login').post(loginController);
router.route('/current').get(authMiddleware, getCurrent);
router.route('/logout').post(authMiddleware, logout);

module.exports = { authRouter: router };
