const NotFoundError = require('../errors/NotFoundError');
const RequestError = require('../errors/RequestError');
const InternalServerError = require('../errors/InternalServerError');

const errorHandler = function (err, req, res, _next) {
  const error = (
    err instanceof NotFoundError
    || err instanceof RequestError
  )
    ? err
    : new InternalServerError();
  res.status(error.statusCode).json({ message: error.message });
};

module.exports = errorHandler;
