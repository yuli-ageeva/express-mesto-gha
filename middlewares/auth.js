const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'your-secret-key'); // Замените 'your-secret-key' на ваш секретный ключ JWT
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }

  req.user = payload;
  next();
};

module.exports = authMiddleware;
