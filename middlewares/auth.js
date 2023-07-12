const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const headers = JSON.stringify(req.headers)
    throw new AuthError(`Необходим заголовок авторизации с префиксом Bearer. Список заголовков: [${headers}]`);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }

  req.user = payload;
  next();
};

module.exports = auth;
