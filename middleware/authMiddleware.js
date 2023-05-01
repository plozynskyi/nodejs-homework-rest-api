const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { JWT_SECRET } = process.env;

const { User } = require('../db/usersModel');
const { AuthError } = require('../helpers/authError');

const authMiddleware = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    next(new AuthError(401, 'Not authorized, please, provide a token'));
  }

  try {
    const { _id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(_id);

    if (token !== user.token || !user || !user.token) {
      next(AuthError(401, 'Not authorized, invalid token'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AuthError(401, 'Not authorized, invalid token'));
  }
};

module.exports = { authMiddleware };
