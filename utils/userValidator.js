const { celebrate, Joi } = require('celebrate');

const avatarRegex = /^(http|https):\/\/(?:www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+(?:#.+)?$/;

const validateUserCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(avatarRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});
const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(avatarRegex),
  }),
});

const validateIdUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  validateUserCreation,
  validateUserLogin,
  validateUpdateUser,
  validateUpdateAvatar,
  validateIdUser,
};
