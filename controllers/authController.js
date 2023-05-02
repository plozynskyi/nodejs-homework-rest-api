const {
  registrationService,
  loginService,
  avatarService,
} = require('../services/authServices');

const { User } = require('../db/usersModel');
const { asyncWrapper } = require('../helpers/apiHelper');

let registrationController = async (req, res) => {
  const { email, password } = req.body;

  await registrationService(email, password);
  res.json({ status: 'success' });
};

registrationController = asyncWrapper(registrationController);

let loginController = async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await loginService(email, password);
  res.json({
    status: 'success',
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

loginController = asyncWrapper(loginController);

let getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
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

module.exports = {
  registrationController,
  loginController,
  getCurrent,
  logout,
  updateAvatar,
};
