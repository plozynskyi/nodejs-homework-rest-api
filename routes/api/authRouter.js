const express = require('express');

const router = express.Router();

const { asyncWrapper } = require('../../helpers/apiHelper');

const {
  registrationController,
  loginController,
} = require('../../controllers/authController');

router.route('/register').post(asyncWrapper(registrationController));
router.route('/login').post(asyncWrapper(loginController));

module.exports = { authRouter: router };
