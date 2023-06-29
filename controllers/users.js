const { User } = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const RequestError = require('../errors/RequestError');
const InternalServerError = require('../errors/InternalServerError');

function getUsers(req, res) {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      throw new InternalServerError('На сервере произошла ошибка');
    });
}

function getUserById(req, res) {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(() => {
      throw new InternalServerError('На сервере произошла ошибка');
    });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new RequestError('Переданы некорректные данные при создании пользователя');
      } else {
        throw new InternalServerError('На сервере произошла ошибка');
      }
    });
}

function updateUserProfile(req, res) {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch(() => {
      throw new InternalServerError('На сервере произошла ошибка');
    });
}

function updateUserAvatar(req, res) {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch(() => {
      throw new InternalServerError('На сервере произошла ошибка');
    });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
