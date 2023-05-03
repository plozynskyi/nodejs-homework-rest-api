const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');
require('dotenv').config();

const { JWT_SECRET, BASE_URL } = process.env;

const { User } = require('../db/usersModel');
const { AuthError } = require('../helpers/authError');
const { sendEmail } = require('../helpers/sendEmail');
const resizeAvatar = require('../utils/resizeAvatar');

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const registrationService = async (email, password) => {
  const verifyUser = await User.findOne({ email });
  if (verifyUser) {
    throw new AuthError(409, `User with email: ${email} already exist`);
  }

  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const verifyEmail = {
    to: email,
    subject: 'Homework #6',
    html: `
      <p>Verification email, Homework #6</p>
      <a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">
        Click verify email
      </a>

    `,
  };

  await sendEmail(verifyEmail);

  const user = new User({
    email,
    password,
    avatarURL,
    verificationToken,
  });

  await user.save();
};

const loginService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AuthError(401, `User with email - ${email} not found`);
  }

  if (!user.verify) {
    throw new AuthError(
      404,
      `User with email - ${email} not verify, pleas check your email`
    );
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

const verifyService = async verificationToken => {
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new AuthError(404, `User not found`);
  }
  if (user.verify) {
    throw new AuthError(400, 'Verification has already been passed');
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  return user;
};

const resendVerifyEmailService = async email => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AuthError(404, `Email not found`);
  }
  if (user.verify) {
    throw new AuthError(400, `Email - ${user.email} already verify`);
  }
  const verifyEmail = {
    to: email,
    subject: 'Homework #6 (resent)',
    html: `
      <p>Verification email, Homework #6</p>
      <a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">
        Click verify email
      </a>

    `,
  };

  await sendEmail(verifyEmail);

  return user;
};

module.exports = {
  registrationService,
  loginService,
  avatarService,
  verifyService,
  resendVerifyEmailService,
};
