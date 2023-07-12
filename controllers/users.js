const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const RequestError = require('../errors/RequestError');
const AuthError = require('../errors/AuthError');
const ConflictError = require('../errors/ConflictError');

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

function getUserProfile(req, res, next) {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new RequestError('Передано некорректное id пользователя'));
      }
      return next(err);
    });
}

function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const saltRounds = 10;

  bcrypt.hash(password, saltRounds)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        return next(new RequestError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
}

function checkLength(n, min, max, errMsg) {
  if (n === undefined) return;
  if (n.length < min || n.length > max) {
    throw new RequestError(errMsg);
  }
}

function updateUserProfile(req, res, next) {
  const { name, about } = req.body;
  const userId = req.user._id;
  checkLength(name, 2, 30, 'Переданы некорректные данные при обновлении пользователя');
  checkLength(about, 2, 30, 'Переданы некорректные данные при обновлении пользователя');

  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new RequestError('Переданы некорректные данные при обновлении пользователя'));
      }
      return next(err);
    });
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new RequestError('Переданы некорректные данные при обновлении аватара'));
      }
      return next(err);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new AuthError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return next(new RequestError('Ошибка при проверке пароля'));
        }

        if (!isMatch) {
          return next(new AuthError('Неправильные почта или пароль'));
        }
        const payload = { _id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('jwt', token, { httpOnly: true });
        return res.status(200).send({ message: 'Аутентификация прошла успешно' });
      });
    })
    .catch(next);
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  getUserProfile,
};
