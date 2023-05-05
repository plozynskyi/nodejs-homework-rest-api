const {
  registrationService,
  loginService,
  avatarService,
  verifyService,
  resendVerifyEmailService,
} = require('../services/authServices');

const { User } = require('../db/usersModel');
const { asyncWrapper } = require('../helpers/apiHelper');

let registrationController = async (req, res) => {
  const { name, email, password } = req.body;

  await registrationService(name, email, password);
  res.json({ status: 'success' });
};

registrationController = asyncWrapper(registrationController);

let loginController = async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await loginService(email, password);
  res.json({
    status: 'success',
    token,
    user: {
      name: user.name,
      email: user.email,
      subscription: user.subscription,
    },
  });
};

loginController = asyncWrapper(loginController);

let getCurrent = async (req, res) => {
  const { name, email, subscription } = req.user;
  res.json({
    name,
    email,
    subscription,
  });
};

getCurrent = asyncWrapper(getCurrent);

let logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  res.json({
    message: 'Logout success',
  });
};

logout = asyncWrapper(logout);

let updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, filename } = req.file;
  const { avatarURL, email } = await avatarService(_id, tempUpload, filename);
  res.json({
    message: `Avatar change successful - ${email}`,
    avatarURL,
  });
};

updateAvatar = asyncWrapper(updateAvatar);

let verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await verifyService(verificationToken);
  res.json({
    message: `Verification - ${user.email} success`,
  });
};

verify = asyncWrapper(verify);

let resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await resendVerifyEmailService(email);
  res.json({
    message: `Resend verification mail to - ${user.email} success`,
    user,
  });
};

resendVerifyEmail = asyncWrapper(resendVerifyEmail);

module.exports = {
  registrationController,
  loginController,
  getCurrent,
  logout,
  updateAvatar,
  verify,
  resendVerifyEmail,
};
