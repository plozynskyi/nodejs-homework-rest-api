const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const { JWT_SECRET } = process.env;

const { User } = require('../db/usersModel');
const { AuthError } = require('../helpers/authError');

const registrationService = async (email, password) => {
  const verifyUser = await User.findOne({ email });
  if (verifyUser) {
    throw new AuthError(409, `User with email: ${email} already exist`);
  }
  const user = new User({
    email,
    password,
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

module.exports = {
  registrationService,
  loginService,
};
