const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const { JWT_SECRET } = process.env;

const { User } = require('../db/usersModel');
const { AuthError } = require('../helpers/authError');

const registrationService = async ({ email, password }) => {
  const user = new User({
    email,
    password,
  });

  await user.save();
};

const loginService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AuthError(`User with email - ${email} not found`);
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new AuthError('Email or password is wrong');
  }

  const token = jwt.sign(
    {
      _id: user._id,
      createdAd: user.createdAd,
    },
    JWT_SECRET
  );

  return token;
};

module.exports = {
  registrationService,
  loginService,
};
