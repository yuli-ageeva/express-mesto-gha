const NotFoundError = require('../errors/NotFoundError');
const RequestError = require('../errors/RequestError');
const InternalServerError = require('../errors/InternalServerError');
const AuthError = require('../errors/AuthError');
const ConflictError = require('../errors/ConflictError');
const ForbiddenError = require('../errors/ForbiddenError');

function errorHandler() {
  return (err, req, res, _next) => {
    const error = (
      err instanceof NotFoundError
      || err instanceof RequestError
      || err instanceof AuthError
      || err instanceof ConflictError
      || err instanceof ForbiddenError

    )
      ? err
      : new InternalServerError();
    res.status(error.statusCode).json({ message: error.message });
  };
}

module.exports = errorHandler;
