const Joi = require('joi');
const ConflictError = require('../errors/ConflictError');
const {User} = require("../models/user");

const avatarRegex = /^(http|https):\/\/(?:www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+(?:#.+)?$/;

const userSchema = Joi.object({
  name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
  about: Joi.string().min(2).max(30).default('Исследователь'),
  avatar: Joi.string()
    .regex(avatarRegex)
    .required()
    .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  email: Joi.string()
    .email()
    .required()
    .external(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
    }),
  password: Joi.string().required().min(6),
});

module.exports = userSchema;
