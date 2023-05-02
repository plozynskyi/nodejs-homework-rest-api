const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');

dotenv.config();
const { JWT_SECRET } = process.env;

const { User } = require('../db/usersModel');
const { AuthError } = require('../helpers/authError');
const resizeAvatar = require('../utils/resizeAvatar');

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const registrationService = async (email, password) => {
  const verifyUser = await User.findOne({ email });
  if (verifyUser) {
    throw new AuthError(409, `User with email: ${email} already exist`);
  }

  const avatarURL = gravatar.url(email);

  const user = new User({
    email,
    password,
    avatarURL,
  });

  await user.save();
};

const loginService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AuthError(401, `User with email - ${email} not found`);
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw new AuthError(401, 'Email or password is wrong');
  }

  const payload = {
    _id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  await User.findByIdAndUpdate(user._id, { token });

  return { token, user };
};

const avatarService = async (_id, tempUpload, filename) => {
  const avatarName = `${_id}_${filename}`;
  const resultUpload = path.join(avatarsDir, avatarName);
  const avatarURL = path.join('avatars', avatarName);

  await resizeAvatar(tempUpload, 250, 250);

  await fs.rename(tempUpload, resultUpload);

  const avatarUpdateResult = await User.findByIdAndUpdate(
    _id,
    { avatarURL },
    { new: true }
  );

  return avatarUpdateResult;
};

module.exports = {
  registrationService,
  loginService,
  avatarService,
};
