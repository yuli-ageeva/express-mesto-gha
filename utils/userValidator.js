const { celebrate, Joi, Segments} = require('celebrate');
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


module.exports = {
  validateUserCreation,
  validateUserLogin,
  validateUpdateUser,
  validateUpdateAvatar,
};
