const express = require('express');

const router = express.Router();

const {
  registrationController,
  loginController,
  getCurrent,
  logout,
} = require('../../controllers/authController');

const validateBody = require('../../utils/validateBody');
const schemas = require('../../utils/validation/userValidationSchemas');

const { authMiddleware } = require('../../middleware/authMiddleware');

router
  .route('/register')
  .post(validateBody(schemas.registerSchema), registrationController);

router.route('/login').post(validateBody(schemas.loginSchema), loginController);

router.route('/current').get(authMiddleware, getCurrent);
router.route('/logout').post(authMiddleware, logout);

module.exports = { authRouter: router };
