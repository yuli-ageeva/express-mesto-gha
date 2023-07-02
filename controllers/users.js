const { User } = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const RequestError = require('../errors/RequestError');

function getUsers(req, res, next) {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
}

function getUserById(req, res, next) {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({
        data: user,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new RequestError('Передано некорректное id пользователя'));
      }
      return next(err);
    });
}

function createUser(req, res, next) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new RequestError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
}
function checkRange(n, min, max, errMsg) {
  if (n < min || n > max) {
    throw new RequestError(errMsg);
  }
}

function updateUserProfile(req, res, next) {
  const { name, about } = req.body;
  const userId = req.user._id;
  checkRange(name.length, 2, 30, 'Переданы некорректные данные при обновлении пользователя');
  checkRange(about.length, 2, 30, 'Переданы некорректные данные при обновлении пользователя');

  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch(next);
}

function updateUserAvatar(req, res, next) {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch(next);
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
