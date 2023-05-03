const express = require('express');

const router = express.Router();
const upload = require('../../middleware/avatarMiddleware');

const {
  registrationController,
  loginController,
  getCurrent,
  logout,
  updateAvatar,
  verify,
  resendVerifyEmail,
} = require('../../controllers/authController');

const validateBody = require('../../utils/validateBody');
const schemas = require('../../utils/validation/userValidationSchemas');

const { authMiddleware } = require('../../middleware/authMiddleware');

router
  .route('/register')
  .post(validateBody(schemas.registerSchema), registrationController);

router.route('/verify/:verificationToken').get(verify);

router
  .route('/verify')
  .post(validateBody(schemas.emailSchema), resendVerifyEmail);

router.route('/login').post(validateBody(schemas.loginSchema), loginController);

router.route('/current').get(authMiddleware, getCurrent);
router.route('/logout').post(authMiddleware, logout);

router
  .route('/avatars')
  .patch(authMiddleware, upload.single('avatar'), updateAvatar);

// upload.fields([{name: "avatar", maxCount: 8}, {name: "avatar", maxCount: 1}])
// upload.array("cover", 8)

module.exports = { authRouter: router };
