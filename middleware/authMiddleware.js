/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const { JWT_SECRET } = process.env;

const { AuthError } = require('../helpers/authError');

const authMiddleware = async (req, res, next) => {
  const [tokenType, token] = req.headers['authorization'].split(' ');

  if (!token) {
    next(new AuthError('Not authorized, please, provide a token'));
  }

  try {
    const user = jwt.decode(token, JWT_SECRET);

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(new AuthError('Not authorized, invalid token'));
  }
};

module.exports = { authMiddleware };
